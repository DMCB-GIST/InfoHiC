#!/bin/bash
i=1
window=$1
target=$2
while read -r -a line;do
	e=$((${line[2]}-1));
	if [[ ${line[4]} == "linear" ]];then
		cat contig_out/class_predictions_$target\_$i\_${line[0]}\_${line[1]}_$e.txt | awk -f ${InfoHiC_lib}/post_analysis/test_f_2Mb.awk | awk '{if($1>=0 && $2>=0) print $0}'  > contig_out/class_predictions_$target\_$i\_${line[0]}\_${line[1]}_$e.txt.format
		cat contig_out_rc/class_predictions_$target\_$i\_${line[0]}\_${line[1]}_$e.txt | awk -f ${InfoHiC_lib}/post_analysis/test_rc_2Mb.awk | awk '{if($1>=0 && $2>=0) print $0}'  > contig_out_rc/class_predictions_$target\_$i\_${line[0]}\_${line[1]}_$e.txt.format
	else
		cat contig_out/class_predictions_$target\_$i\_${line[0]}\_${line[1]}_$e.txt | awk -f ${InfoHiC_lib}/post_analysis/test_f_2Mb.awk  | awk '{print $1"\t"$2"\t"$3*0.5}' | awk '{if($1>=0 && $2>=0) print $0}'  > contig_out/class_predictions_$target\_$i\_${line[0]}\_${line[1]}_$e.txt.format
		cat contig_out_rc/class_predictions_$target\_$i\_${line[0]}\_${line[1]}_$e.txt | awk -f ${InfoHiC_lib}/post_analysis/test_rc_2Mb.awk | awk '{print $1"\t"$2"\t"$3*0.5}' | awk '{if($1>=0 && $2>=0) print $0}'  > contig_out_rc/class_predictions_$target\_$i\_${line[0]}\_${line[1]}_$e.txt.format

	fi

#	ls -l training_run_data_T47D_40kb_ascn_ACGT_model_change_out/class_predictions_T47D_deep_40kb_$i\_${line[0]}\_${line[1]}_$e.txt.format


	i=$(($i+1));
done < $1
