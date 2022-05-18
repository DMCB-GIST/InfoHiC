path=scan("euler_paths.0.format", what="character", sep="\n")
library("plyr")
co=count(path)


co$contigs=paste("contigs",seq(1,nrow(co)),sep="");

co$types="NA"
co[,1]=as.character(co[,1])

for( i in 1:nrow(co)){
	co$types[i]= strsplit(as.character(co[i,1]),"\t")[[1]][1]
	co[i,1]=paste(strsplit(as.character(co[i,1]),"\t")[[1]][2:length(strsplit(as.character(co[i,1]),"\t")[[1]])],collapse="\t")

}

co=co[,c(3,4,2,1)]
co[,4]=as.character(co[,4])

for(i in 1:nrow(co)){
	for(j in 1:ncol(co)){
		if(j!=ncol(co)){
			cat(co[i,j])
		        cat("\t")
		}else{
			cat(co[i,j])
		}
	}
	cat("\n")

	
}
