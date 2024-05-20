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
if int(tf.__version__.split(sep=".")[0]) > 1:
    import tensorflow.compat.v1 as tf
    tf.disable_v2_behavior()

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
flags.DEFINE_string('seed_weights_trained', None, 'Path to saved numpy file with saved weights. Weight and bias dimensions must match with the ones specified as hyper params for this run!')
# machine options
flags.DEFINE_integer('gpu', 0, 'Select a single available GPU and mask the rest. Default 0.')
# Log Options
flags.DEFINE_integer('report_every', 100, 'Set interval of batch steps o when to report raining loss and log progress, losses and weights etc.')
# flag if to train with boolean values stored (labels and sequence)
flags.DEFINE_string('store_dtype', 'uint16', 'Indicate that sequence where stored as bools rather then integers. Will convert automatically.')
# Whole genome fasta file for accessing genome sequences
flags.DEFINE_string('whg_fasta', None, 'Path to whole genome fasta file for reading the genomic sequence')
flags.DEFINE_integer('seed', 1234, 'Random seed for tensorflow (graph level).')

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

def get_chr_seq(whg_fasta, chromosome, dtype = "uint8"):
    '''Get entire chromosome sequence as hot encoded sequence to query from'''
    with pysam.Fastafile(whg_fasta) as fa:
        seq = fa.fetch(reference = chromosome)
        seq = seq.upper()
        # convert to one hot encoding
        if dtype == 'bool':
            seq = get_hot_coded_seq_bool(seq)
        elif dtype == 'uint8':
            seq = get_hot_coded_seq(seq, dtype)
        else:
            seq = get_hot_coded_seq(seq, dtype)
    return(seq)
def fill_seqs(chr_seq, start, end, batch_size, seq_length, dtype = "uint8"):
    # init
    if dtype == 'bool':
        feed_seqs = np.zeros((batch_size, seq_length, 4), dtype = 'bool')
    elif dtype == 'uint8':
        feed_seqs = np.zeros((batch_size, seq_length, 4), dtype = 'uint8')
    else:
        feed_seqs = np.zeros((batch_size, seq_length, 4), dtype = 'int')
    # fill from temp chromosome sequence stored
    for i in range(batch_size):
        feed_seqs[i,] = chr_seq[start:end,:]

    return(feed_seqs)


def run_training():
  """Train for a number of steps."""

  # Get the sets labels and chromosome positions
  # split into train test and validation -------------------------------

#  train_chrom_d, train_chroms, train_position, train_regr_bin, test_chrom_d, test_chroms, test_position, test_regr_bin, valid_chrom_d, valid_chroms, valid_position, valid_regr_bin = read_train_file(FLAGS.data_file, NUM_CLASSES, test_chromosomes, validation_chromosomes, FLAGS.store_dtype)


  # load seed weights if specified
  seed_weights_list_trained = np.load(FLAGS.seed_weights_trained)

  # Write configuration/parameters to specified train dir
  # WRITE HYPER PARAMETERS and DATA PROPERTIES TO RUN LOG FILE
  current_time = time.localtime()
  timestamp = str(current_time[0]) + str(current_time[1]) + str(current_time[2]) + str(current_time[3]) + str(current_time[4])

  if not os.path.exists(FLAGS.train_dir):  # make train dir
      os.makedirs(FLAGS.train_dir)

  param_log_file = open(FLAGS.train_dir + '/hyperparameters_' + timestamp + '.log', 'w')
  param_log_file.write("# Hyperparameters for dilationDHS run at: " + str(current_time))
  param_log_file.write("\n\nInput: " + str(BP_CONTEXT) + " bp")
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
        FLAGS.batch_size,
        keep_prob_inner_placeholder,
        keep_prob_outer_placeholder,
        FLAGS.seed_weights,
        seed_scheme,
	seed_weights_list_trained
        )
    tf.compat.v1.add_to_collection("regression_score", regression_score)

    # Add to the Graph the Ops for loss calculation.
    loss = deepCregr.loss(regression_score, labels_placeholder, FLAGS.l2_strength, FLAGS.batch_size)
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
    os.environ["CUDA_VISIBLE_DEVICES"] = "-1"

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
    checkpoint_file = os.path.join(FLAGS.train_dir, 'model_change_checkpoint')
    saver.save(sess, checkpoint_file)


    # chromosome step counter
    # pick chromosomes in training set

def main(_):
  run_training()

if __name__ == '__main__':
  tf.compat.v1.app.run()
