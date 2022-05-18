"""Trains and Evaluates deepCregr network.
"""

from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
import csv
import os.path
import time
import sys

import numpy as np
import tensorflow as tf
import pysam

import deepCregr

print_step_loss=[]
print_val_loss=[]

# Basic model parameters as external flags -------------------------------------
flags = tf.app.flags
FLAGS = flags.FLAGS
#flags.DEFINE_boolean('help', False, 'For help.')
flags.DEFINE_string('log', 'log', 'log')
flags.DEFINE_string('train_data_file', '', 'Input data: pseudo bed format: chr start end and comma separated classes')
flags.DEFINE_string('valid_data_file', '', 'Input data: pseudo bed format: chr start end and comma separated classes')
flags.DEFINE_string('train_data_file_rc', '', 'Input data: pseudo bed format: chr start end and comma separated classes')
flags.DEFINE_string('valid_data_file_rc', '', 'Input data: pseudo bed format: chr start end and comma separated classes')

# TRAININGS SETTINGS
# flags.DEFINE_float('learning_rate_decay_steps', 5000, 'Steps to parameterize the exponential learning rate decay: LR will be LR * 0.96 every X steps.')
flags.DEFINE_integer('max_epoch', 2, 'Number of epoch through train data to run trainer.')
flags.DEFINE_float('keep_prob_inner', 0.8, 'Keep probability for dropout')
flags.DEFINE_float('keep_prob_outer', 0.8, 'Keep probability for dropout. LEGACY Option not used in current model implementation.')
flags.DEFINE_integer('batch_size', 1, 'Batch size.')
flags.DEFINE_float('l2_strength', 0.0001, 'L2 regularization strength.')
# ARCHITECHTURE
# CONVOLUTIONAL STACK OPTIONS
flags.DEFINE_integer('conv_layers', 3, 'Number of convolutional layers.')
flags.DEFINE_string('hidden_units_scheme', '300,600,900,20', 'Comma seperated hidden units scheme. Must have length of number of conv layers specified!')
flags.DEFINE_string('kernel_width_scheme', '20,8,8,1', 'Comma seperated kernel width scheme. Must have length of number of conv layers specified!')
flags.DEFINE_string('max_pool_scheme', '5,5,5,1', 'Comma seperated max pool scheme. Must have length of number of conv layers specified!')
# DILATIONAL
flags.DEFINE_string('dilation_scheme', '2,4,8', 'Comma seperated dilation scheme to use..')
flags.DEFINE_integer('dilation_units', 20, 'Dilation Units (Filter).')
flags.DEFINE_integer('dilation_width', 3, 'Dilation Width (Only 2 supported at the moment).')
flags.DEFINE_boolean('dilation_batch_norm', False, 'If to apply batchnorm propagate residuals through the dilated layer stacks.')
# # RESIDUAL AND SKIP CONNECTIONS
flags.DEFINE_boolean('dilation_residual', False, 'If to propagate residuals through the dilated layer stacks.')
flags.DEFINE_boolean('dilation_residual_dense', False, 'If the residual/dilated layer should have a dense 1x1 convolution build in.')
# OPTIMIZER (ADAM) options
flags.DEFINE_float('learning_rate', 0.0001, 'Initial learning rate.')
flags.DEFINE_float('beta1', 0.9, 'ADAM: beta1.')
flags.DEFINE_float('beta2', 0.999, 'ADAM: beta2.')
flags.DEFINE_float('epsilon', 1e-08, 'ADAM: epsilon.')
# TRAIN LOCATION
flags.DEFINE_string('train_dir', 'training_run_data', 'Directory to put the training data.')
flags.DEFINE_string('reload_model', "False", 'If to reload a checkpoint/model file use string: \"False\" if not to reload (default); \"continue\" if to continue a training process on the same data or \"transfer\" if to load the entire model but strat training from scratch.')
flags.DEFINE_string('model', None, 'Path to checkpoint/model file.')
# Options for preseeding with pretreined weights
flags.DEFINE_boolean('seed_weights', False, 'Select if to pre seed weights with numpy array stored weights. Convolutional only ...')
flags.DEFINE_string('seed_scheme', '0,0,0', 'Specify which layers are preseeded with the weights provided. [format: 1,1,0]')
flags.DEFINE_string('seed_file', None, 'Path to saved numpy file with saved weights. Weight and bias dimensions must match with the ones specified as hyper params for this run!')
# machine options
flags.DEFINE_integer('gpu', 0, 'Select a single available GPU and mask the rest. Default 0.')
# Log Options
flags.DEFINE_integer('report_every', 100, 'Set interval of batch steps o when to report raining loss and log progress, losses and weights etc.')
# flag if to train with boolean values stored (labels and sequence)
flags.DEFINE_string('store_dtype', 'uint16', 'Indicate that sequence where stored as bools rather then integers. Will convert automatically.')
# Whole genome fasta file for accessing genome sequences
flags.DEFINE_string('hap1', None, 'Path to whole genome fasta file for reading the genomic sequence')
flags.DEFINE_string('hap2', None, 'Path to whole genome fasta file for reading the genomic sequence')
flags.DEFINE_integer('seed', 1234, 'Random seed for tensorflow (graph level).')
flags.DEFINE_string('ascn_file', None, 'path to ascn file')

# GLOBAL Options ---------------------------------------------------------------
flags.DEFINE_integer('bp_context', 1000000, 'Number of classes to classify. Default 600.')
flags.DEFINE_integer('num_classes', 50, 'Number of classes to classify. Default 182.')
BP_CONTEXT = FLAGS.bp_context
NUM_CLASSES = FLAGS.num_classes



# SET RANDOM SEED --------------------------------------------------------------
np.random.seed(FLAGS.seed)  # use same seed for numpy --> for shuffeling

# Process/Prepare Train Test Valid Options ---------------------------------------

# Process/Prepare some Dilation Options ---------------------------------------
# Make list out of the passed dilation scheme string
dilation_scheme = [x.strip() for x in FLAGS.dilation_scheme.split(',')]
dilation_scheme = list(map(int, dilation_scheme))
hidden_units_scheme = [x.strip() for x in FLAGS.hidden_units_scheme.split(',')]
hidden_units_scheme = list(map(int, hidden_units_scheme))
kernel_width_scheme = [x.strip() for x in FLAGS.kernel_width_scheme.split(',')]
kernel_width_scheme = list(map(int, kernel_width_scheme))
max_pool_scheme = [x.strip() for x in FLAGS.max_pool_scheme.split(',')]
max_pool_scheme = list(map(int, max_pool_scheme))
seed_scheme = [x.strip() for x in FLAGS.seed_scheme.split(',')]
seed_scheme = list(map(int, seed_scheme))
# residual channels/units must be the same as dilation
residual_units = FLAGS.dilation_units

ascn_class=2

# TEST
if FLAGS.reload_model == "continue":
    print("Will restore previous model checkpoint for contiuning training ...")
elif FLAGS.reload_model == "transfer":
    print("Will restore previous model checkpoint for transfer learning ...")

# Assert length of schemes all match specified number of conv layers
if len(hidden_units_scheme) != FLAGS.conv_layers:
    print("Hidden Units Scheme does not have the number of entries expected from 'conv_layers' ...")
    sys.exit()
if len(kernel_width_scheme) != FLAGS.conv_layers:
    print("Hidden Width Scheme does not have the number of entries expected from 'conv_layers' ...")
    sys.exit()
if len(max_pool_scheme) != FLAGS.conv_layers:
    print("Max Pool Scheme does not have the number of entries expected from 'conv_layers' ...")
    sys.exit()
if FLAGS.seed_weights and len(seed_scheme) != FLAGS.conv_layers:
    print("Seed Scheme does not have the number of entries expected from 'conv_layers' ...")
    sys.exit()

# STARTING ---------------------------------------------------------------------
print("STARTING: ...")

# HELPER FUNCTIONS -------------------------------------------------------------
def placeholder_inputs(batch_size, dtype):
  """Generate placeholder variables to represent the input tensors.

  These placeholders are used as inputs by the rest of the model building
  code and will be fed from the downloaded data in the .run() loop, below.

  Args:
    batch_size: The batch size will be baked into both placeholders.
    dtype: dtaype in which seq and labels are/ will be stored

  Returns:
    seqs_placeholder: Sequences (hot coded) placeholder.
    labels_placeholder: Labels placeholder.
  """
  # sess = tf.InteractiveSession()
  if dtype == 'bool':
      seqs_placeholder = tf.compat.v1.placeholder(tf.bool, [None, BP_CONTEXT, 4], name='seqs')
      labels_placeholder = tf.compat.v1.placeholder(tf.uint8, shape=[None, NUM_CLASSES], name='labels')
  if dtype == 'uint8':
      seqs_placeholder = tf.compat.v1.placeholder(tf.uint8, [None, BP_CONTEXT, 4], name='seqs')
      labels_placeholder = tf.compat.v1.placeholder(tf.uint8, shape=[None, NUM_CLASSES], name='labels')
  else:
      seqs_placeholder = tf.compat.v1.placeholder(tf.int32, [None, BP_CONTEXT, 4], name='seqs')
      labels_placeholder = tf.compat.v1.placeholder(tf.float32, shape=[None, NUM_CLASSES], name='labels')
  # Note that the shapes of the placeholders match the shapes
  return seqs_placeholder, labels_placeholder
def load_chromosomes(genome_file):
  """ Load genome segments from either a FASTA file or
          chromosome length table. -- from Basenji: Kelly et al 2018"""

  # is genome_file FASTA or (chrom,start,end) table?
  file_fasta = (open(genome_file).readline()[0] == '>')

  chrom_segments = {}

  if file_fasta:
    fasta_open = pysam.Fastafile(genome_file)
    for i in range(len(fasta_open.references)):
      chrom_segments[fasta_open.references[i]] = [(0, fasta_open.lengths[i])]
    fasta_open.close()

  else:
    for line in open(genome_file):
      a = line.split()
      chrom_segments[a[0]] = [(0, int(a[1]))]

  return(chrom_segments)

def get_hot_coded_seq(sequence, dtype="int32"):
    """Convert a 4 base letter sequence to 4-row x-cols hot coded sequence"""
    # initialise empty
    hotsequence = np.zeros((len(sequence),4), dtype=dtype)
    # set hot code 1 according to gathered sequence
    for i in range(len(sequence)):
        if sequence[i] == 'A':
            hotsequence[i,0] = 1
        elif sequence[i] == 'C':
            hotsequence[i,1] = 1
        elif sequence[i] == 'G':
            hotsequence[i,2] = 1
        elif sequence[i] == 'T':
            hotsequence[i,3] = 1
    # return the numpy array
    return hotsequence
def get_hot_coded_seq_rc(sequence, dtype="int32"):
    hotsequence = np.zeros((len(sequence),4), dtype=dtype)
    ls=len(sequence)
    for i in range(ls):
        if sequence[i] == 'A':
            hotsequence[ls-1-i,3] = 1
        elif sequence[i] == 'C':
            hotsequence[ls-1-i,2] = 1
        elif sequence[i] == 'G':
            hotsequence[ls-1-i,1] = 1
        elif sequence[i] == 'T':
            hotsequence[ls-1-i,0] = 1
    return hotsequence


def get_hot_coded_seq_bool(sequence):
    """Convert a 4 base letter sequence to 4-row x-cols hot coded sequence"""
    # initialise empty
    hotsequence = np.zeros((len(sequence),4), dtype='bool')
    # set hot code 1 according to gathered sequence
    for i in range(len(sequence)):
        if sequence[i] == 'A':
            hotsequence[i,0] = True
        elif sequence[i] == 'C':
            hotsequence[i,1] = True
        elif sequence[i] == 'G':
            hotsequence[i,2] = True
        elif sequence[i] == 'T':
            hotsequence[i,3] = True
    # return the numpy array
    return hotsequence

def split_bins_regr(label, num_classes):
  '''Helper Function to create a binarized numpy array for representing
  the respective class associations'''
  # init regr bin representatons -----------------------------------------------
  # Go through labels per seq/position and fill regr bin values
  label_bin = np.zeros((len(label), num_classes), dtype="float32")
  for j in range(len(label)):
      l = label[j].split(",")  # split by comma
      for i in range(len(l)):
          label_bin[j,i] = l[i]

  return(label_bin)
def read_regr_file(fi, num_classes,dtype='int32'):
    with open(fi, "r") as f:
        label = []
        for i,l in enumerate(f):
            l = l.rstrip()
            l = l.split("\t")
            label.append(l[3])
        regr_bin = split_bins_regr(label, num_classes)
    return regr_bin

def get_chr_seq(whg_fasta, chromosome, rc_tag, dtype = "uint8"):
    '''Get entire chromosome sequence as hot encoded sequence to query from'''
    with pysam.Fastafile(whg_fasta) as fa:
        seq = fa.fetch(reference = chromosome)
        seq = seq.upper()
        if rc_tag:
            seq = get_hot_coded_seq_rc(seq, dtype)
        else:
            seq = get_hot_coded_seq(seq, dtype)
    return(seq)
def get_ascn_seq(seq, ascn_file,chrom, rc_tag, geno_len, hap):
        if hap == 1:
                hap_index=3
        elif hap == 2:
                hap_index=4
        ascn_seq=seq
        with open(ascn_file, "r") as f:
                for l in csv.reader(f, delimiter='\t'):
                        if l[0] == chrom:
                            if rc_tag:
                                ascn_seq[(geno_len-1-int(l[2])):(geno_len-int(l[1])),:]=ascn_seq[(geno_len-1-int(l[2])):(geno_len-int(l[1])),:]*int(l[hap_index])
                            else:
                                ascn_seq[(int(l[1])):(int(l[2])),:]=ascn_seq[(int(l[1])):(int(l[2])),:]*int(l[hap_index])
        return ascn_seq


def fill_seqs(chr_seq, positions_stored, indeces, batch_size, seq_length, dtype = "uint8"):
    # init
    if dtype == 'bool':
        feed_seqs = np.zeros((batch_size, seq_length, 4), dtype = 'bool')
    elif dtype == 'uint8':
        feed_seqs = np.zeros((batch_size, seq_length, 4), dtype = 'uint8')
    else:
        feed_seqs = np.zeros((batch_size, seq_length, 4), dtype = 'int')
    # fill from temp chromosome sequence stored
    for i in range(batch_size):
        feed_seqs[i,] = chr_seq[positions_stored[indeces[i],0]:positions_stored[indeces[i],1]]

    return(feed_seqs)


def fill_seqs_ascn(chr_seq1, chr_seq2, start, end, ascn_class, seq_length, dtype = "uint8"):
    # init
    if dtype == 'bool':
        feed_seqs = np.zeros((ascn_class, seq_length, 4), dtype = 'bool')
    elif dtype == 'uint8':
        feed_seqs = np.zeros((ascn_class, seq_length, 4), dtype = 'uint8')
    else:
        feed_seqs = np.zeros((ascn_class, seq_length, 4), dtype = 'int')
    # fill from temp chromosome sequence stored
#    print(positions_stored[indeces[0],0])
#    print(positions_stored[indeces[0],1])
    feed_seqs[0,] = chr_seq1[start:end,:]
    feed_seqs[1,] = chr_seq2[start:end,:]
    return(feed_seqs)

def make_numpy_seed(
    seed_weights_list_loaded,
    seed_scheme,
    hidden_units_scheme,
    kernel_width_scheme):
    '''Make a list of numpy arrays to preseed the conv_max pool part of the net.
    If the new dimensions (hidden units, kernel_width, ...) match with the new run
    this will pre seed them as they are provided in the numpy file.
    If the dimenstions
    are larger, this will sample the excess weights to use from the distribution of
    weights to preseed in the respective same layer.
    If the new dimensions are
    smaller then the previous one (throw an error).
    Arguments:
        seed_weights_list_loaded: numpt list of arrays in right dimension.
        seed_scheme: list of seed scheme 1s and 0s
    Returns:
        list of numpy arrays (arr_0 ... arr_9) depending on the layers to preseed,
        where 0,2,4,... are the 3D weigths and 1,3,5,... are the 1D biases'''
    # get how many layers to preseed
    seed_sum = sum(seed_scheme)
    # 0,2,4, ... is weights /// 1,3,5 ... is biases
    # initialise empty arrays according to shapes
    seed_weights_list = {}
    excess_layer_count = 0
    for i in range(seed_sum):  #TODO get number of layers to preload from preloading scheme
        w = i * 2
        b = w + 1
        weights_load_string = 'arr_' + str(w)
        biases_load_string = 'arr_' + str(b)
        # get respective dimensions
        hu = hidden_units_scheme[i]
        kw = kernel_width_scheme[i]
        if i == 0:
            indim = 4
        else:
            indim = hidden_units_scheme[i-1]
        init_weights = np.zeros((kw, indim, hu), dtype='float32')# initialise weights
        init_biases = np.zeros((hu), dtype='float32')  # and biases
        # get respective preloadable seeds
        seed_weights = seed_weights_list_loaded[weights_load_string]
        seed_biases = seed_weights_list_loaded[biases_load_string]
        seed_weights_shape = seed_weights.shape
        # get excess dimension range if present
        excess_neurons_in = indim - seed_weights_shape[1]
        excess_neurons_out = hu - seed_weights_shape[2]
        excess_neurons_width = kw - seed_weights_shape[0]

        # check for negative dimensions abort
        if excess_neurons_in < 0 and excess_neurons_out and excess_neurons_width < 0:
            print('Specified Convolutional Dimensions are smaller then what you are trying to preseed with. Only equal or larger allowed ...')
            sys.exit()

        if excess_neurons_width > 0 or excess_neurons_in > 0 or excess_neurons_out > 0:
            print('New specified dimensions in layer %s are larger then seed provided. Sampling excess weights from that distribution per layer!' % (i+1))
            excess_layer_count += 1
        # seed with whats available
        init_weights[0:seed_weights_shape[0], 0:seed_weights_shape[1], 0:seed_weights_shape[2]] = seed_weights

        # if excess present sample excess weights from seeded (maintain distribution)
        if excess_neurons_out > 0:  # A) excess in hidden units dimension
            to_sample = kw * indim * excess_neurons_out
            sampled = np.random.choice(seed_weights.flatten(), size = to_sample, replace = True)
            # fill array
            init_weights[0:kw, 0:indim, seed_weights_shape[2]:hu] = np.reshape(
                sampled, (kw, indim, excess_neurons_out))

        if excess_neurons_in > 0:  # B) excess in hidden units previous dimension (or input)
            to_sample = kw * excess_neurons_in * seed_weights_shape[2]
            sampled = np.random.choice(seed_weights.flatten(), size = to_sample, replace = True)
            # fill array
            init_weights[0:kw, seed_weights_shape[1]:indim, 0:seed_weights_shape[2]] = np.reshape(
                sampled, (kw, excess_neurons_in, seed_weights_shape[2]))

        if excess_neurons_width > 0:  # B) excess in hidden units previous dimension (or input)
            to_sample = excess_neurons_width * seed_weights_shape[1] * seed_weights_shape[2]
            sampled = np.random.choice(seed_weights.flatten(), size = to_sample, replace = True)
            # fill array
            init_weights[seed_weights_shape[0]:kw, 0:seed_weights_shape[1], 0:seed_weights_shape[2]] = np.reshape(
                sampled, (excess_neurons_width, seed_weights_shape[1], seed_weights_shape[2]))

        # fill with seeds
        init_biases[0:seed_weights_shape[2]] = seed_biases
        if excess_neurons_out > 0:
            to_sample = excess_neurons_out
            sampled = np.random.choice(seed_biases.flatten(), size = to_sample, replace = True)
            init_biases[seed_weights_shape[2]:hu] = sampled

        seed_weights_list[weights_load_string] = init_weights
        seed_weights_list[biases_load_string] = init_biases

    return(seed_weights_list, excess_layer_count)

def do_eval(sess,
            # eval_correct,
            eval_loss,
            seqs_placeholder,
            labels_placeholder,
            labels_test,
            hap1,
            hap2,
            hap1_l,
            hap2_l,
            rc_tag,
            shift_tag,
            keep_prob_inner_placeholder,
            keep_prob_outer_placeholder
            ):
    """Runs one evaluation against the full epoch of test data.
    Return test accuracy and mean test loss per batch.

    Args:
    sess: The session in which the model has been trained.
    # eval_correct: The Tensor that returns the number of correct predictions.
    seqs_placeholder: The sequences placeholder.
    labels_placeholder: The labels placeholder.
    keep_prob_pl: placeholder for the keep probability
    lines: Opend lines object of training data file
    cases: number of lines/cases in input file
    """
    # And run one epoch of eval.
    true_count = 0  # Counts the number of correct predictions.
    test_loss = 0
    cases = labels_test.shape[0]
    test_step = 0

    test_cases = np.shape(labels_test)[0]

    if rc_tag:
        lf=FLAGS.valid_data_file_rc
    else:
        lf=FLAGS.valid_data_file
    if shift_tag:
        lf=lf+".shift"

    with open(lf) as f:
        f=csv.reader(f, delimiter='\t')
        for l in f:
            if l[0][3:] == "X":
                chr_number=22
            else:
                chr_number=int(l[0][3:])-1
            if rc_tag:
                feed_dict = {
                      seqs_placeholder: fill_seqs_ascn(hap1[chr_number], hap2[chr_number], hap1_l[chr_number]-1-int(l[2]), hap2_l[chr_number]-1-int(l[1]), ascn_class, BP_CONTEXT, dtype=FLAGS.store_dtype),
                      labels_placeholder: labels_test[test_step:(test_step+1),],
                      keep_prob_inner_placeholder: 1.0,
                      keep_prob_outer_placeholder: 1.0
                      }
            else:
                feed_dict = {
                    seqs_placeholder: fill_seqs_ascn(hap1[chr_number], hap2[chr_number], int(l[1]), int(l[2]), ascn_class, BP_CONTEXT, dtype=FLAGS.store_dtype),
                    labels_placeholder: labels_test[test_step:(test_step+1),],
                    keep_prob_inner_placeholder: 1.0,
                    keep_prob_outer_placeholder: 1.0
                    }



            tmp_test_loss = sess.run([eval_loss], feed_dict=feed_dict)
            # print(tmp_test_loss)

            # true_count += tmp_true_count
            test_loss = test_loss + tmp_test_loss[0]
            test_step=test_step+1



    test_loss = test_loss / test_step

    print('Num examples: %d Test Loss: %0.04f' %
    (cases, test_loss))

    return test_loss  # return precision

def run_training():
  """Train for a number of steps."""

  # Get the sets labels and chromosome positions
  # split into train test and validation -------------------------------

#  train_chrom_d, train_chroms, train_position, train_regr_bin, test_chrom_d, test_chroms, test_position, test_regr_bin, valid_chrom_d, valid_chroms, valid_position, valid_regr_bin = read_train_file(FLAGS.data_file, NUM_CLASSES, test_chromosomes, validation_chromosomes, FLAGS.store_dtype)

  train_regr_bin=read_regr_file(FLAGS.train_data_file, NUM_CLASSES,FLAGS.store_dtype)
  train_regr_bin_shift=read_regr_file(FLAGS.train_data_file+".shift", NUM_CLASSES,FLAGS.store_dtype)
  valid_regr_bin=read_regr_file(FLAGS.valid_data_file, NUM_CLASSES,FLAGS.store_dtype)
  valid_regr_bin_shift=read_regr_file(FLAGS.valid_data_file+".shift", NUM_CLASSES,FLAGS.store_dtype)
  train_regr_bin_rc=read_regr_file(FLAGS.train_data_file_rc, NUM_CLASSES,FLAGS.store_dtype)
  train_regr_bin_rc_shift=read_regr_file(FLAGS.train_data_file_rc+".shift", NUM_CLASSES,FLAGS.store_dtype)
  valid_regr_bin_rc=read_regr_file(FLAGS.valid_data_file_rc, NUM_CLASSES,FLAGS.store_dtype)
  valid_regr_bin_rc_shift=read_regr_file(FLAGS.valid_data_file_rc+".shift", NUM_CLASSES,FLAGS.store_dtype)




  # load seed weights if specified
  if FLAGS.seed_weights:
    print("Loading saved weights ...")
    seed_weights_list = np.load(FLAGS.seed_file)
    # get numpy seed array augment excess dimension with sampling where needed
    seed_weights_list, excess_count = make_numpy_seed(seed_weights_list, seed_scheme, hidden_units_scheme, kernel_width_scheme)
  else:
    seed_weights_list = ""

  # Write configuration/parameters to specified train dir
  # WRITE HYPER PARAMETERS and DATA PROPERTIES TO RUN LOG FILE
  current_time = time.localtime()
  timestamp = str(current_time[0]) + str(current_time[1]) + str(current_time[2]) + str(current_time[3]) + str(current_time[4])

  if not os.path.exists(FLAGS.train_dir):  # make train dir
      os.makedirs(FLAGS.train_dir)

  param_log_file = open(FLAGS.train_dir + '/hyperparameters_' + timestamp + '.log', 'w')
  param_log_file.write("# Hyperparameters for dilationDHS run at: " + str(current_time))
  param_log_file.write("\n\nInput: " + str(BP_CONTEXT) + " bp")
#  param_log_file.write("\nTest Chromosomes: " + str(FLAGS.test_chroms))
#  param_log_file.write("\nValidation Chromosomes: " + str(FLAGS.validation_chroms))
  param_log_file.write("\n\nArchitechture:")
  for i in range(FLAGS.conv_layers):
    j = i + 1
    param_log_file.write("\nHidden Units Layer %s: %s" % (j, hidden_units_scheme[i]))
    param_log_file.write("\nKernel Width Layer %s: %s" % (j, kernel_width_scheme[i]))
    param_log_file.write("\nMax Pool Layer %s: %s" % (j, max_pool_scheme[i]))
  param_log_file.write("\nDilatio Scheme: " + str(FLAGS.dilation_scheme))
  param_log_file.write("\nDialtion Units: " + str(FLAGS.dilation_units))
  param_log_file.write("\nDilation Width: " + str(FLAGS.dilation_width))
  param_log_file.write("\nDilation Batch Norm: " + str(FLAGS.dilation_batch_norm))
  param_log_file.write("\nDilation with Residuals: " + str(FLAGS.dilation_residual))
  param_log_file.write("\nDilation with dense Residuals: " + str(FLAGS.dilation_residual_dense))
  if FLAGS.seed_weights:
      param_log_file.write("\nPre-seeding with saved weights: " + FLAGS.seed_file)
      if excess_count > 0:
          param_log_file.write("\nSome new dimensions are larger then the pre seeded ones;\n sampling the excess weights from same distribution per layer.")
  param_log_file.write("\n\nTraining Parameters:")
  param_log_file.write("\nBatch size: " + str(FLAGS.batch_size))
  param_log_file.write("\nDropout Keep Probability Inner: " + str(FLAGS.keep_prob_inner))
  param_log_file.write("\nDropout Keep Probability Outer: " + str(FLAGS.keep_prob_outer) + " # LEGACY option not used in final models published.")
  param_log_file.write("\nLearning Rate (Intital): " + str(FLAGS.learning_rate))
  param_log_file.write("\n(ADAM) Beta 1: " + str(FLAGS.beta1))
  param_log_file.write("\n(ADAM) Beta 2: " + str(FLAGS.beta2))
  param_log_file.write("\n(ADAM) Epsilon: " + str(FLAGS.epsilon))
  param_log_file.write("\nMaximum Epoch Number: " + str(FLAGS.max_epoch) + "\n")
  param_log_file.write("\nL2 Regularizer Strength: " + str(FLAGS.l2_strength) + "\n")

  param_log_file.write("____________________________________________________\n")
  param_log_file.close()

  # Tell TensorFlow that the model will be built into the default Graph.
  with tf.Graph().as_default():

    # set seeds
    tf.compat.v1.set_random_seed(FLAGS.seed)

    # Generate placeholders for the seqs and labels (and dropout prob).
    seqs_placeholder, labels_placeholder = placeholder_inputs(FLAGS.batch_size, FLAGS.store_dtype)
    keep_prob_inner_placeholder = tf.compat.v1.placeholder(tf.float32, name='keep_prob_inner')
    keep_prob_outer_placeholder = tf.compat.v1.placeholder(tf.float32, name='keep_prob_outer')

    # Building the Graph -------------------------------------------------------
    # Create a variable to track the global step.
    global_step = tf.Variable(0, name='global_step', trainable=False)

    # Ops to calc regression_score
    regression_score = deepCregr.inference(
        seqs_placeholder,
        FLAGS.conv_layers,
        hidden_units_scheme,
        kernel_width_scheme,
        max_pool_scheme,
        dilation_scheme,
        FLAGS.dilation_units,
        FLAGS.dilation_width,
        FLAGS.dilation_residual,
        FLAGS.dilation_residual_dense,
        FLAGS.dilation_batch_norm,
        NUM_CLASSES,
        ascn_class,
        keep_prob_inner_placeholder,
        keep_prob_outer_placeholder,
        FLAGS.seed_weights,
        seed_scheme,
        seed_weights_list
        )
    tf.compat.v1.add_to_collection("regression_score", regression_score)

    # Add to the Graph the Ops for loss calculation.
    loss = deepCregr.loss(regression_score, labels_placeholder, FLAGS.l2_strength, FLAGS.batch_size)
    l2_loss = deepCregr.l2_loss(regression_score)
    loss_test = deepCregr.loss_test(regression_score, labels_placeholder, FLAGS.batch_size)
    tf.compat.v1.add_to_collection("loss_test", loss_test)

    # Add to the Graph the Ops that calculate and apply gradients.
    train_op = deepCregr.training(
        loss,
        FLAGS.learning_rate,
        FLAGS.beta1,
        FLAGS.beta2,
        FLAGS.epsilon,
        global_step)
    tf.compat.v1.add_to_collection("train_op", train_op)

    # # Add the Ops to compare the regression_score to the labels during evaluation.
    # eval_op = deepCregr.evaluation(regression_score, labels_placeholder)
    # tf.compat.v1.add_to_collection("eval_op", eval_op)

    # Build the summary Tensor based on the TF collection of Summaries.
    summary = tf.compat.v1.summary.merge_all()

    # Create a saver for writing training checkpoints.
    saver = tf.compat.v1.train.Saver(max_to_keep=100)

    # init op
    init = tf.compat.v1.global_variables_initializer()

    # Create a session for running Ops on the Graph.
    config = tf.compat.v1.ConfigProto();
    config.gpu_options.visible_device_list = str(FLAGS.gpu)
    config.allow_soft_placement = True
    sess = tf.compat.v1.Session(config = config)

    # Instantiate a SummaryWriter to output summaries and the Graph.
    summary_writer = tf.compat.v1.summary.FileWriter(FLAGS.train_dir, graph=sess.graph)

    # print(tf.get_collection(tf.GraphKeys.GLOBAL_VARIABLES))
    # sys.exit()

    # reload model if specified or initialize ----------------------------------
    if FLAGS.reload_model == "continue":
        print("Restoring previous model checkpoint for contiuning training ...")
        saver.restore(sess, FLAGS.model)
        # reload global step
        total_step = tf.train.global_step(sess, global_step)
    elif FLAGS.reload_model == "transfer":
        print("Restoring previous model checkpoint for transfer learning ...")
        saver.restore(sess, FLAGS.model)
        # reset global step
        total_step = 0
    else:
        sess.run(init)
        total_step = 0

    # Start the TRAINING loop ==================================================
    epoch = 0
    step = 0
    best_loss = 5000000.0

    # chromosome step counter

    # pick chromosomes in training set
#    to_train_chroms = list(train_chrom_d.keys())
#    to_train_chroms = sorted(to_train_chroms)
#    print(to_train_chroms)

    while epoch < FLAGS.max_epoch:
        rc_tag = epoch % 2
        shift_tag = epoch % 4 > 1
        hap1=list()
        hap1_l=list()
        hap2=list()
        hap2_l=list()
        for i in range(1,24):
            if i == 23:
                chr_name="chrX"
            else:
                chr_name="chr"+str(i)
            if rc_tag:
                tmp_chr_seq1=get_chr_seq(FLAGS.hap1, chr_name, True,"uint8")
                tmp_chr_seq2=get_chr_seq(FLAGS.hap2, chr_name, True, "uint8")
                tmp_chr_seq1=get_ascn_seq(tmp_chr_seq1, FLAGS.ascn_file, chr_name, True, len(tmp_chr_seq1), 1)
                tmp_chr_seq2=get_ascn_seq(tmp_chr_seq2, FLAGS.ascn_file, chr_name, True, len(tmp_chr_seq2), 2)

            else:
                tmp_chr_seq1=get_chr_seq(FLAGS.hap1, chr_name,False, "uint8")
                tmp_chr_seq2=get_chr_seq(FLAGS.hap2, chr_name,False, "uint8")
                tmp_chr_seq1=get_ascn_seq(tmp_chr_seq1, FLAGS.ascn_file, chr_name,False, len(tmp_chr_seq1), 1)
                tmp_chr_seq2=get_ascn_seq(tmp_chr_seq2, FLAGS.ascn_file, chr_name,False, len(tmp_chr_seq2), 2)
            hap1.append(tmp_chr_seq1)
            hap2.append(tmp_chr_seq2)
            hap1_l.append(len(tmp_chr_seq1))
            hap2_l.append(len(tmp_chr_seq2))
            print(i)

        if rc_tag:
            lf=FLAGS.train_data_file_rc
        else:
            lf=FLAGS.train_data_file

        if shift_tag:
            lf=lf+".shift"



        with open(lf) as f:
            step=0
            f=csv.reader(f, delimiter='\t')
            for l in f:
#                sub_step += 1
#                step += 1
#                total_step += 1
                start_time = time.time()
                if l[0][3:] == "X":
                    chr_number=22
                else:
                    chr_number=int(l[0][3:])-1

                if rc_tag:
                    if shift_tag:
                        feed_dict = {
                                seqs_placeholder: fill_seqs_ascn(hap1[chr_number], hap2[chr_number], hap1_l[chr_number]-1-int(l[2]), hap2_l[chr_number]-1-int(l[1]), ascn_class, BP_CONTEXT, dtype = FLAGS.store_dtype),
                                labels_placeholder: train_regr_bin_rc_shift[step:(step+1),],
                                keep_prob_inner_placeholder: FLAGS.keep_prob_inner,
                                keep_prob_outer_placeholder: FLAGS.keep_prob_outer
                                }
                    else:
                        feed_dict = {
                                seqs_placeholder: fill_seqs_ascn(hap1[chr_number], hap2[chr_number], hap1_l[chr_number]-1-int(l[2]), hap2_l[chr_number]-1-int(l[1]), ascn_class, BP_CONTEXT, dtype = FLAGS.store_dtype),
                                labels_placeholder: train_regr_bin_rc[step:(step+1),],
                                keep_prob_inner_placeholder: FLAGS.keep_prob_inner,
                                keep_prob_outer_placeholder: FLAGS.keep_prob_outer
                                }

                else:
                    if shift_tag:
                        feed_dict = {
                                seqs_placeholder: fill_seqs_ascn(hap1[chr_number], hap2[chr_number], int(l[1]), int(l[2]), ascn_class, BP_CONTEXT, dtype = FLAGS.store_dtype),
                                labels_placeholder: train_regr_bin_shift[step:(step+1),],
                                keep_prob_inner_placeholder: FLAGS.keep_prob_inner,
                                keep_prob_outer_placeholder: FLAGS.keep_prob_outer
                                }


                    else:
                        feed_dict = {
                              seqs_placeholder: fill_seqs_ascn(hap1[chr_number], hap2[chr_number], int(l[1]), int(l[2]), ascn_class, BP_CONTEXT, dtype = FLAGS.store_dtype),
                              labels_placeholder: train_regr_bin[step:(step+1),],
                              keep_prob_inner_placeholder: FLAGS.keep_prob_inner,
                              keep_prob_outer_placeholder: FLAGS.keep_prob_outer
                              }

                # Run one step of the model.  The return values are the activations
                # from the `train_op` (which is discarded) and the `loss`
                _, loss_value, l2_loss_value, regr = sess.run([train_op, loss, l2_loss, regression_score], feed_dict=feed_dict)

                # # TEST PRINTS
                # print('labels')
                # print(train_regr_bin[batch_range,])
                # print('regression score')
                # print(regr)
                # print('loss value')
                # print(loss_value)

                # Write the summaries and print and overview every X steps =============
                if (step+1) % FLAGS.report_every == 0:
                    duration = time.time() - start_time # get step time
                    # Print status to stdout.
                    print('Step %d: loss = %.2f l2_loss = %.2f (%.3f sec)' % (step+1, loss_value,l2_loss_value, duration))
                    print_step_loss.append('Step %d: loss = %.2f l2_loss = %.2f (%.3f sec)' % (step+1, loss_value,l2_loss_value, duration))
                    # Update the events file.
                    summary_str = sess.run(summary, feed_dict=feed_dict)
                    summary_writer.add_summary(summary_str, total_step)
                    summary_writer.flush()
                if (step+1) % 10000 == 0:
                    checkpoint_file = os.path.join(FLAGS.train_dir, 'checkpoint')
                    saver.save(sess, checkpoint_file, global_step=total_step+1)

                step=step+1
                total_step=total_step+1


            print('Test Data Accuracy Eval:')
            if rc_tag:
                if shift_tag:
                    test_loss = do_eval(sess,
                            loss_test,
                            seqs_placeholder,
                            labels_placeholder,
                            valid_regr_bin_rc_shift,
                            hap1,
                            hap2,
                            hap1_l,
                            hap2_l,
                            rc_tag,
                            shift_tag,
                            keep_prob_inner_placeholder,
                            keep_prob_outer_placeholder
                            )
                else:
                    test_loss = do_eval(sess,
                            loss_test,
                            seqs_placeholder,
                            labels_placeholder,
                            valid_regr_bin_rc,
                            hap1,
                            hap2,
                            hap1_l,
                            hap2_l,
                            rc_tag,
                            shift_tag,
                            keep_prob_inner_placeholder,
                            keep_prob_outer_placeholder
                            )
            else:
                if shift_tag:
                    test_loss = do_eval(sess,
                            loss_test,
                            seqs_placeholder,
                            labels_placeholder,
                            valid_regr_bin_shift,
                            hap1,
                            hap2,
                            hap1_l,
                            hap2_l,
                            rc_tag,
                            shift_tag,
                            keep_prob_inner_placeholder,
                            keep_prob_outer_placeholder
                            )


                else:
                    test_loss = do_eval(sess,
                            loss_test,
                            seqs_placeholder,
                            labels_placeholder,
                            valid_regr_bin,
                            hap1,
                            hap2,
                            hap1_l,
                            hap2_l,
                            rc_tag,
                            shift_tag,
                            keep_prob_inner_placeholder,
                            keep_prob_outer_placeholder
                            )
            test_loss_summary = tf.Summary(value=[tf.Summary.Value(tag="test_loss", simple_value=test_loss)])
            summary_writer.add_summary(test_loss_summary, total_step)
            # Save Checkpoint if test loss is smaller then the previous best ===
            if best_loss > test_loss:
                checkpoint_file = os.path.join(FLAGS.train_dir, 'best_checkpoint')
                saver.save(sess, checkpoint_file, global_step=total_step)
                best_loss = test_loss
            else:
                checkpoint_file = os.path.join(FLAGS.train_dir, 'checkpoint')
                saver.save(sess, checkpoint_file, global_step=total_step)

        epoch += 1  # count up epoch
        print("Epoch %s done:" % epoch)

def main(_):
  run_training()

if __name__ == '__main__':
  tf.compat.v1.app.run()
