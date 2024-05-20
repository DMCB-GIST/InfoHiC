#!/bin/bash
dir=`dirname $(readlink -f ${BASH_SOURCE[0]})`
bin_size=$1;
window_size=$2;

input_dir=$3;
output_dir=$4;
mode=$5;
hic_shift=$6;

if [[ $hic_shift == "hic_shift" ]];then
	hic_shift="T"
else
	hic_shift="F"
fi

cd $output_dir
cp $input_dir\/ref_chrom_sizes.X.txt  ./
mkdir -p chr_matrix_format_rc
mkdir -p chr_matrix_format_rc_shift

if [[ $mode == "raw" ]];then
	for i in `seq 1 22`;do
		Rscript $dir\/chr_matrix_format_raw_rc.R $i T $bin_size $window_size $dir $hic_shift && Rscript $dir\/chr_matrix_format_raw_rc.R $i F $bin_size $window_size $dir $hic_shift &
	done
	i="X"
		Rscript $dir\/chr_matrix_format_raw_rc.R $i T $bin_size $window_size $dir $hic_shift && Rscript $dir\/chr_matrix_format_raw_rc.R $i F $bin_size $window_size $dir $hic_shift &
else
        echo "select mode"
        exit 1
fi

wait 




