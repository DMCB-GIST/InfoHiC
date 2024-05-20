args=commandArgs(T)
options(scipen=999)

view=as.numeric(args[1])
bin=as.numeric(args[2])
chrom_size=args[3]
split_p=as.numeric(args[4])


t=read.table(chrom_size,stringsAsFactors=F)
nview=sum(round(t[,2]/view))


seed_chr=c()
seed_coor1=c()
seed_coor2=c()
for(i in 1:nrow(t)){
	a_seed=seq(view/2, t[i,2]-view, by=bin)
	seed_chr=c(seed_chr, rep(t[i,1], length(a_seed)))
	seed_coor1=c(seed_coor1, a_seed)
	seed_coor2=c(seed_coor2, a_seed+view)

}
seed=data.frame(chr=seed_chr, coor1=seed_coor1, coor2=seed_coor2, stringsAsFactors=F)
seed=seed[sample(nrow(seed),nrow(seed)),]


if(file.exists("breaks")){
	b=read.table("breaks",stringsAsFactors=F)

	sv_seed_chr=c()
	sv_seed_coor1=c()
	sv_seed_coor2=c()

	for(i in 1:nrow(b)){
		bstart =max(0,round(b[i,2]/bin)*bin - view/2)
		bend = min(t[t[,1]==b[i,1],2],round(b[i,2]/bin)*bin + view/2)
		sv_seed_chr=	  c(sv_seed_chr, b[i,1])
		sv_seed_coor1=	  c(sv_seed_coor1, bstart)
		sv_seed_coor2=	  c(sv_seed_coor2, bend)
	}
	sv_seed=data.frame(chr=sv_seed_chr, start=sv_seed_coor1, end=sv_seed_coor2)
	df_dups <- sv_seed[c("chr", "start", "end")]
	sv_seed=sv_seed[!duplicated(df_dups),]
	write.table(sv_seed,"sv_seed",sep="\t",row.names=F,col.names=F, quote=F)


	v=c()
	for(i in 1:nrow(seed)){
			if (any(seed[i,1] == sv_seed[,1] &  seed[i,3] > sv_seed[,2]  &  seed[i,2] < sv_seed[,3])){
						v=c(v,i)
		}	
	}
	seed=seed[-v,]
}


n_test = round(nrow(seed)/(view/bin)*split_p)
n_valid=  round(nrow(seed)/(view/bin)*split_p)





test_seed=seed[sample(1:nrow(seed), n_test),]
write.table(test_seed,"test_seed",sep="\t",row.names=F,col.names=F, quote=F)

v=c()
for(i in 1:nrow(seed)){
		if (any(seed[i,1] == test_seed[,1] &  seed[i,3] > test_seed[,2]  &  seed[i,2] < test_seed[,3])){
					v=c(v,i)
	}	
}

seed=seed[-v,]
valid_seed=seed[sample(1:nrow(seed), n_valid),]
write.table(valid_seed,"valid_seed",sep="\t",row.names=F,col.names=F, quote=F)

