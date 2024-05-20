#!/usr/bin/env python

import os 
import sys
import itertools 

dummy_alignment = "DUMMY\t4\t*\t*\t0\t*\t*\t0\t0\t*\t*\n"
proper_flag_set = set(['0','16','2048','2064'])
forward_flag_set = set(['0','2048'])
mapq_criteria = 10


def is_not_header(line):
	return not line.startswith("@")


def is_valid_aln_chunk_pair(aln_chunk_pair):
	aln_chunk_1,aln_chunk_2 = aln_chunk_pair 
	readname_1 = aln_chunk_1[0]
	readname_2 = aln_chunk_2[0]
	return (readname_1 == readname_2 != "")	


def is_reverse(alignment_flag):
	return str(int(alignment_flag not in forward_flag_set))


def is_proper_pair(aln_pair):
	aln_1,aln_2 = aln_pair 
	feature_list_1 = aln_1.split()
	feature_list_2 = aln_2.split()
	alignment_1_flag = feature_list_1[1] 
	alignment_2_flag = feature_list_2[1]
 	alignment_1_mapq = int(feature_list_1[4])
	alignment_2_mapq = int(feature_list_2[4])
	is_properly_aligned = min(alignment_1_mapq,alignment_2_mapq) >= mapq_criteria
	is_properly_flagged = set([alignment_1_flag,alignment_2_flag]) <= proper_flag_set
	return is_properly_aligned and is_properly_flagged


def gen_aln_chunk(sam_filename):
	with open(sam_filename) as sam_file:
		aln_list = []
		prev_readname = ""
		aln_gen = itertools.chain(sam_file,[dummy_alignment])
		for aln in itertools.ifilter(is_not_header, aln_gen):
			readname = aln.split()[0]
			if prev_readname == readname:
				aln_list.append(aln)
			else:
				aln_chunk = (prev_readname,aln_list)
				yield aln_chunk
				aln_list = [aln]
			prev_readname = readname 


def gen_aln_pair(aln_chunk_pair):
	aln_chunk_1,aln_chunk_2 = aln_chunk_pair 
	readname_1,aln_list_1 = aln_chunk_1
	readname_2,aln_list_2 = aln_chunk_2
	readname_base = readname_1 
	aln_list = aln_list_1 + aln_list_2
	aln_pair_gen = itertools.ifilter(is_proper_pair,itertools.combinations(aln_list,2))
	for pair_index, aln_pair in enumerate(aln_pair_gen,start=1):
		yield readname_base,pair_index,aln_pair


def refine_aln_pair(readname_base,pair_index,aln_pair):
	aln_1,aln_2 = aln_pair 
	feature_list_1 = aln_1.split()
	feature_list_2 = aln_2.split()

	aln_1_flag = feature_list_1[1]
	aln_2_flag = feature_list_2[1]
	aln_1_chr = feature_list_1[2]
	aln_2_chr = feature_list_2[2]
	aln_1_pos = int(feature_list_1[3])
	aln_2_pos = int(feature_list_2[3])
	aln_1_isrev = is_reverse(aln_1_flag)
	aln_2_isrev = is_reverse(aln_2_flag)

	is_cis = aln_1_chr == aln_2_chr

	refined_feature_list_1 = feature_list_1 
	refined_feature_list_2 = feature_list_2 
	refined_feature_list_1[0] = readname_base + "_" + str(pair_index)
	refined_feature_list_2[0] = readname_base + "_" + str(pair_index)
	refined_feature_list_1[1] = str(int("01"+aln_2_isrev+aln_1_isrev+"0011",2))
	refined_feature_list_2[1] = str(int("10"+aln_1_isrev+aln_2_isrev+"0011",2))
	refined_feature_list_1[6] = "=" if is_cis else aln_2_chr
	refined_feature_list_2[6] = "=" if is_cis else aln_1_chr
	refined_feature_list_1[7] = aln_2_pos
	refined_feature_list_2[7] = aln_1_pos
	refined_feature_list_1[8] = aln_2_pos - aln_1_pos if is_cis else "0" 
	refined_feature_list_2[8] = aln_1_pos - aln_2_pos if is_cis else "0"

	refined_aln_1 = "\t".join(map(str,refined_feature_list_1))
	refined_aln_2 = "\t".join(map(str,refined_feature_list_2))
	return (refined_aln_1 , refined_aln_2)

def read_sam(sam_filename_1,sam_filename_2):
	aln_chunk_gen_1 = gen_aln_chunk(sam_filename_1)
	aln_chunk_gen_2 = gen_aln_chunk(sam_filename_2)
	aln_chunk_pair_gen = itertools.izip(aln_chunk_gen_1,aln_chunk_gen_2)
	for aln_chunk_pair in itertools.ifilter(is_valid_aln_chunk_pair,aln_chunk_pair_gen):
		for readname_base,pair_index,aln_pair in gen_aln_pair(aln_chunk_pair):
			aln_1,aln_2 = aln_pair 
			refined_aln_pair = refine_aln_pair(readname_base,pair_index,aln_pair)
			print "\n".join(refined_aln_pair)


def main():
	if len(sys.argv) < 3:
		print "Usage : " + sys.argv[0] + " [sam_filename_1] [sam_filename_2]"
		sys.exit()
	else:
		sam_filename_1 = sys.argv[1]
		sam_filename_2 = sys.argv[2]
		read_sam(sam_filename_1,sam_filename_2)


if __name__ == "__main__":
	main()



