from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import warnings
warnings.filterwarnings("ignore")

import numpy as np
import pysam

import numpy as np
import pickle
import sys
import csv
import os.path
import time

fr=[]
fc=[]
fv=[]
res=int(sys.argv[2])
with open(sys.argv[1]+".output.m.format.v", "r") as f:
    for i,l in enumerate(f):
        l = l.rstrip()
        l = l.split("\t")
        fr.append(int(int(l[1])/res))
        fc.append(int(int(l[3])/res))
        fv.append(l[4])


minv=min(min(fr),min(fc))
maxv=max(max(fr),max(fc))

n_shape=maxv-minv+1

m=np.zeros((n_shape,n_shape))
for i in range(0,len(fr)):
    m[fr[i]-minv, fc[i]-minv]=fv[i]

gen = ((i, i) for i in range(n_shape))
index_map=dict(gen)

chain=[0]
with open(sys.argv[1]+".index.sv","r") as f:
    for i,l in enumerate(f):
        l = l.rstrip()
        l = l.split("\t")
        chain.append(int(int(l[1])/res)-minv)


def chain_idx(ci, chain):
    for i in range(1, len(chain)):
        if ci>=chain[i-1] and ci <chain[i]:
                return(i-1)
    return(len(chain)-1)

gen = ((i,chain_idx(i,chain)) for i in range(n_shape))
chains=dict(gen)


from neoloop.callers import Peakachu
protocol="dilution"

if res!= 40000:
    protocol="insitu"

res_adjust=res/10

m=m/res_adjust

core = Peakachu(m, lower=100000, upper=3000000, res=res, protocol=protocol)
prob=0.95
mmp=1
nopool=False
#nopool=True

loop_index = core.predict(thre=prob, no_pool=nopool, min_count=mmp, index_map=index_map,chains=chains)
for i in range(0, len(loop_index)):
#	if chains[loop_index[i][0]] != chains[loop_index[i][1]]:
	print("{}\t{}".format((loop_index[i][0]+minv)*res, (loop_index[i][1]+minv)*res))

