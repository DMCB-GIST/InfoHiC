t=read.table("contigs.index",stringsAsFactors=F)
e=read.table("edge_information.txt",stringsAsFactors=F)
e=e[e[,5]==2,]

svv=unique(c(e[,1],e[,2]))

t$sv_tag=0
for(i in 2:nrow(t)){
	w1=which(e[,1] == t[i-1,3] & e[,2] == t[i,2])
	w2=which(e[,2] == t[i-1,3] & e[,1] == t[i,2])
	if(t[i-1,1] == t[i,1] && length(c(w1,w2))>0){
		t$sv_tag[i-1]=1
	}
}
write.table(t[t$sv_tag==1,c(1,7)],"contigs.index.sv",quote=F, sep="\t",col.names=F, row.names=F)

