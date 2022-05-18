
args=commandArgs(T)
t=read.table(paste(args[1],".index.neoloop.m",sep=""),stringsAsFactors=F)

e=read.table(paste(args[1],".index.ens",sep=""),stringsAsFactors=F)
s=read.table(paste(args[1],".index.se",sep=""),stringsAsFactors=F)
v=read.table(paste(args[1],".index.sv",sep=""),stringsAsFactors=F)
ws=2000000



r=c()
for(i in 1:nrow(t)){
	
	if(!any(v[,2]-ws/2 <= (t[i,1]+t[i,2])/2  & (t[i,1]+t[i,2])/2 <=v[,2]+ws/2)){
		r=c(r,i)
	}


}
if(length(r)>0){
	t=t[-r,]
}

write.table(t, paste(args[1],".index.neoloop.m",sep=""), quote=F, sep="\t" ,row.names=F, col.names=F)
