t=read.table("0.output",stringsAsFactors=F)
t[,1]=factor(t[,1],levels=c(paste("chr",c(1:22,"X"),sep="")))
t[,3]=factor(t[,3],levels=c(paste("chr",c(1:22,"X"),sep="")))

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

t1=t$V1
t2=t$V2
t3=t$V3
t4=t$V4
t5=t$V5


while(i<nrow(t)){

	for( j in (i+1):nrow(t)){
		if(t1[i] != t1[j] | t3[i] != t3[j] | t2[i]!=t2[j] | t4[i]!=t4[j]){
			break;
		}
	}
	j=j-1
	s= sum(t5[i:j])
	for(k in i:j){
		t5[k] =s
	}
	
	
	i=j+1;
	print(i)
}

t=data.frame(V1=t1,V2=t2,V3=t3,V4=t4,V5=t5)
t=t[!duplicated(t),]




write.table(t, "0.output.format",quote=F,sep="\t",row.names=F,col.names=F)

