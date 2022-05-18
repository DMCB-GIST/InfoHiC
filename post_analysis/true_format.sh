#!/bin/bash

echo -n "" > true.matrix


s="$1"
cis_path=$2
trans_path=$3

for i in $s;do
	cat $cis_path\/$i.matrix | awk '{ print "chr""'$i'""\t"$1"\t""chr""'$i'""\t"$2"\t"$3}' >> true.matrix
	cat $trans_path\/$i.matrix | awk '{ print "chr"$1"\t"$2"\t""chr"$3"\t"$4"\t"$5}' >> true.matrix
done


