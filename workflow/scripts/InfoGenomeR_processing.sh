#!/bin/bash

LIB=`readlink -f ${BASH_SOURCE[0]} | awk '{n=split($1,f,"/"); for(i=1;i<=n-3;i++){printf "%s/", f[i]}}'`
export InfoHiC_lib=$LIB
export PATH=$InfoHiC_lib/InfoGenomeR_processing:$InfoHiC_lib/InfoHiC_tensorflow:$InfoHiC_lib/post_analysis:$PATH
export FRAC=0.9


humandb=`readlink -f ${BASH_SOURCE[0]} | awk '{n=split($1,f,"/"); for(i=1;i<=n-3;i++){printf "%s/", f[i]}}END{printf "humandb"}'`

input=$1;
ref=$2;
ref_prefix=`echo $ref | awk '{n=split($1,f,"/"); split(f[n],g,".fa"); print g[1]}'`
type=$3;

cp -r $input $input.$type
input=$input.$type


InfoGenomeR_processing $input $ref -e ${humandb}/hg19_ensGene.txt -s ${humandb}/SE_package.bed.${type}.rf -t ${humandb}/TE_package.bed.${type}.rf

cd $input
ln -s haplotype/hap1.fa hap1.fa
ln -s haplotype/hap2.fa hap2.fa

cat copy_number.CN_opt.phased  | awk -v OFS="\t" '{if($1==23) $1="X"; $1="chr"$1; print $0}' > ascn_file
