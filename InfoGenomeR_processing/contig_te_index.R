args=commandArgs(T)
t=read.table("contigs.index",stringsAsFactors=F)
g=read.table(args[1],stringsAsFactors=F)

g=read.table(args[1],stringsAsFactors=F)

g_trans=data.frame()
for( i in 1:nrow(t)){

	if(t[i,5] < t[i,6]){
                 lg=g[g[,3]==t[i,4] & ((g[,5] > t[i,5] & g[,5] < t[i,6]) | ( g[,6] > t[i,5] & g[,6] < t[i,6])),]
		 if(i==1 || t[i-1,1] != t[i,1] ){
			scoor=0;
		}else{
			scoor=t[i-1,7];
		}
		if(nrow(lg)>0){
			lg[,3] = t[i,1]
			lg[,5] =  scoor+lg[,5]-t[i,5]
			lg[,6] =  scoor+lg[,6]-t[i,5]
		}
	}else{
                 lg=g[g[,3]==t[i,4] & ((g[,5] > t[i,6] & g[,5] < t[i,5]) | ( g[,6] > t[i,6] & g[,6] < t[i,5])),]
		 if(i==1 || t[i-1,1] != t[i,1] ){
			scoor=0;
		}else{
			scoor=t[i-1,7];
		}
		if(nrow(lg)>0){
			lg[,3] = t[i,1]
			lg[,5] =  scoor+t[i,5]-lg[,5]
			lg[,6] =  scoor+t[i,5]-lg[,6]
			tmp=lg[,5];
			lg[,5]=lg[,6]
			lg[,6]=tmp;
		}
	}
	if(nrow(lg)>0){
		g_trans=rbind(g_trans,lg)
	}
}
write.table(g_trans,"contigs.index.te",sep="\t", row.names=F, col.names=F, quote=F)
