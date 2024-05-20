#!/bin/bash
ref=`readlink -f $1`
fq1=`readlink -f $2`
fq2=`readlink -f $3`
res=$4;
out_dir=`readlink -f $5`

HiC_processing/3div.sh $ref $fq1 $fq2 $res $out_dir

