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
	lib=${LIB}\/InfoHiC_tensorflow/OHN_ref/contigs
else
	lib=${LIB}\/InfoHiC_tensorflow/${mode}/contigs
fi
res=$3
window=$4
SEED_FILE=`readlink -f $5`
MAX_EPOCH=$6
REF=$7


HiC_dir=`readlink -f $8`

INPUT=$9
OUTPUT=`realpath ${10}`

INPUT_DIR=`dirname $INPUT`
INPUT_DIR=`realpath $INPUT_DIR`

weight=$INPUT_DIR\/weight_bias.npz

mkdir -p $OUTPUT
cd ${INPUT_DIR}

if ! [ `ls best_checkpoint.index > /dev/null ; echo $?` -eq 0 ]; then
echo "best_checkpoint does not exist"
	exit 1
fi

python $lib\/save_weights_bias.py best_checkpoint



cd $OUTPUT
InfoHiC_model_change $gpu $lib $res $window  $HiC_dir $SEED_FILE $MAX_EPOCH $REF $weight
