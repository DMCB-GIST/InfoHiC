
args=commandArgs(T)
t=read.table(paste(args[1],".index.neoloop.m",sep=""),stringsAsFactors=F)

e=read.table(paste(args[1],".index.ens",sep=""),stringsAsFactors=F)
s=read.table(paste(args[1],".index.se",sep=""),stringsAsFactors=F)



for(i in 1:nrow(t)){
	w1=which((t[i,1]-40000<e[,5]  & e[,5] <t[i,1]+40000) | (t[i,1]-40000<e[,6]  & e[,6] <t[i,1]+40000))
	w2=which((t[i,2]-40000<s[,5]  & s[,5] <t[i,2]+40000) | (t[i,2]-40000<s[,6]  & s[,6] <t[i,2]+40000))


        w3=which((t[i,2]-40000<e[,5]  & e[,5] <t[i,2]+40000) | (t[i,2]-40000<e[,6]  & e[,6] <t[i,2]+40000))
        w4=which((t[i,1]-40000<s[,5]  & s[,5] <t[i,1]+40000) | (t[i,1]-40000<s[,6]  & s[,6] <t[i,1]+40000))

	
	if(length(w1)>0){
		le=e[w1,]
		for( j in 1:nrow(le)){
			cat(le[j,13])
			if(length(w2)>0){
				cat("\tse\n")
			}else{
				cat("\tnose\n")
			}
		}
	}

        if(length(w3)>0){
		le=e[w3,]
		for( j in 1:nrow(le)){
                        cat(le[j,13])
			if(length(w4)>0){
				cat("\tse\n")
			}else{
				cat("\tnose\n")
			}
                }
        }

	
}
