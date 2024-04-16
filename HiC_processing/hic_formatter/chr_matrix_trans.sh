#!/bin/bash
input_dir=$1
output_dir=$2

if [[ $3 == "hic_shift" ]];then
	matrix="chr_matrix_trans_shift"
else
	matrix="chr_matrix_trans"
fi


cd $output_dir
mkdir -p $matrix

for i in `seq 1 22`;do
	zcat $input_dir\/nodup.$i.trans.feature.gz | grep -v frag1 | awk '{split($1,f,"\."); split($2,g,"\."); print f[1]"\t"f[2]"\t"g[1]"\t"g[2]"\t"$5}'  > ./$matrix\/$i.matrix &
done
i='X'
        zcat $input_dir\/nodup.$i.trans.feature.gz | grep -v frag1 | awk '{split($1,f,"\."); split($2,g,"\."); print f[1]"\t"f[2]"\t"g[1]"\t"g[2]"\t"$5}'  > ./$matrix\/$i.matrix &

wait


