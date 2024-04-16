
import multiprocessing as mp
import pysam
from collections import Counter

import gzip
import sys
import os

input_bam_path = sys.argv[1]
sample_coverage_path = sys.argv[2]
resolution = int(sys.argv[3])
normalize_script_path = sys.argv[4]

coverage_dict = {}
f = open(sample_coverage_path)
for line in f:
	line = line.rstrip()
	[chrname, bin1, bin2, coverage] = line.split('\t')
	coverage_dict[".".join([chrname, bin1, bin2])] = int(coverage)
#
f.close()

chrlist = ['chr' + str(i+1) for i in range(22)]
chrlist.append('chrX')

def bam_chr_split(inputbamfile, chrname, outputbamfile):

	cmd = 'samtools view -b {} {} > {}'.format(inputbamfile, chrname, outputbamfile)
	os.system(cmd)

	return
#

def bam_chr_index(inputbamfile):
		
	cmd = 'samtools index {}'.format(inputbamfile)
	os.system(cmd)

	return
#

def make_Feature(chr_bamfile, coverage_dict, resolution, cis_savefile, trans_savefile, chrname):

	cislist = []
	translist = []

	bam = pysam.AlignmentFile(chr_bamfile, 'rb')
	for line in bam.fetch():
		start_chrnum = line.reference_id + 1
		end_chrnum = line.next_reference_id + 1
		if start_chrnum < 25 and end_chrnum < 25:

			if start_chrnum == 23: start_chrnum = 'X'
			if start_chrnum == 24: start_chrnum = 'Y'
			pos1_chr= 'chr' + str(start_chrnum)

			if end_chrnum == 23: end_chrnum = 'X'
			if end_chrnum == 24: end_chrnum = 'Y'
			pos2_chr= 'chr' + str(end_chrnum)

			bin1=int(line.reference_start)/resolution
			bin2=int(line.next_reference_start)/resolution

			map_id = ".".join([pos1_chr, str(bin1 * resolution), str((bin1+1)* resolution)]) + "," + ".".join([pos2_chr, str(bin2 * resolution), str((bin2+1)* resolution)]) 
		
			if pos1_chr == pos2_chr: cislist.append(map_id)
			else: translist.append(map_id)
		#
	#
	bam.close()
	
	#cisdict = pd.Series(cislist).value_counts().to_dict()
	#transdict = pd.Series(translist).value_counts().to_dict()

	cisdict = Counter(cislist)
	transdict = Counter(translist)

	cis_contact = cisdict.keys()
	trans_contact = transdict.keys()

	if not len(cis_contact) == 0:
		o = gzip.open(cis_savefile,'w')
		o.write("frag1\tfrag2\tcov_frag1\tcov_frag2\tfreq\tdist\n")
		for contact in cis_contact:
			[bin1, bin2] = contact.split(',')
			cov1 = coverage_dict[bin1]
			cov2 = coverage_dict[bin2]
			dist = abs(int(bin1.split(".")[1]) - int(bin2.split(".")[1]))
			raw_freq = cisdict[contact]
	
			o.write("\t".join([bin1, bin2, str(cov1), str(cov2), str(raw_freq), str(dist)]) + '\n')
		#
		o.close()
	#
	
	if not len(trans_contact) == 0:
		o = gzip.open(trans_savefile,'w')
		if chrname == 'chr10': o.write("frag1\tfrag2\tcov_frag1\tcov_frag2\tfreq\tdist\n")
		for contact in trans_contact:
			[bin1, bin2] = contact.split(',')
			if bin1.split(".")[0] == 'chrY' or bin2.split(".")[0] == 'chrY': pass
			else:
				cov1 = coverage_dict[bin1]
				cov2 = coverage_dict[bin2]
				dist = 500000 #dummy value dist not defined in trans  #abs(int(bin1.split(".")[1]) - int(bin2.split(".")[1]))
				raw_freq = transdict[contact]
	
				if int(raw_freq) > 1: o.write("\t".join([bin1, bin2, str(cov1), str(cov2), str(raw_freq), str(dist)]) + '\n')
			#
		#
		o.close()
	#
	
	return
#

def cis_normalize(cis_feature_file, normalize_script_path):

	cmd = 'Rscript {} {}'.format(normalize_script_path, cis_feature_file)
	os.system(cmd)

	return
#


if __name__ == '__main__':

	procs = []
	chrbamlist = []
	for chrname in chrlist:
		output_dir, input_bam = os.path.split(input_bam_path)
		outbamfile = [input_bam.split('.')[0], chrname, 'bam']
		outbamfilepath = '{}/{}'.format(output_dir, '.'.join(outbamfile))
		chrbamlist.append(outbamfilepath)

		proc = mp.Process(target=bam_chr_split, args=(input_bam_path, chrname, outbamfilepath))
		procs.append(proc)
		proc.start()
	#
	for proc in procs: proc.join()

	procs = []
	for chrbampath in chrbamlist:
		proc = mp.Process(target=bam_chr_index, args=(chrbampath,))
		procs.append(proc)
		proc.start()
	#
	for proc in procs: proc.join()
	
	procs = []
	cisfeature_list = []
	for chrbampath in chrbamlist:
		output_dir, input_bam = os.path.split(chrbampath)
		samplename = input_bam.split('.')[0]
		chrname = input_bam.split('.')[1]
		cis_feature_path = '{}/{}.{}.cis.feature.gz'.format(output_dir, samplename, chrname)		
		trans_feature_path = '{}/{}.{}.trans.feature.gz'.format(output_dir, samplename, chrname)
		
		cisfeature_list.append(cis_feature_path)

		proc = mp.Process(target=make_Feature, args=(chrbampath, coverage_dict, resolution, cis_feature_path, trans_feature_path, chrname))
		procs.append(proc)
		proc.start()
	#
	for proc in procs: proc.join()

	procs = []
	for cisfeature in cisfeature_list:

		proc = mp.Process(target=cis_normalize, args=(cisfeature, normalize_script_path))
		procs.append(proc)
		proc.start()
	#
	for proc in procs: proc.join()
#
