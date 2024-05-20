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
lib=${LIB}\/InfoHiC_tensorflow/$2\/two_haplotypes
res=$3
bp_context=$4

model=`realpath $5`
INFOGENOMER_INPUT=$6
OUTPUT=$7


mkdir -p $OUTPUT
cp -r $INFOGENOMER_INPUT $OUTPUT
cd $OUTPUT


if [[ $bp_context == 1040000 ]];then
	window_string="1Mb"
elif [[ $bp_context == 2000000 ]];then
	window_string="2Mb"
else
	echo "invalid window_size (bp). Choose 1040000 or 2000000."
	exit 1
fi

INFOGENOMER_INPUT=`basename $INFOGENOMER_INPUT`
InfoHiC_test $INFOGENOMER_INPUT -m $mode -w $window_string -g $gpu -c $model\/contig_model
