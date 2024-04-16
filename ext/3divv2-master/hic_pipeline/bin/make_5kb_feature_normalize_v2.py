
import multiprocessing as mp
import pysam
from collections import Counter

import gzip
import sys
import os

input_bam_path = sys.argv[1]
normalize_script_path1 = sys.argv[2]
normalize_script_path2 = sys.argv[3]

datadir, bamfilename = os.path.split(input_bam_path)

samplename = bamfilename.split(".")[0]
cov5kbfile  = '{}/{}.5kb.sort.coverage'.format(datadir, samplename)
cov40kbfile = '{}/{}.40kb.sort.coverage'.format(datadir, samplename)

chrlist = ['chr' + str(i+1) for i in range(22)]
chrlist.append('chrX')

coverage_40kbdict = {}
f = open(cov40kbfile)
for line in f:
	line = line.rstrip()
	[chrname, bin1, bin2, coverage] = line.split('\t')
	coverage_40kbdict[".".join([chrname, bin1, bin2])] = int(coverage)
#
f.close()

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

def conv_5kb_coverage(coverage_5kbfile, targetchrname):

	KernelVector =[0.0439, 0.2494, 0.7066, 1.0000, 0.7066, 0.2494, 0.0439] #MATLAB gausswin(7)
	KernelDist = [-15000,-10000,-5000,0,5000,10000,15000]

	#KernelVector =[0.0439, 0.4578, 1.0000, 0.4578, 0.0439] #MATLAB gausswin(5)
	#KernelDist = [-10000,-5000,0,5000,10000]

	covdict5kbraw = {}

	f = open(coverage_5kbfile)
	for line in f:
		line = line.rstrip()
		[chrname, start, end, coverage] = line.split()

		if chrname == targetchrname:
			binid = ".".join([chrname, start, end])
			covdict5kbraw[binid] = int(coverage)
		#
	#
	f.close()
	
	binlist = [int(i.split(".")[1]) for i in covdict5kbraw.keys()]
	bin_min = min(binlist)
	bin_max = max(binlist)

	covdict5kbconv = {}

	h = bin_min
	while h <= bin_max:
		frag1 = h
		weight_score = 0
		for i in range(len(KernelDist)):
			tmp_frag1 = frag1+int(KernelDist[i])
			weight=float(KernelVector[i])
			
			tmp_binid = ".".join([targetchrname, str(tmp_frag1), str(tmp_frag1+5000)])
			try: weight_score += covdict5kbraw[tmp_binid] * weight
			except: pass
		#	

		h += 5000

		binid = ".".join([targetchrname, str(frag1), str(frag1+5000)])
		covdict5kbconv[binid] = weight_score
	#
	
	return covdict5kbconv
#

def make_Feature(chr_bamfile, coverage_40kbdict, coverage_5kbfile, cis_savefile, cis_savefile2, chrname):


	cislist40kb = []
	cislist5kb = []

	bam = pysam.AlignmentFile(chr_bamfile, 'rb')
	for line in bam.fetch():
		start_chrnum = int(line.reference_id) + 1
		end_chrnum = int(line.next_reference_id) + 1
		if start_chrnum < 25 and end_chrnum < 25 and line.is_read1==True:

			if start_chrnum == 23: start_chrnum = 'X'
			if start_chrnum == 24: start_chrnum = 'Y'
			pos1_chr= 'chr' + str(start_chrnum)

			if end_chrnum == 23: end_chrnum = 'X'
			if end_chrnum == 24: end_chrnum = 'Y'
			pos2_chr= 'chr' + str(end_chrnum)

			if pos1_chr == pos2_chr:
				bin5kb_1  = (int(line.reference_start)/5000)
				bin5kb_2  = (int(line.next_reference_start)/5000)
				bin40kb_1 = (int(line.reference_start)/40000)
				bin40kb_2 = (int(line.next_reference_start)/40000)

				if bin5kb_1 <= bin5kb_2: map_id_5kb = ".".join([pos1_chr, str(bin5kb_1 * 5000),  str((bin5kb_1 + 1) * 5000)]) + "," + ".".join([pos2_chr, str(bin5kb_2 * 5000),  str((bin5kb_2 + 1) * 5000)])
				else:                    map_id_5kb = ".".join([pos2_chr, str(bin5kb_2 * 5000), str((bin5kb_2 + 1) * 5000)]) + "," + ".".join([pos1_chr, str(bin5kb_1 * 5000),  str((bin5kb_1 + 1) * 5000)])
				cislist5kb.append(map_id_5kb)

				if bin40kb_1 <= bin40kb_2: map_id_40kb = ".".join([pos1_chr, str(bin40kb_1 * 40000), str((bin40kb_1 + 1) * 40000)]) + "," + ".".join([pos2_chr, str(bin40kb_2 * 40000),  str((bin40kb_2 + 1) * 40000)])
				else:                      map_id_40kb = ".".join([pos2_chr, str(bin40kb_2 * 40000), str((bin40kb_2 + 1) * 40000)]) + "," + ".".join([pos1_chr, str(bin40kb_1 * 40000),  str((bin40kb_1 + 1) * 40000)])	
				cislist40kb.append(map_id_40kb)
			#
		#
	#
	bam.close()
	
	cisdict5kb = Counter(cislist5kb)
	cis5kb_contact = cisdict5kb.keys()

	cisdict40kb = Counter(cislist40kb)
	cis40kb_contact = cisdict40kb.keys()
	
	if not len(cis40kb_contact) == 0:
		o = gzip.open(cis_savefile,'w')
		o.write("frag1\tfrag2\tcov_frag1\tcov_frag2\tfreq\tdist\n")
		for contact in cis40kb_contact:
			[bin1, bin2] = contact.split(',')

			[pos1_chr, coord1_1, coord1_2] = bin1.split(".")
			[pos2_chr, coord2_1, coord2_2] = bin2.split(".")

			cov1 = coverage_40kbdict[bin1]
			cov2 = coverage_40kbdict[bin2]
			dist = abs(int(bin1.split(".")[1]) - int(bin2.split(".")[1]))
			raw_freq = cisdict40kb[contact]
	
			if raw_freq > 0: o.write("\t".join([bin1, bin2, str(cov1), str(cov2), str(raw_freq), str(dist)]) + '\n')
		#
		o.close()
	#	
		
	coverage_5kbdict = conv_5kb_coverage(coverage_5kbfile, chrname)

	bin_min = min([int(i.split(".")[1]) for i in cis5kb_contact])
	bin_max = max([int(i.split(".")[3]) for i in cis5kb_contact])
	print bin_max

	if not len(cis5kb_contact) == 0:

		KernelVector =[0.0439, 0.2494, 0.7066, 1.0000, 0.7066, 0.2494, 0.0439] #MATLAB gausswin(7)
		KernelDist = [-15000,-10000,-5000,0,5000,10000,15000]

		#KernelVector =[0.0439, 0.4578, 1.0000, 0.4578, 0.0439] #MATLAB gausswin(5)
		#KernelDist = [-10000,-5000,0,5000,10000]

		o = gzip.open(cis_savefile2,'w')
		o.write("frag1\tfrag2\tcov_frag1\tcov_frag2\tfreq\tdist\trawfreq\n")

		h = bin_min
		while h <= bin_max:

			i_start = h
			i_end = h + 2000000
			
			while i_start <= i_end:
				frag1 = h
				frag2 = i_start

				binid = ".".join([chrname, str(frag1), str(frag1+5000)]) + "," + ".".join([chrname, str(frag2), str(frag2+5000)])
				try: raw_freq = cisdict5kb[binid]
				except: raw_freq = 0

				weight_score = 0
		
				for j in range(len(KernelDist)):
					
					tmp_frag1 = frag1 + KernelDist[j]	

					for k in range(len(KernelDist)):
				
						weight = KernelVector[j] * KernelVector[k]
						tmp_frag2 = frag2 + KernelDist[k]

						if tmp_frag1 < tmp_frag2: tmp_binid = ".".join([chrname, str(tmp_frag1), str(tmp_frag1+5000)]) + "," + ".".join([chrname, str(tmp_frag2), str(tmp_frag2+5000)])
						else:                     tmp_binid = ".".join([chrname, str(tmp_frag2), str(tmp_frag2+5000)]) + "," + ".".join([chrname, str(tmp_frag1), str(tmp_frag1+5000)])

						try: weight_score += cisdict5kb[tmp_binid] * weight
						except: pass

					#
				#

				dist = abs(frag1 - frag2)
				bin1 = binid.split(",")[0]
				bin2 = binid.split(",")[1]
				try: o.write("\t".join([bin1, bin2, str(coverage_5kbdict[bin1]), str(coverage_5kbdict[bin2]), str(weight_score), str(dist), str(raw_freq)]) + '\n')
				except: pass
				i_start += 5000
			#
			h += 5000
		#
		o.close()
	#

	return
#

def cis_normalize(cis_feature_file1, cis_feature_file2,  normalize_script_path1, normalize_script_path2):

	cmd1 = 'Rscript {} {}'.format(normalize_script_path1, cis_feature_file1)
	cmd2 = 'Rscript {} {}'.format(normalize_script_path2, cis_feature_file2)
	os.system(cmd1)
	os.system(cmd2)

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
	"""
		proc = mp.Process(target=bam_chr_split, args=(input_bam_path, chrname, outbamfilepath))
		procs.append(proc)
		proc.start()
	#
	for proc in procs: proc.join()
	#"""
	"""
	procs = []
	for chrbampath in chrbamlist:
		proc = mp.Process(target=bam_chr_index, args=(chrbampath,))
		procs.append(proc)
		proc.start()
	#
	for proc in procs: proc.join()
	
	procs = []
	cisfeature_list_40kb = []
	cisfeature_list_5kb = []
	#"""
	#"""	
	for chrbampath in chrbamlist:
		output_dir, input_bam = os.path.split(chrbampath)
		samplename = input_bam.split('.')[0]
		chrname = input_bam.split('.')[1]
		cis_feature_path  = '{}/{}.{}.cis.40kbfeature.gz'.format(output_dir, samplename, chrname)		
		cis_feature_path2 = '{}/{}.{}.cis.5kbfeature.gz'.format(output_dir, samplename, chrname)		
		
		proc = mp.Process(target=make_Feature, args=(chrbampath, coverage_40kbdict, cov5kbfile, cis_feature_path, cis_feature_path2, chrname))
		procs.append(proc)
		proc.start()
	#
	for proc in procs: proc.join()
	#"""
	#"""	
	procs = []
	param_file_list = []
	
	for chrname in chrlist:
		output_dir, input_bam = os.path.split(input_bam_path)
		samplename = input_bam.split('.')[0]
		cis_feature_path1 = '{}/{}.{}.cis.40kbfeature.gz'.format(output_dir, samplename, chrname)
		cis_feature_path2 = '{}/{}.{}.cis.5kbfeature.gz'.format(output_dir, samplename, chrname)

		proc = mp.Process(target=cis_normalize, args=(cis_feature_path1, cis_feature_path2, normalize_script_path1, normalize_script_path2))
		procs.append(proc)
		proc.start()
	#
	for proc in procs: proc.join()
	#"""
#

