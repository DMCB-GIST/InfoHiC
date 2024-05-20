args=commandArgs(T)
options(scipen=999)
chr=args[3]
shift=as.numeric(args[6])

a=read.table(args[1],stringsAsFactors=F)
a=a[a[,1]==chr,]
a[,2]=a[,2]+shift
a[,3]=a[,3]+shift
b=read.table(args[2],stringsAsFactors=F)
m=merge(a,b,by="V2")

m=m[sample(nrow(m), nrow(m)),]

write.table(m[,c(2,1,5)], args[4], quote=F,sep="\t",row.names=F,col.names=F)
write.table(m[,c(2,1,5,6)], args[5], quote=F,sep="\t",row.names=F,col.names=F)
