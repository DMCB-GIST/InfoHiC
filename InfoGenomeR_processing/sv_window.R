ew=4000000 ##### lengthen window for enough prediction

view=4000000 ### real view


e=read.table("edge_information.txt",stringsAsFactors=F)
e=e[e[,5]==2,]

ref.ref_window=data.frame(stringsAsFactors=F)
ref.sv_window=data.frame(stringsAsFactors=F)
rw_i=1
svw_i=1

if(nrow(e)!=0){
	e_dups=e[c(1,2)]
	e=e[!duplicated(e_dups),]
	n=read.table("node_keys",stringsAsFactors=F)
	w=c()
	for(i in 1:nrow(e)){
		w1=which(n$node==e[i,1])
		w2=which(n$node==e[i,2])

		ref.ref_window[rw_i,1]=paste("chr",n[w1,"chrom"],sep="")
		ref.ref_window[rw_i,2]=n[w1,"key"]-view/2
		ref.ref_window[rw_i,3]=n[w1,"key"]+view/2
                rw_i=rw_i+1
                ref.ref_window[rw_i,1]=paste("chr",n[w2,"chrom"],sep="")
                ref.ref_window[rw_i,2]=n[w2,"key"]-view/2
                ref.ref_window[rw_i,3]=n[w2,"key"]+view/2
		rw_i=rw_i+1

                ref.sv_window[svw_i,1]=paste("chr",n[w1,"chrom"],sep="")

		if(!(e[i,1] %% 2)){
			ref.sv_window[svw_i,2]=n[w1,"key"]
			ref.sv_window[svw_i,3]=n[w1,"key"]+view/2
		}else{
                        ref.sv_window[svw_i,2]=n[w1,"key"]-view/2
                        ref.sv_window[svw_i,3]=n[w1,"key"]
		}
                ref.sv_window[svw_i,4]=paste("chr",n[w2,"chrom"],sep="")

		if(!(e[i,2] %% 2)){

                        ref.sv_window[svw_i,5]=n[w2,"key"]
                        ref.sv_window[svw_i,6]=n[w2,"key"]+view/2
                }else{
                        ref.sv_window[svw_i,5]=n[w2,"key"]-view/2
                        ref.sv_window[svw_i,6]=n[w2,"key"]
                }
		svw_i=svw_i+1


		 w=c(w,which(n$node==e[i,1]))
		 w=c(w,which(n$node==e[i,2]))
	}
	w=unique(w)

	k=c()
	for( i in 1:length(w)){
		k=c(k,which(n$chrom==n[w[i],"chrom"] & n$key==n[w[i],"key"]))
	}
	k=unique(k)

	vn=n[k,"node"]

}


if(nrow(ref.ref_window)>0){
	ref.ref_window[,1]=factor(ref.ref_window[,1],levels=paste("chr",c(1:22,"X"),sep=""))
	ref.ref_window= ref.ref_window[order(as.numeric(ref.ref_window[,1]),ref.ref_window[,2]),]

	for( i in 2:nrow(ref.ref_window)){
		if(ref.ref_window[i-1,1]==ref.ref_window[i,1] && ref.ref_window[i,2] < ref.ref_window[i-1,3]){
			ref.ref_window[i-1,3] = ref.ref_window[i,3];
			ref.ref_window[i,2] = ref.ref_window[i-1,2];
		}
	}
	ref.ref_window=ref.ref_window[!duplicated(ref.ref_window[,c(1,2)],fromLast=T),]
}




write.table(ref.ref_window,"ref.ref_window",quote=F,sep="\t",row.names=F,col.names=F)
write.table(ref.sv_window,"ref.sv_window",quote=F,sep="\t",row.names=F,col.names=F)


m=read.table("contigs.bed",stringsAsFactors=F)
path=scan("path1", what="character", sep="\n")

total_cum_bed=data.frame(stringsAsFactors=F)

if(nrow(e)>0){
for(i in 1:length(path)){

	cum_len=0
	cum_bed=data.frame()
	p=strsplit(path[i],"\t")[[1]];
	
	cbi=1
	j=4

	while(j+2<length(p)){
		cum_len=cum_len+abs(n[n$node==p[j],2] -  n[n$node==p[j+1],2])


		if(p[j+1]%in% vn ||  p[j+2] %in% vn){
			cum_bed[cbi,1]=max(1,cum_len-ew)
			cum_bed[cbi,2]=min(cum_len+ew, m[i,3])
			cbi=cbi+1;
		}
		j=j+2;
	}
	
	if(nrow(cum_bed)>1){
		for(cbi in 2:nrow(cum_bed)){
			if(cum_bed[cbi,1] < cum_bed[cbi-1,2]){
				cum_bed[cbi-1,2] = cum_bed[cbi,2];
				cum_bed[cbi,1] = cum_bed[cbi-1,1];
			}
			
		}
		cum_bed=cum_bed[!duplicated(cum_bed[,1],fromLast=T),]
	}
	
	if(nrow(cum_bed)>0){
		cum_bed=cbind(paste("contig",i,sep=""), cum_bed, "reference")
		if(p[2] == "linear"){
			total_cum_bed=rbind(total_cum_bed,cum_bed)
		}
	}
}
}
write.table(total_cum_bed, "contigs.bed.sv_window", col.names=F, row.names=F, quote=F, sep="\t")
