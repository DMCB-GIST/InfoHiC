#!/bin/bash

dir=`dirname $(readlink -f ${BASH_SOURCE[0]})`
dir=`echo $dir | awk '{split($dir,f,"HiC_processing"); print f[1]"ext/3divv2-master"}'`

out_dir=$5;
cd $out_dir
ref=$1;
fastq1=$2;
fastq2=$3;
resolution=$4;
shift=`echo $resolution | awk '{print $1/2}'`

mkdir -p 3div
cd 3div
cat $ref.fai  | awk '{split($1,f,"chr"); if(f[1]~/^[1-2]?[0-9]$/ || f[1]=="X") print "chr"f[1]"\t"$2}' > ref_chrom_sizes.X.txt

cat $ref.fai | awk -v res=$resolution '{for(i=0;i<$2;i=i+res){print $1"\t"i"\t"i+res}}' > 1_${resolution}_abs.bed.format.MT

read_length=`zcat $fastq1  | head -n2 | awk '{if(NR==2){print length($1)}}'`;

bwa mem -M -t 20 $ref  $fastq1 > 1.sam &
pids[0]=$!;
bwa mem -M -t 20 $ref $fastq2 > 2.sam &
pids[1]=$!;

wait ${pids[0]}
wait ${pids[1]}

python2 $dir\/hic_pipeline/bin/filter_chimeric.v2.py 1.sam $read_length > 1.filtered.sam &
pids[0]=$!;
python2 $dir\/hic_pipeline/bin/filter_chimeric.v2.py 2.sam $read_length > 2.filtered.sam &
pids[1]=$!;

wait ${pids[0]}
wait ${pids[1]}


python2 $dir\/hic_pipeline/bin/make_paired_sam.py 1.filtered.sam 2.filtered.sam  | samtools view -Sb -t $ref.fai -o merged.bam



samtools view  -S merged.bam | python2 $dir\/hic_pipeline/bin/filter_self_reads_stdin.py | samtools view -Sb -t $ref.fai  -o filtered.merged.bam

samtools sort filtered.merged.bam > sorted.filtered.merged.bam


java -Xmx200g -jar $dir\/hic_pipeline/picard.jar MarkDuplicates VALIDATION_STRINGENCY=LENIENT REMOVE_DUPLICATES=TRUE ASSUME_SORTED=TRUE I=sorted.filtered.merged.bam O=nodup.sorted.filtered.merged.bam METRICS_FILE=nodup.sorted.filtered.merged.bam.metrics


samtools index nodup.sorted.filtered.merged.bam


coverageBed -sorted -counts -b nodup.sorted.filtered.merged.bam -a 1_${resolution}_abs.bed.format.MT > ${resolution}bp.coverage

sortBed -i ${resolution}bp.coverage > ${resolution}bp.sort.coverage

cat ${resolution}bp.sort.coverage | awk -v res=$resolution '{print $1"\t"$2"\t"$2+res"\t"$4}' > ${resolution}bp.sort.coverage.r


python2 $dir\/hic_pipeline/bin/make_feature_normalize_nochr.py ./nodup.sorted.filtered.merged.bam ./${resolution}bp.sort.coverage.r $resolution


cd ../
mkdir -p 3div_shift
cd 3div_shift
cat $ref.fai  | awk '{split($1,f,"chr"); if(f[1]~/^[1-2]?[0-9]$/ || f[1]=="X") print "chr"f[1]"\t"$2}' > ref_chrom_sizes.X.txt

cp ../3div/nodup.sorted.filtered.merged.bam ./
cp ../3div/nodup.sorted.filtered.merged.bam.bai ./

cat $ref.fai | awk -v res=$resolution -v shift=$shift '{i=shift;print $1"\t"i"\t"i+res; for(i=shift+res;i<$2;i=i+res){print $1"\t"i"\t"i+res}}' > 1_${resolution}_abs.bed.format.MT.shift

coverageBed -sorted -counts -b ./nodup.sorted.filtered.merged.bam -a 1_${resolution}_abs.bed.format.MT.shift  > ${resolution}bp.coverage.shift

sortBed -i ${resolution}bp.coverage.shift > ${resolution}bp.sort.coverage.shift

cat ${resolution}bp.sort.coverage.shift | awk -v res=$resolution '{print $1"\t"$2"\t"$2+res"\t"$4}' > ${resolution}bp.sort.coverage.r.shift


python2 $dir\/hic_pipeline/bin/make_feature_normalize_nochr_shift.py ./nodup.sorted.filtered.merged.bam ./${resolution}bp.sort.coverage.r.shift $resolution $shift
