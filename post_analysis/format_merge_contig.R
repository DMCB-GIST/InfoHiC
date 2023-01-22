args=commandArgs(T)
t=read.table(args[1],stringsAsFactors=F)
t[,1]=factor(t[,1],levels=c(paste("contig",c(1:9999),sep="")))
t[,3]=factor(t[,3],levels=c(paste("contig",c(1:9999),sep="")))

w1=which(as.numeric(t[,1]) >as.numeric(t[,3]))

if(length(w1)>0){
        tmp=t[w1,1];
        t[w1,1]=t[w1,3];
        t[w1,3]=tmp;
       tmp=t[w1,2];
        t[w1,2]=t[w1,4];
        t[w1,4]=tmp;
}
w2=which(t[,1]  == t[,3] & t[,2] > t[,4])
if(length(w2)>0){
       tmp=t[w2,2];
        t[w2,2]=t[w2,4];
        t[w2,4]=tmp;
}



t=t[order(t[,1],t[,2],t[,3],t[,4]),]


i=1;

while(i<nrow(t)){

	for( j in (i+1):nrow(t)){
		if(t[i,1] != t[j,1] | t[i,3] != t[j,3] | t[i,2]!=t[j,2] | t[i,4]!=t[j,4]){
			break;
		}
	}
	j=j-1
	s= sum(t[i:j,5])
	for(k in i:j){
		t[k,5] =s
	}
	
	
	i=j+1;
#	print(i)
}

t=t[!duplicated(t),]




write.table(t, args[2],quote=F,sep="\t",row.names=F,col.names=F)

