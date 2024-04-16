#!/bin/bash

LIB=`readlink -f ${BASH_SOURCE[0]} | awk '{n=split($1,f,"/"); for(i=1;i<=n-3;i++){printf "%s/", f[i]}}'`
export InfoHiC_lib=$LIB
export PATH=$InfoHiC_lib/InfoGenomeR_processing:$InfoHiC_lib/InfoHiC_tensorflow:$InfoHiC_lib/post_analysis:$PATH
export FRAC=0.9

gpu=$1
mode=$2
lib=${LIB}/$2\/two_haplotypes
res=$3
window=$4
InfoGenomeR_dir=`readlink -f $5`
SEED_FILE=`readlink -f $6`
MAX_EPOCH=$7

echo -e "InfoHiC_training $gpu $lib $res $window  $InfoGenomeR_dir $SEED_FILE $MAX_EPOCH"
