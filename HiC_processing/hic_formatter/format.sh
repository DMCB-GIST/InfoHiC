#!/bin/bash

dir=`dirname $(readlink -f ${BASH_SOURCE[0]})`

input_dir=$1;
output_dir=$2;
hic_shift=$3;

matrix_prefix=chr_matrix
if [[ $hic_shift == "hic_shift" ]];then
	matrix_prefix=chr_matrix_shift
fi

mkdir -p $output_dir\/$matrix_prefix

cd $input_dir

for i in `seq 1 22`;do
        zcat nodup.$i.cis.feature.gz  | awk '{split($1,f,"."); split($2,g,"."); if(NR>1){ if(g[2]>f[2]){print f[2]"\t"g[2]"\t"$5}else{print g[2]"\t"f[2]"\t"$5}}}' > nodup.$i.format &&
        Rscript $dir\/order_remove_dup.R nodup.$i.format nodup.$i.format &&

	ln -s $input_dir\/nodup.$i.format $output_dir\/$matrix_prefix\/$i.matrix & 
#	echo ""
done

i="X"
       zcat nodup.$i.cis.feature.gz  | awk '{split($1,f,"."); split($2,g,"."); if(NR>1){ if(g[2]>f[2]){print f[2]"\t"g[2]"\t"$5}else{print g[2]"\t"f[2]"\t"$5}}}' > nodup.$i.format &&
        Rscript $dir\/order_remove_dup.R nodup.$i.format nodup.$i.format &&

        ln -s $input_dir\/nodup.$i.format $output_dir\/$matrix_prefix\/$i.matrix & 

wait
