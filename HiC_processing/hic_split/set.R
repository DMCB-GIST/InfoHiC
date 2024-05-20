args=commandArgs(T)

options(scipen=999)

view=as.numeric(args[1])
window=as.numeric(args[2])
resolution=as.numeric(args[3])
chrom_size=args[4]
t=read.table(chrom_size,stringsAsFactors=F)

set_chr=c()
set_coor1=c()
set_coor2=c()
for(i in 1:nrow(t)){
	a_seed=seq(window, t[i,2]-window*2, by=resolution)
	set_chr=c(set_chr, rep(t[i,1], length(a_seed)))
	set_coor1=c(set_coor1, a_seed)
	set_coor2=c(set_coor2, a_seed+window)

}
set=data.frame(chr=set_chr, coor1=set_coor1, coor2=set_coor2, stringsAsFactors=F)

set=set[sample(nrow(set),nrow(set)),]








nname=c("sv_set","test_set","valid_set");
ni=1
for( name in c("sv_seed", "test_seed", "valid_seed")){
	if(!file.exists(name)){
		ni=ni+1;
		next;
	}
	tmp_seed=read.table(name,stringsAsFactors=F)
	tmp_set_chr=c()
	tmp_set_coor1=c()
	tmp_set_coor2=c()
	for(i in 1:nrow(tmp_seed)){
		a_seed=seq(max(0,tmp_seed[i,2]- ceiling(window/resolution/2)*resolution), min(t[t[,1]==tmp_seed[i,1],2],tmp_seed[i,3] - floor(window/resolution/2)*resolution), by=resolution)
		tmp_set_chr=c(tmp_set_chr,rep(tmp_seed[i,1],length(a_seed)))
		tmp_set_coor1=c(tmp_set_coor1,a_seed);
		tmp_set_coor2=c(tmp_set_coor2,a_seed+window);

	}
	tmp_set=data.frame(chr=tmp_set_chr, coor1=tmp_set_coor1, coor2=tmp_set_coor2, stringsAsFactors=F)


	m=merge(set, tmp_set, by=c("chr","coor1"),all.x=T);
	names(m)[1:3]=c("chr","coor1","coor2")
	set=m[is.na(m$coor2.y),1:3]
	tmp_set=m[!is.na(m$coor2.y),1:3]

	write.table(tmp_set, nname[ni], sep="\t",row.names=F,col.names=F, quote=F)
	ni=ni+1;
}

write.table(set, "train_set",sep="\t",row.names=F,col.names=F, quote=F)

