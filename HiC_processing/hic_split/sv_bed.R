args=commandArgs(T)
res=args[1]
options(scipen=999)

a=read.table(paste(res,".bed.f.for_train",sep=""),stringsAsFactors=F)
b=read.table(paste(res,".bed.f.for_sv",sep=""), stringsAsFactors=F)

m=rbind(a,b)
m[,1]=factor(m[,1], levels=paste("chr",c(1:22,"X"),sep=""))
m=m[order(m[,1],m[,2]),]

write.table(m, paste(res,".bed.f.for_train_withsv",sep=""),  quote=F,sep="\t",row.names=F,col.names=F)

a=read.table(paste(res,".bed.f.for_train.shift",sep=""), stringsAsFactors=F)
b=read.table(paste(res,".bed.f.for_sv.shift",sep=""), stringsAsFactors=F)

m=rbind(a,b)
m=m[order(m[,1],m[,2]),]
m[,1]=factor(m[,1], levels=paste("chr",c(1:22,"X"),sep=""))
write.table(m, paste(res, ".bed.f.for_train_withsv.shift",sep=""),   quote=F,sep="\t",row.names=F,col.names=F)




a=read.table(paste(res, ".bed.rc.for_train",sep=""),stringsAsFactors=F)
b=read.table(paste(res,".bed.rc.for_sv", sep=""), stringsAsFactors=F)

m=rbind(a,b)
m[,1]=factor(m[,1], levels=paste("chr",c(1:22,"X"),sep=""))
m=m[order(m[,1],m[,2]),]

write.table(m, paste(res, ".bed.rc.for_train_withsv",sep=""),  quote=F,sep="\t",row.names=F,col.names=F)

a=read.table(paste(res,".bed.rc.for_train.shift",sep="") ,stringsAsFactors=F)
b=read.table(paste(res,".bed.rc.for_sv.shift",sep=""), stringsAsFactors=F)

m=rbind(a,b)
m=m[order(m[,1],m[,2]),]
m[,1]=factor(m[,1], levels=paste("chr",c(1:22,"X"),sep=""))
write.table(m, paste(res, ".bed.rc.for_train_withsv.shift",sep=""),    quote=F,sep="\t",row.names=F,col.names=F)

