args=commandArgs(T)
target=args[1]
options(scipen=999)


bed=read.table("contigs.bed.sv_window",stringsAsFactors=F)
for(b in 1:nrow(bed)){

	if (file.info(paste("contig_out/class_predictions_",target,"_",b,"_", bed[b,1],"_",bed[b,2],"_",as.numeric(bed[b,3])-1,".txt.format",sep=""))$size==0  ||
	    file.info(paste("contig_out_rc/class_predictions_",target,"_",b,"_", bed[b,1],"_",bed[b,2],"_",as.numeric(bed[b,3])-1,".txt.format",sep=""))$size==0){
		next;
	}
	t1=read.table(paste("contig_out/class_predictions_",target,"_",b,"_", bed[b,1],"_",bed[b,2],"_",as.numeric(bed[b,3])-1,".txt.format",sep=""),stringsAsFactors=F)
	t2=read.table(paste("contig_out_rc/class_predictions_",target,"_",b,"_", bed[b,1],"_",bed[b,2],"_",as.numeric(bed[b,3])-1,".txt.format",sep=""),stringsAsFactors=F)
	m=merge(t1,t2,by=c("V1","V2"), all=T)
	w1=is.na(m[,3])
	w2=is.na(m[,4])
	w3= !w1 & !w2
	m$V5=NA
	m[w3,5] =(m[w3,3]+m[w3,4])/2
	m[w1,5] =m[w1,4]
	m[w2,5] =m[w2,3]
	t=m[,c(1,2,5)]

	#t=read.table("training_run_data_T47D_40kb_ascn_ACGT_out/class_predictions_T47D_deep_40kb_ascn_1_contig1_520000_40679999.txt.format",stringsAsFactors=F)
	#t=read.table("tmp/40kb_chr10.bed.format.format",stringsAsFactors=F)
	d=read.table("contigs.index",stringsAsFactors=F)

	
	d=d[d[,1]==bed[b,1],]
	for( i in 1:nrow(t)){
		w=list()
		dif=list()
		c=list()
		p=list()
		for(tc in c(1,2)){
			if(tc==1){
				j=1;
			}else{
				j=3;
			}
			
			w[[j]]=which(d[,7]>=t[i,tc])
			w[[j+1]]=which(d[,7]>=t[i,tc]+40000)

			if(length(w[[j]])>0 && length(w[[j+1]]) > 0){
				w[[j]]=min(w[[j]])
				w[[j+1]]=min(w[[j+1]])


				if(w[[j]]>1){
					dif[[j]]=t[i,tc]-d[w[[j]]-1,7]
				}else{
					dif[[j]]=t[i,tc];
				}
				if(w[[j+1]]>1){
					dif[[j+1]]=t[i,tc]-d[w[[j+1]]-1,7]
				}else{
					dif[[j+1]]=t[i,tc];
				}

				if(d[w[[j]],5] > d[w[[j]],6]){
					dif[[j]]=-dif[[j]]
				}
				if(d[w[[j+1]],5] > d[w[[j+1]],6]){
                                        dif[[j+1]]=-dif[[j+1]]
				}
				c[[j]]=d[w[[j]],5]+dif[[j]]
				c[[j+1]]=d[w[[j+1]],5]+dif[[j+1]]

				p[[j]]=(c[[j]] - 40000 * (c[[j]] %/% 40000)) / 40000
				p[[j+1]]=1-p[[j]];
			}
		}


		if(length(w[[1]])>0 && length(w[[2]]) > 0 && length(w[[3]])>0 && length(w[[4]])>0 ){
			r=rank(c(p[[1]]+p[[3]], p[[1]]+p[[4]], p[[2]]+p[[3]], p[[2]]+p[[4]]))
			r=which(r==min(r))[1]
		
			 if(r==1){
				 cat(sprintf("%s\t%s\t%s\t%s\t%s\n", d[w[[1]],4] , 40000*(c[[1]] %/% 40000), d[w[[3]],4], 40000*(c[[3]] %/% 40000),   t[i,3]))
			 }else if(r==2){
				cat(sprintf("%s\t%s\t%s\t%s\t%s\n", d[w[[1]],4], 40000*(c[[1]] %/% 40000), d[w[[4]],4], 40000*(c[[4]] %/% 40000),   t[i,3]))
			 }else if(r==3){
				cat(sprintf("%s\t%s\t%s\t%s\t%s\n", d[w[[2]],4], 40000*(c[[2]] %/% 40000), d[w[[3]],4], 40000*(c[[3]] %/% 40000),   t[i,3]))
			 }else{
				cat(sprintf("%s\t%s\t%s\t%s\t%s\n", d[w[[2]],4], 40000*(c[[2]] %/% 40000), d[w[[4]],4], 40000*(c[[4]] %/% 40000),   t[i,3]))
			 }
			#cat(sprintf("%s\t%s\t%s\n", 40000*(c1 %/% 40000), 40000*(c3 %/% 40000),   t[i,3]*(p1+p3)/(2*(p1+p2+p3+p4))))
			#cat(sprintf("%s\t%s\t%s\n", 40000*(c1 %/% 40000), 40000*(c4 %/% 40000),   t[i,3]*(p1+p4)/(2*(p1+p2+p3+p4))))
			#cat(sprintf("%s\t%s\t%s\n", 40000*(c2 %/% 40000), 40000*(c3 %/% 40000),   t[i,3]*(p2+p3)/(2*(p1+p2+p3+p4))))
			#cat(sprintf("%s\t%s\t%s\n", 40000*(c2 %/% 40000), 40000*(c4 %/% 40000),   t[i,3]*(p2+p4)/(2*(p1+p2+p3+p4))))

		}
	}
}
