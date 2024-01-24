options(scipen=999)
window_size=2000000


args=commandArgs(T)

ws=as.numeric(args[2])
library(SpectralTAD)
library("dplyr")
t=read.table(args[1],stringsAsFactors=F)
t=t[,c(2,4,5)]
err=0;
tryCatch({
	tads=SpectralTAD(t,chr=t[1,1], levels = 3, qual_filter = FALSE, window_size=ws)
	}, error=function(e){err=1});

if(err==0 && exists("tads")){
	mn= min(c(t[,1],t[,2])) + window_size/2
	mx=max(c(t[,1],t[,2])) - window_size/2

	m_tads=bind_rows(tads)
	m_tads=m_tads[m_tads$start >= mn & m_tads$end <=mx,]

	write.table(m_tads,paste(args[1],".tad",sep=""),quote=F,sep="\t",row.names=F, col.names=F)
}
