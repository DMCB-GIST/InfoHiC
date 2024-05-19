#!/bin/bash

LIB=`readlink -f ${BASH_SOURCE[0]} | awk '{n=split($1,f,"/"); for(i=1;i<=n-3;i++){printf "%s/", f[i]}}'`
export InfoHiC_lib=$LIB
export PATH=$InfoHiC_lib/InfoGenomeR_processing:$InfoHiC_lib/InfoHiC_tensorflow:$InfoHiC_lib/post_analysis:$PATH


cd $InfoHiC_lib/humandb
./download.sh

cd $InfoHiC_lib/models
./download.sh

cd $InfoHiC_lib/examples
./download.sh
