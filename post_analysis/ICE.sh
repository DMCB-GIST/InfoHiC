#!/bin/bash

i=$1



## zero padding

cat $i.output.format.v | awk '{if($5>0){print $2/40000"\t"$4/40000"\t"$5}}' > $i.output.m
contig_name=`head -n 1 $i.output.format.v | cut -f1`
python ${InfoHiC_lib}/post_analysis/ICE.py $i.output.m
cat $i.output_ice.m | awk '{if($1<=$2){print "'${contig_name}'\t"($1)*40000"\t'${contig_name}'\t"($2)*40000"\t"$3}}' > $i.output.m.format
cat $i.output.m.format  |  awk '{if($2>0 && $4>0) print $0}' > $i.output.m.format.v
Rscript ${InfoHiC_lib}/post_analysis/tad.R $i.output.m.format.v 50


if [[ -s contig$i.index.sv ]];then
	while read -r -a l;do
		cat $i.output.m.format.v.tad | awk '{if($2 < '"${l[1]}"'  && '"${l[1]}"'< $3 ) print $0}'
	done < $i.index.sv  > $i.index.sv.tad.m

	if [[ -s $i.index.sv.tad.m ]];then
		Rscript  ${InfoHiC_lib}/post_analysis/dup.R $i.index.sv.tad.m
	fi

	if [[ -s $i.index.sv.tad.m ]];then
		while read -r -a line;do
			if [[ -s $i.index.se ]];then
				n=`cat $i.index.se | awk '{if($5>='"${line[1]}"' && $6<='"${line[2]}"') print $2}' | wc -l`
				ns=`cat $i.index.se | awk '{if($5>='"${line[1]}"' && $6<='"${line[2]}"') printf "%s,", $2}'`
				if [[ $n == 0 ]];then
					echo -e  "${line[0]}\t${line[1]}\t${line[2]}\t${line[3]}\t0\tNA"
				else
					echo -e  "${line[0]}\t${line[1]}\t${line[2]}\t${line[3]}\t1\t$ns"
				fi
			else
				echo -e  "${line[0]}\t${line[1]}\t${line[2]}\t${line[3]}\t0\tNA"
			fi
		done < $i.index.sv.tad.m > $i.index.sv.tad.m.withse
	fi

	j=1
	for level in `seq 1 3`;do
	while read -r -a l;do
		if [[ ${l[3]} == $level ]];then
			cat $i.index.ens | awk '{if($5>='"${l[1]}"' && $6 <='"${l[2]}"') print $0}' > $i.index.sv.tad.m_ens.level$level.$j
			if [[ -s $i.index.sv.tad.m_ens.level$level.$j ]];then
				echo -n ""
			fi
			j=$(($j+1))
		fi
	done < $i.index.sv.tad.m

	j=1
	while read -r -a l;do
		if [[ ${l[3]} == $level ]] && [[ ${l[4]} == 1 ]]; then
			cat $i.index.ens | awk '{if($5>='"${l[1]}"' && $6 <='"${l[2]}"') print $0"\t""'${l[5]}'"}' > $i.index.sv.tad.m_withse_ens.level$level.$j

			j=$(($j+1))
		fi

	done < $i.index.sv.tad.m.withse
	done

fi

