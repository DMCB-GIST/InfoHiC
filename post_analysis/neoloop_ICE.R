
args=commandArgs(T)
t=read.table(paste(args[1],".index.neoloop.m",sep=""),stringsAsFactors=F)

e=read.table(paste(args[1],".index.ens",sep=""),stringsAsFactors=F)
s=read.table(paste(args[1],".index.se",sep=""),stringsAsFactors=F)

res=as.numeric(args[2])


for(i in 1:nrow(t)){
	w1=which((t[i,1]-res<e[,5]  & e[,5] <t[i,1]+res) | (t[i,1]-res<e[,6]  & e[,6] <t[i,1]+res))
	w2=which((t[i,2]-res<s[,5]  & s[,5] <t[i,2]+res) | (t[i,2]-res<s[,6]  & s[,6] <t[i,2]+res))


        w3=which((t[i,2]-res<e[,5]  & e[,5] <t[i,2]+res) | (t[i,2]-res<e[,6]  & e[,6] <t[i,2]+res))
        w4=which((t[i,1]-res<s[,5]  & s[,5] <t[i,1]+res) | (t[i,1]-res<s[,6]  & s[,6] <t[i,1]+res))

	
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
