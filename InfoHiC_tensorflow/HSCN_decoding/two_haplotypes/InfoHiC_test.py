'''DESCRIPTION:
Run predictions of class changes --> shape changes over mutations
# Important: all changes will be treated independendly so e.g. deletion in
mutation one will not affect the coordinates of mutation 2 and so on
# FORMAT
chr start end replace
# !!! NOTE 0 based indexed bed like format (half open) --> need to implemenet switch between 1 and 0 based
# fetching 0 based coordinates, reporting 0 based bedlike coordinates (half open)

replace columns specifies what to relace the specified window with --> can be different lengths
special cases:
    "." indicates a pure deletion
    "reference" indicates to just use the reference for this variant
'''

from __future__ import absolute_import, division, print_function
import os
import time
import sys
import re
import numpy as np
import tensorflow as tf
if int(tf.__version__.split(sep=".")[0]) > 1:
    import tensorflow.compat.v1 as tf
    tf.disable_v2_behavior()
from math import log
from itertools import islice, cycle
import pysam
import csv
# helper custom rounding to arbitrary base
def customround(x, base=5):
    return int(base * round(float(x)/base))
def customfloor(x, base=5):
    f = int(base * round(float(x)/base))
    if f > x:
        f = f - base
    return f
def customceil(x, base=5):
    f = int(base * round(float(x)/base))
    if f < x:
        f = f + base
    return f

# Basic model parameters as external flags -------------------------------------
flags = tf.compat.v1.app.flags
FLAGS = flags.FLAGS

# flags.DEFINE_bool('h', False, 'Help flag.')
flags.DEFINE_string('dlmodel', 'deepCregr', 'Specifcy the DL model file to use e.g. <endpoolDeepHaemElement>.py')
flags.DEFINE_string('rc_tag', 'False', 'Specifcy the DL model file to use e.g. <endpoolDeepHaemElement>.py')
# RUN SETTINGS
flags.DEFINE_integer('batch_size', 1, 'Batch size.')
flags.DEFINE_string('out_dir', '.', 'Directory to store the predicted results')
flags.DEFINE_string('name_tag', 'pred', 'Nametag to add to filenames')
# WHAT TO DO
flags.DEFINE_string('slize', 'all', 'Comma separated list of start and end position of columns to slice out (0) indexed. Will use all if unspecified.')
# EXTERNAL files
flags.DEFINE_string('input', '', 'Must be a variant file specifying the mutations to apply to the reference (custom made format for now)!')
flags.DEFINE_string('model', './model', 'Checkpoint of model file to be tested. (Full path to model without suffix!)')
flags.DEFINE_string('genome', 'hg19.fasta', 'Full path to fasta reference genome of interest to extract the sequence from.')
flags.DEFINE_string('hap1', None, 'Path to whole genome fasta file for reading the genomic sequence')
flags.DEFINE_string('hap2', None, 'Path to whole genome fasta file for reading the genomic sequence')


flags.DEFINE_string('padd_ends', 'none', 'Specify if to padd with half times bp_context N\'s to predict over chromosome ends [left, right, none, both].')
# Data Options
flags.DEFINE_integer('bp_context', 1010000, 'Basepairs per feature.')
flags.DEFINE_integer('add_window', 0, 'Basepairs to add around variant of interest for prediction and hence visualization later.')
flags.DEFINE_integer('num_classes', 101, 'Number of classes.')
flags.DEFINE_integer('bin_size', 10000, 'Bin size to apply when running over the new sequence.')
flags.DEFINE_integer('variant_counter', 0, 'Variant Counter variable to start from (will set +1 for first variable).')
flags.DEFINE_string('bin_steps', 'full', 'Specify if to predict in  half bin size steps of full bin size steps [hal Mainly for restarting again from a longer list. [default: 0]')
flags.DEFINE_string('ascn_file', None, 'path to ascn file')

# machine options
flags.DEFINE_string('run_on', 'gpu', 'Select where to run on (cpu or gpu)')
flags.DEFINE_integer('gpu', 0, 'Select a single available GPU and mask the rest. Default 0.')

# # Print HELP if desired --------------------------------------------------------
# if FLAGS.h:
#     print("Help message:\n")
#     print(tf.app.flags.FLAGS.flag_values_dict())
#     sys.exit()

# PREPARATION ------------------------------------------------------------------
# import dl model architechture selected
dlmodel = __import__(FLAGS.dlmodel)

half_bp_context = int(FLAGS.bp_context/2)

half_bin_size = int(FLAGS.bin_size/2)

if FLAGS.bin_steps not in ['half', 'full']:
    print('Set bin_steps to \'half\' or \'full\'')
    sys.exit()

# prepare for column slizes if specified
if FLAGS.slize != 'all':
    slize_scheme = [x.strip() for x in FLAGS.slize.split(',')]
    slize_scheme = list(map(int, slize_scheme))

# GLOBAL OPTIONS ---------------------------------------------------------------

# HELPER FUNCTIONS -------------------------------------------------------------
# Helper get hotcoded sequence
def get_hot_coded_seq(sequence1, sequence2):
    """Convert a 4 base letter sequence to 4-row x-cols hot coded sequence"""
    # initialise empty
    hotsequence = np.zeros((2,len(sequence1),4), dtype='int32')
    for i in range(len(sequence1)):
        if sequence1[i] == 'A':
            hotsequence[0,i,0] = 1
        elif sequence1[i] == 'C':
            hotsequence[0,i,1] = 1
        elif sequence1[i] == 'G':
            hotsequence[0,i,2] = 1
        elif sequence1[i] == 'T':
            hotsequence[0,i,3] = 1
    for i in range(len(sequence2)):
        if sequence2[i] == 'A':
            hotsequence[1,i,0] = 1
        elif sequence2[i] == 'C':
            hotsequence[1,i,1] = 1
        elif sequence2[i] == 'G':
            hotsequence[1,i,2] = 1
        elif sequence2[i] == 'T':
            hotsequence[1,i,3] = 1
    return hotsequence
def get_hot_coded_seq_rc(sequence1, sequence2):
    ls=len(sequence1)
    hotsequence = np.zeros((2,len(sequence1),4), dtype='int32')
    for i in range(len(sequence1)):
        if sequence1[i] == 'A':
            hotsequence[0,ls-1-i,3] = 1
        elif sequence1[i] == 'C':
            hotsequence[0,ls-1-i,2] = 1
        elif sequence1[i] == 'G':
            hotsequence[0,ls-1-i,1] = 1
        elif sequence1[i] == 'T':
            hotsequence[0,ls-1-i,0] = 1
    for i in range(len(sequence2)):
        if sequence2[i] == 'A':
            hotsequence[1,ls-1-i,3] = 1
        elif sequence2[i] == 'C':
            hotsequence[1,ls-1-i,2] = 1
        elif sequence2[i] == 'G':
            hotsequence[1,ls-1-i,1] = 1
        elif sequence2[i] == 'T':
            hotsequence[1,ls-1-i,0] = 1
    return hotsequence

def get_ascn(ascn_file, chrom, start, end):
        ascn = [[1],[1]]
        with open(ascn_file, "r") as f:
            for l in csv.reader(f, delimiter='\t'):
                if l[0] == chrom:
                    if int(l[1]) <= start and end <= int(l[2]):
                        ascn = [[l[3]],[l[4]]]
        return ascn


def get_ascn_seq(seq1,seq2, ascn_file,chrom, start, end,rc_tag):
        ascn_seq= np.zeros((2,len(seq1),4), dtype='int32')
        ascn_seq[0,:,:] = seq1[:,:]
        ascn_seq[1,:,:] = seq2[:,:]

        return ascn_seq


def predict(sess,
    regression_score,
    seqs_placeholder,
    seqs,
    ascn,
    ascn_placeholder,
    keep_prob_inner_placeholder,
    keep_prob_outer_placeholder
    ):
    """Make predictions --> get sigmoid output of net per sequence and class"""
    cases = seqs.shape[0]
    line_counter = 0
    batches_to_run = cases // FLAGS.batch_size
    # cover cases where remainder cases are left
    remaining = cases - FLAGS.batch_size * batches_to_run
    predictions = np.zeros((cases, FLAGS.num_classes))  # init empty predictions array
    for step in range(batches_to_run):
        line_counter += 1
        test_batch_start = step * FLAGS.batch_size
        test_batch_end = step * FLAGS.batch_size + FLAGS.batch_size
        test_batch_range=range(test_batch_start, test_batch_end)
#        print( seqs[test_batch_range][0])
        feed_dict = {
              seqs_placeholder: seqs[test_batch_range][0],
             # seqs_placeholder: np.expand_dims(seqs[test_batch_range][0][0], axis=0),
              keep_prob_inner_placeholder: 1.0,
              keep_prob_outer_placeholder: 1.0,
              ascn_placeholder: ascn
              }
        # print(seqs[test_batch_range])
        # print(seqs[test_batch_range].shape)
        tmp_regression_score = sess.run(regression_score, feed_dict=feed_dict)
        tmp_regression_score = np.asarray(tmp_regression_score)
        tmp_regression_score = np.squeeze(tmp_regression_score)
        # add to the empty prediction scores array
        predictions[step*FLAGS.batch_size:step*FLAGS.batch_size+FLAGS.batch_size,] = tmp_regression_score
        if line_counter % 100 == 0:
            print('%s lines done ...' % line_counter)

    # handle remaining cases
    if remaining > 0:
        test_batch_range=range(cases-remaining, cases)
        # workaround for single value prediction
        if remaining == 1:
            test_batch_range=range(cases-remaining-1, cases)
        feed_dict = {
              seqs_placeholder: seqs[test_batch_range][0],
              keep_prob_inner_placeholder: 1.0,
              keep_prob_outer_placeholder: 1.0,
              ascn_placeholder: ascn
              }
        tmp_regression_score = sess.run(regression_score, feed_dict=feed_dict)
        tmp_regression_score = np.asarray(tmp_regression_score)
        tmp_regression_score = np.squeeze(tmp_regression_score)
        # workaround for single value prediction (only use last remaining corresponding predicitons)
        predictions[-remaining:,] = tmp_regression_score[-remaining:]

    return predictions

''' START '''

# check if existent --> else create out_dir and Init Output File ---------------
if not os.path.exists(FLAGS.out_dir):
    os.makedirs(FLAGS.out_dir)

# Load Model -------------------------------------------------------------------
# Create a session
if FLAGS.run_on == 'cpu':
    os.environ['CUDA_VISIBLE_DEVICES'] = '-1'

gpu_options = tf.GPUOptions(per_process_gpu_memory_fraction=float(os.environ.get('FRAC')))
config = tf.compat.v1.ConfigProto(gpu_options=gpu_options);
if FLAGS.run_on == 'gpu':
    config.gpu_options.visible_device_list = str(FLAGS.gpu)
config.allow_soft_placement = True

# Launch Session and retrieve stored OPs and Variables
with tf.compat.v1.Session(config = config) as sess:
    # load meta graph and restore weights
    saver = tf.train.import_meta_graph(FLAGS.model + '.meta')
    saver.restore(sess, FLAGS.model)
    # get placeholders and ops ------------------------------------------------
    graph = tf.compat.v1.get_default_graph()
    seqs_placeholder = graph.get_tensor_by_name("seqs:0")
    labels_placeholder = graph.get_tensor_by_name("labels:0")
    keep_prob_inner_placeholder = graph.get_tensor_by_name("keep_prob_inner:0")
    keep_prob_outer_placeholder = graph.get_tensor_by_name("keep_prob_outer:0")
#    ascn_placeholder =  tf.compat.v1.placeholder(tf.float32, [2,1], name="ascn")
    ascn_placeholder = graph.get_tensor_by_name("ascn:0")
    regression_score = tf.get_collection("regression_score")[0]

    # read in mutation file ====================================================
    variant_counter = FLAGS.variant_counter
    with open(FLAGS.input, "r") as rdf:

        for line in rdf:

            reference_flag = 0  # some flags for process structure
            deletion_flag = 0
            if re.match('^#', line):  # skip comment and header lines
                continue
            variant_counter += 1
            print('processing entry %s' % variant_counter)
            chrom, start, end, replacer = line.split()
            start = int(start)
            end = int(end)
            # correct end for 0-based coordinates
            end = end - 1

            # count bases specified
            reference_length = end - start + 1
            # decide on mutation mode
            if re.match('reference', replacer):  # REPORT REFERENCE
                reference_flag = 1
                replacer_length = reference_length
            elif re.match('\.', replacer):  # DELETION
                deletion_flag = 1
                replacer_length = 0
            else:
                replacer_length = len(replacer) # count bases in replacer

            # get difference in bases ----------------------------------------------
            length_difference = reference_length - replacer_length

            # set new coordinates --------------------------------------------------
            new_start = start
            new_end = end - length_difference
            if deletion_flag == 1:  # adjust for full deletions as the first base pair goes as well
                new_start = new_start - 1
                new_end = new_end - 1

            # save coordinates that are plotted/analysed over respeective to the reference
            relative_reference_start = start - FLAGS.add_window
            relative_reference_start = end + FLAGS.add_window

            # round new coordinates to full bins and set sequence window to extract -----
            # add 990,000 bp to either side of the last bin start / endpool
            patch_start = customfloor(start, FLAGS.bin_size) - (FLAGS.add_window) - half_bp_context
            patch_end = customceil(end, FLAGS.bin_size) + (FLAGS.add_window) + half_bp_context
            patch_new_end = customceil(end, FLAGS.bin_size) + length_difference + (FLAGS.add_window) + half_bp_context

            # check start and end of range
            # set start_diff if sequence to query is over the chromosome ends --> ready to padd
            start_diff = 0
            seq_start = patch_start
            if patch_start < 0:
                start_diff = abs(patch_start)
                seq_start = 0 # cover over the border cases for sequence retrival

            # extract reference sequence -------------------------------------------

            seq_length = patch_new_end - seq_start

            # print(seq)

            # bin the new patch -----------------------------------------------------
            i = 0
            # run_chroms = []
            run_starts = []
            run_ends = []
            run_seqs = []

            # select if to use half_bin_size  or not
            if FLAGS.bin_steps == 'full':
                while i < (seq_length - FLAGS.bp_context + FLAGS.bin_size) / FLAGS.bin_size:
                    js = patch_start + i * FLAGS.bin_size
                    je = patch_start + i * FLAGS.bin_size + FLAGS.bp_context
                    run_starts.append(js)
                    run_ends.append(je)
                    i += 1

            else:
                # half bin size step mode
                print("Using %s half in size" % half_bin_size)
                while i < (seq_length - FLAGS.bp_context + FLAGS.bin_size - half_bin_size) / half_bin_size:
                    js = patch_start + i * half_bin_size
                    je = patch_start + i * half_bin_size + FLAGS.bp_context
                    run_starts.append(js)
                    run_ends.append(je)
                    i += 1

            # Predict ----------------------------------------------------------------
            # make hotcoded sequences
            outfile_name = FLAGS.out_dir + "/" + 'class_predictions_%s_%s_%s_%s_%s.txt' % (FLAGS.name_tag, variant_counter, chrom, start, end)
            fw=open(outfile_name, "w")
            for i in range(len(run_starts)):
                hotseqs = []
#                print("run start %s %e" % (run_starts[i],run_ends[i]))

                with pysam.Fastafile(FLAGS.hap1) as fa:
                    hap1_seq = fa.fetch(reference = chrom, start=run_starts[i],end=run_ends[i])
                    hap1_seq = hap1_seq.upper()
                    if len(hap1_seq) < FLAGS.bp_context:
                        hap1_seq = hap1_seq + 'N' * (FLAGS.bp_context-len(hap1_seq))
                with pysam.Fastafile(FLAGS.hap2) as fa:
                    hap2_seq = fa.fetch(reference = chrom, start=run_starts[i],end=run_ends[i])
                    hap2_seq = hap2_seq.upper()
                    if len(hap2_seq) < FLAGS.bp_context:
                        hap2_seq = hap2_seq + 'N' * (FLAGS.bp_context-len(hap2_seq))

                if FLAGS.rc_tag == "True":
                    hap_seq= get_hot_coded_seq_rc(hap1_seq,hap2_seq)
                else:
                    hap_seq=get_hot_coded_seq(hap1_seq,hap2_seq)
#                print(seq)
                hotseqs.append(hap_seq)
                hotseqs = np.asarray(hotseqs)
                ascn=get_ascn(FLAGS.ascn_file, chrom, run_starts[i], run_ends[i])
                predictions = predict(
                    sess,
                    regression_score,
                    seqs_placeholder,
                    hotseqs,
                    ascn,
                    ascn_placeholder,
                    keep_prob_inner_placeholder,
                    keep_prob_outer_placeholder)
                predictions = np.round(predictions, 4)

#                pred_out = '\t'.join(map(str, predictions[i,:]))
                pred_out = '\t'.join(map(str, predictions[0,:]))
                fw.write("%s\t%s\t%s\t%s" % (chrom, run_starts[i], run_ends[i], pred_out))
                fw.write('\n')


# close up
