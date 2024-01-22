args=commandArgs(T)
 t=read.table(args[1],stringsAsFactors=F)
window=as.numeric(args[2])
resolution=as.numeric(args[3])

min_idx=min(c(t[,1],t[,2]))
max_idx=max(c(t[,1],t[,2]))


w1=((t[,1]+t[,2])/2 > min_idx + window/resolution)
w2=((t[,1]+t[,2])/2 < max_idx - window/resolution)

w=which(w1&w2)

write.table(t[w,], args[1], quote=F, row.names=F, col.names=F, sep="\t")
