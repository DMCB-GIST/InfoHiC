
import numpy as np
import pandas as pd
import multiprocessing as mp

import glob
import sys
import os

datadir = sys.argv[1]
samplename = datadir.split("/")[-1]
scale_script = sys.argv[2]

filelist = glob.glob(datadir + "/*.covnorm.gz")

def change_resolution(gzfile, scale_script):

	cmd = 'Rscript {} {}'.format(scale_script, gzfile)
	os.system(cmd)

	return
#

if __name__ == '__main__':

	procs = []
	manager = mp.Manager()
	for idx, filename in enumerate(filelist):
		proc = mp.Process(target=change_resolution, args=(filename,scale_script))
		procs.append(proc)
		proc.start()
	#
	for proc in procs: proc.join()
#
