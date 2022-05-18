EPS=0.001
MAX_ITER=1000

import csv
import sys
import argparse
import numpy as np
from scipy import sparse

import iced
from iced.io import loadtxt, savetxt




filename=sys.argv[1]
i, j, data = loadtxt(filename).T

index_base = 1
N = max(i.max(), j.max())

counts=np.zeros((int(N),int(N)))


for d in range(len(data)):
	counts[int(i[d])-1, int(j[d])-1]=data[d]
	counts[int(j[d])-1, int(i[d])-1]=data[d]



#caic_normed=loic_normed


#counts = counts / block_biases



counts, bias = iced.normalization.ICE_normalization(counts, max_iter=MAX_ITER, copy=False, eps=EPS, output_bias=True)

results_filename = ".".join(filename.split(".")[:-1]) + "_ice." + filename.split(".")[-1]
counts = sparse.coo_matrix(counts)
#counts = sparse.coo_matrix(caic_normed)

savetxt(results_filename, np.column_stack((counts.row + index_base, counts.col + index_base, counts.data)), fmt='%i\t%i\t%.6f')


