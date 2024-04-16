#!/bin/bash
lib=`dirname $(readlink -f ${BASH_SOURCE[0]})`
kb_res=$1
shift_res=$2

for s in train valid test sv;do
	for o in f rc;do
		echo -n "" > ${kb_res}.bed.$o.for_$s
	done

	echo -n "" > $s\_set.filtered_for_$s
done



for i in `seq 1 22`;do
	for s in train valid test sv;do
		for o in f rc;do
			Rscript $lib\/bed.R ../$s\_set.filtered ${kb_res}_chr$i.bed.$o chr$i $s\_set.filtered_for_$s.$i ${kb_res}_chr$i.bed.$o.for_$s $shift_res
			if [[ $o -eq f ]];then
				cat $s\_set.filtered_for_$s.$i >> $s\_set.filtered_for_$s
			fi
			cat ${kb_res}_chr$i.bed.$o.for_$s >> ${kb_res}.bed.$o.for_$s
		done
	done
done
i="X"
	for s in train valid test sv;do
		for o in f rc;do
			Rscript $lib\/bed.R ../$s\_set.filtered ${kb_res}_chr$i.bed.$o chr$i $s\_set.filtered_for_$s.$i ${kb_res}_chr$i.bed.$o.for_$s $shift_res
			if [[ $o -eq f ]];then
				cat $s\_set.filtered_for_$s.$i >> $s\_set.filtered_for_$s
			fi
			cat ${kb_res}_chr$i.bed.$o.for_$s >> ${kb_res}.bed.$o.for_$s
		done
	done
