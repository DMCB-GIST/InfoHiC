args=commandArgs(T)
t=read.table(args[1],stringsAsFactors=F)
 t=t[!duplicated(t[,c(2,3,4)]),]
 write.table(t,args[1],quote=F, sep="\t", row.names=F, col.names=F)

