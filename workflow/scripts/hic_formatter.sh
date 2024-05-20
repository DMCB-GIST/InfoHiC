#!/bin/bash

dir=`dirname $(readlink -f ${BASH_SOURCE[0]})`
dir=`echo $dir | awk '{split($1,f,"workflow"); print f[1]"HiC_processing/hic_formatter";}'`
resolution=$1;
window=$2;
input_dir=`readlink -f $3`;
output_dir=`readlink -f $4`;

window=`echo -e "$window\t$resolution" | awk -F "\t" '{if($1/$2 %2 == 1){print $1+$2}else{print $1}}'`
echo "window size: $window";




$dir\/format.sh $input_dir $output_dir hic

$dir\/format.sh ${input_dir}_shift $output_dir hic_shift

$dir\/chr_matrix_format_raw_rc.sh $resolution $window $input_dir $output_dir raw hic

$dir\/chr_matrix_format_raw_rc.sh $resolution $window $input_dir $output_dir raw hic_shift

$dir\/chr_matrix_trans.sh $input_dir $output_dir hic

$dir\/chr_matrix_trans.sh ${input_dir}_shift $output_dir hic_shift
