t=read.table("contigs.bed.sv_window",stringsAsFactors=F)

min_window=8000000

contigs=read.table("contigs.index",stringsAsFactors=F)
contigs$ori="+"
contigs$ori[contigs[,6]-contigs[,5]<0]="-"


for(i in 1:nrow(t)){

	if(1){
#	if ( t[i,3]-t[i,2] > min_window){
		l_contigs=contigs[contigs[,1]==t[i,1],]

		w1=min(which(t[i,2] <= l_contigs[,7]))
		w2=min(which(t[i,3] <= l_contigs[,7]))

		start=t[i,2]
		end=t[i,3]

		w_contigs=l_contigs[w1:w2,]
		w_contigs$contig_start=NA
		w_contigs$contig_end=NA


		if(l_contigs$ori[w1]=="+"){
			w_contigs[1,5]=l_contigs[w1,6]-l_contigs[w1,7]+start+1;
		}else{
			w_contigs[1,5]=l_contigs[w1,6]+l_contigs[w1,7]-start-1;
		}

		w_end=nrow(w_contigs)

		if(l_contigs$ori[w2]=="+"){
			w_contigs[w_end,6]=l_contigs[w2,6]-l_contigs[w2,7]+end
		}else{
			w_contigs[w_end,6]=l_contigs[w2,6]+l_contigs[w2,7]-end
		}
	
		w_contigs[w_end,7]=end

		for(j in 1:w_end){
			w_contigs$contig_start[j]=w_contigs[j,7] -(abs(w_contigs[j,5]-w_contigs[j,6]))
			w_contigs$contig_end[j]=w_contigs[j,7]
		}

		
		write.table(w_contigs,paste(i,".index.ref_coor",sep=""),quote=F, sep="\t", row.names=F, col.names=F)

	}

}
