#!/bin/bash
PY_PATH=`which python3.8`
PY_PATH=`dirname $PY_PATH`
export PATH=$PY_PATH:$PATH

LIB=`readlink -f ${BASH_SOURCE[0]} | awk '{n=split($1,f,"/"); for(i=1;i<=n-3;i++){printf "%s/", f[i]}}'`
export InfoHiC_lib=$LIB
export PATH=$InfoHiC_lib/InfoGenomeR_processing:$InfoHiC_lib/InfoHiC_tensorflow:$InfoHiC_lib/post_analysis:$PATH
export FRAC=0.9

gpu=$1
mode=$2
lib=${LIB}\/InfoHiC_tensorflow/$2\/two_haplotypes
res=$3
window=$4
InfoGenomeR_dir=`readlink -f $5`
HiC_dir=`readlink -f $6`
SEED_FILE=`readlink -f $7`
MAX_EPOCH=$8
OUTPUT=$9


mkdir -p $OUTPUT
cd $OUTPUT


InfoHiC_training $gpu $lib $res $window  $InfoGenomeR_dir $HiC_dir $SEED_FILE $MAX_EPOCH
