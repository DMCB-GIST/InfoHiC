
import numpy as np
import pandas as pd
import multiprocessing as mp

import glob
import sys
import os

datadir = sys.argv[1]
samplename = datadir.split("/")[-1]
outfile = "{}/{}.mean_var2.txt".format(datadir, samplename)

scale_script = sys.argv[2]
avg_mean_val = sys.argv[3] 
avg_std_val  = sys.argv[4]

filelist = glob.glob(datadir + "/*.distnorm.gz")

def check_file_mean_var(gzfile, procnum, return_dict):

	df = pd.read_csv(gzfile,sep='\t',error_bad_lines=False, compression='gzip')
	covnorm_res = df['capture_res'].to_numpy()
	return_dict[procnum] = (os.path.basename(gzfile), np.mean(covnorm_res), np.std(covnorm_res))
	
	return
#

def scale_output(gzfile, scale_script, avg_mean_val, avg_std_val):

	cmd = 'Rscript {} {} {} {}'.format(scale_script, gzfile, avg_mean_val, avg_std_val)
	os.system(cmd)

	return
#


if __name__ == '__main__':

	#""" Uncomment here to off
	print "calc_meanvar_normal"
	procs = []
	manager = mp.Manager()
	return_dict = manager.dict()
	for idx, filename in enumerate(filelist):
		proc = mp.Process(target=check_file_mean_var, args=(filename, idx, return_dict))
		procs.append(proc)
		proc.start()
	#

	for proc in procs: proc.join()
	
	f = open(outfile, 'w')
	for filename, mean, std in return_dict.values(): f.write("{}\t{}\t{}\n".format(filename, str(mean), str(std)))
	f.close()
	#"""

	""" Uncomment here to off
	print "scale script"
	procs = []
	for filename in filelist:
		proc = mp.Process(target=scale_output, args=(filename, scale_script, avg_mean_val, avg_std_val))
		procs.append(proc)
		proc.start()
	#

	for proc in procs: proc.join()
	#"""

#
