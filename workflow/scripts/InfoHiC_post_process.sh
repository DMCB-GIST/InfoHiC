#!/bin/bash
PY_PATH=`which python3.8`
PY_PATH=`dirname $PY_PATH`
export PATH=$PY_PATH:$PATH

LIB=`readlink -f ${BASH_SOURCE[0]} | awk '{n=split($1,f,"/"); for(i=1;i<=n-3;i++){printf "%s/", f[i]}}'`
export InfoHiC_lib=$LIB
export PATH=$InfoHiC_lib/InfoGenomeR_processing:$InfoHiC_lib/InfoHiC_tensorflow:$InfoHiC_lib/post_analysis:$PATH
export FRAC=0.9

bp_context=$1
res=$2
cancer_type=$3
INPUT=$4
OUTPUT=`realpath $5`

mkdir -p $OUTPUT
cd $INPUT

if [[ $bp_context == 1040000 ]] || [[ $bp_context == 1020000 ]] ;then
	window_string="1Mb"
elif [[ $bp_context == 2000000 ]];then
	window_string="2Mb"
else
	echo "invalid window_size (bp). Choose 1040000 (40kb), 1020000 (10kb), or 2000000."
	exit 1
fi

InfoHiC_post InfoGenomeR_output.${cancer_type}  -w $window_string -r $res

cd InfoGenomeR_output.${cancer_type}

while read -r -a chromosomes;do
	idx=1;
	while read -r -a line;do
		len=`echo -e "${line[1]}\t${line[2]}" | awk '{print $2-$1}'`
		if [[ $len -gt 4000000 ]];then

			l_output=$OUTPUT\/${chromosomes[0]}\/${line[0]}.${line[1]}.${line[2]}
			mkdir -p $l_output

			prefix_dir=karyotypes\/${chromosomes[0]}
			contig=`cat $prefix_dir\/$idx.output.format.v | head -n1 | cut -f1`
			cat $prefix_dir\/contigs.index | grep $contig > $l_output\/contigs.tsv
			cp $prefix_dir\/$idx.output.format.v $l_output\/hic.matrix
			cp $prefix_dir\/$idx.output.m.format.v $l_output\/hic_iced.matrix

			cat $prefix_dir\/$idx.index.ens | awk '{print $3"\t"$5"\t"$6"\t"$2"\t"$13}' > $l_output\/ens_gene.bed
			cat $prefix_dir\/$idx.index.se  | awk '{print $3"\t"$5"\t"$6"\t"$2}' > $l_output\/super_enhancer.bed
			cat $prefix_dir\/$idx.index.te | awk '{print $3"\t"$5"\t"$6"\t"$2}' > $l_output\/typical_enhancer.bed
			cat $prefix_dir\/$idx.output.format.v.tad | awk -v contig=$contig '{print contig"\t"$2"\t"$3"\t"$4}' > $l_output\/hic_tad.bed
			cat $prefix_dir\/$idx.output.m.format.v.tad | awk -v contig=$contig '{print contig"\t"$2"\t"$3"\t"$4}' > $l_output\/hic_iced_tad.bed
			cat $prefix_dir\/$idx.index.neoloop.m  | awk -v contig=$contig '{print contig"\t"$1"\t"$2}' > $l_output\/hic_iced_loop.bed
			cat $prefix_dir\/$idx.index.ref_coor  | awk '{print $4"\t"$5"\t"$6"\t"$8"\t"$1"\t"$9"\t"$10"\t+"}' > $l_output\/contigs_ref_coor.tsv


			cp $prefix_dir\/$idx.output.format.v.pdf $l_output\/hic.pdf
			cp $prefix_dir\/$idx.output.m.format.v.pdf $l_output\/hic_iced.pdf
		fi
		idx=$(($idx+1))
	done < karyotypes\/${chromosomes[0]}/contigs.bed.sv_window

done< karyotypes/euler.list
