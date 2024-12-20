#!/bin/bash
PY_PATH=`which python3.8`
conda_base=`which conda`
conda_base=`dirname ${conda_base}`

PY_PATH=`dirname $PY_PATH`
LD_LIB=${PY_PATH}/../lib
#export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$CONDA_PREFIX/lib
export LD_LIBRARY_PATH=$conda_base\/../lib/:${LD_LIB}:$LD_LIBRARY_PATH
export PATH=$PY_PATH:$PATH

LIB=`readlink -f ${BASH_SOURCE[0]} | awk '{n=split($1,f,"/"); for(i=1;i<=n-3;i++){printf "%s/", f[i]}}'`
export InfoHiC_lib=$LIB
export PATH=$InfoHiC_lib/InfoGenomeR_processing:$InfoHiC_lib/InfoHiC_tensorflow:$InfoHiC_lib/post_analysis:$PATH
export FRAC=0.9

gpu=$1
mode=$2
if [[ $mode == "OHN" ]];then
	lib=${LIB}\/InfoHiC_tensorflow/OHN_ref
else
	lib=${LIB}\/InfoHiC_tensorflow/${mode}/two_haplotypes
fi
res=$3
window=$4
InfoGenomeR_dir=`readlink -f $5`
HiC_dir=`readlink -f $6`
SEED_FILE=`readlink -f $7`
MAX_EPOCH=$8
REF=`readlink -f $9`
OUTPUT=${10}

PRETRAIN_MODEL=""
INPUT=${11}
TARGET_BED=`readlink -f ${12}`

if [[ -s $INPUT ]];then
	INPUT_DIR=`dirname $INPUT`
	INPUT_DIR=`realpath $INPUT_DIR`
	PRETRAIN_MODEL="${INPUT_DIR}/best_checkpoint"
fi

mkdir -p $OUTPUT
cd $OUTPUT

if [[ -s $TARGET_BED ]];then
	res_string=`echo $res | awk '{res=$1/1000; print res"kb"}'`
	TRAIN_DATA_FILE=$HiC_dir\/$res_string.bed.f.for_train
	TRAIN_DATA_FILE_RC=$HiC_dir\/$res_string.bed.rc.for_train
	cp $HiC_dir\/*for_valid* ./
	TRAIN_DATA_FILE_SHIFT=$HiC_dir\/$res_string.bed.f.for_train.shift
	TRAIN_DATA_FILE_RC_SHIFT=$HiC_dir\/$res_string.bed.rc.for_train.shift
	
	bedtools intersect -a $TRAIN_DATA_FILE -b $TARGET_BED -wa  > $res_string.bed.f.for_train
	bedtools intersect -a $TRAIN_DATA_FILE_RC -b $TARGET_BED -wa > $res_string.bed.rc.for_train
	bedtools intersect -a $TRAIN_DATA_FILE_SHIFT -b $TARGET_BED -wa > $res_string.bed.f.for_train.shift
	bedtools intersect -a $TRAIN_DATA_FILE_RC_SHIFT -b $TARGET_BED -wa > $res_string.bed.rc.for_train.shift

	HiC_dir=${PWD}
fi


InfoHiC_training $gpu $lib $res $window  $InfoGenomeR_dir $HiC_dir $SEED_FILE $MAX_EPOCH $REF ${PRETRAIN_MODEL}
