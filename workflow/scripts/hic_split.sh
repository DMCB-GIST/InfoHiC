#!/bin/bash
PY_PATH=`which python3.8`
PY_PATH=`dirname $PY_PATH`
export PATH=$PY_PATH:$PATH

hic_format_input=`readlink -f $1`;
chrom_size=`readlink -f $hic_format_input | awk '{n=split($1,f,"/"); for(i=1;i<=n-1;i++){printf "%s/", f[i]}}END{printf "3div/ref_chrom_sizes.X.txt"}'`


SVs=`readlink -f $hic_format_input | awk '{n=split($1,f,"/"); for(i=1;i<=n-2;i++){printf "%s/", f[i]}}END{printf "InfoGenomeR_output/SVs.CN_opt.phased"}'`

dir=`dirname $(readlink -f ${BASH_SOURCE[0]})`
dir=`echo $dir | awk '{split($1,f,"workflow"); print f[1]"HiC_processing/hic_split";}'`
resolution=$2
window=$3
split_rate=$4
ref=`readlink -f $5`
output=$6
mkdir -p $output;
cd $output;


if [[ -s $SVs ]];then
	cat $SVs | awk -v OFS="\t" '{if($2==23) $2="X"; if($4==23) $4="X"; print "chr"$2"\t"$3; print "chr"$4"\t"$5}' > breaks
fi

echo "splitting HiC data..."
Rscript $dir\/seed.R 4000000 $resolution $chrom_size $split_rate
Rscript $dir\/set.R 4000000 $window $resolution $chrom_size

# gap (NNN) region filter
for m in test train valid sv;do
	if [[ -s $m\_set ]];then
		python $dir\/gap_filter.py $m\_set $ref  > $m\_set.filtered &
	fi
done
wait;



kb_res=`echo $resolution | awk '{kb_res=$1/1000; print kb_res"kb"}'`


cp -r $hic_format_input\/chr_matrix_format_rc/ ./
cp -r $hic_format_input\/chr_matrix_format_rc_shift/ ./

cd chr_matrix_format_rc
$dir\/bed.sh $kb_res 0 

shift_res=`echo $resolution | awk '{print $1/2}'`
cd ../chr_matrix_format_rc_shift 
$dir\/bed.sh $kb_res $shift_res

cd ../

for s in sv train test valid;do
	if [[ -s chr_matrix_format_rc/$kb_res.bed.f.for_$s ]];then
		cp chr_matrix_format_rc/$kb_res.bed.f.for_$s $kb_res.bed.f.for_$s
		cp chr_matrix_format_rc/$kb_res.bed.rc.for_$s $kb_res.bed.rc.for_$s
		cp chr_matrix_format_rc_shift/$kb_res.bed.f.for_$s $kb_res.bed.f.for_$s.shift
		cp chr_matrix_format_rc_shift/$kb_res.bed.rc.for_$s $kb_res.bed.rc.for_$s.shift
	fi
done

if [[ -s $kb_res.f.for_sv ]];then
	Rscript $dir\/sv_bed.R $kb_res
fi

echo "split done"
