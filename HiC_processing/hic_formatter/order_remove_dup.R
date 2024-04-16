args=commandArgs(T)
t=read.table(args[1],stringsAsFactors=F)
t=t[order(t[,1],t[,2]),]
df_dups=t[c("V1","V2")];
t=t[!duplicated(df_dups),]

write.table(t, args[2], sep="\t", row.names=F, col.names=F, quote=F)
