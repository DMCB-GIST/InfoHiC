args=commandArgs(T)
options(scipen = 999)
library(tidyverse)
library(cowplot)
library(RColorBrewer)
wd=args[5]
hic_shift=args[6]
source(paste(wd, "/functions_for_deepC_rc.R",sep=""))
source(paste(wd, "/functions_for_HiC.R", sep=""))
sample="sample"
bin.size <- as.numeric(args[3])
window.size <- as.numeric(args[4])
prediction.bins <- window.size/bin.size 
genome.sizes <- read.table('ref_chrom_sizes.X.txt')  

chr=args[1]
rc=args[2]

if(hic_shift=="T"){
	matrix_prefix="chr_matrix_shift/"
}else{
	matrix_prefix="chr_matrix/"
}

if(hic_shift=="T"){
	matrix_output_prefix="chr_matrix_format_rc_shift/"
}else{
	matrix_output_prefix="chr_matrix_format_rc/"
}



	chrom <- paste("chr",chr,sep="")
	chrom.size <- as.numeric(genome.sizes[genome.sizes[,1] == chrom,2])
	matrix.norm.loc <- paste(matrix_prefix,chr,".matrix",sep="")
	hic <- ImportHicproMatrix(matrix.norm.loc, chr=chrom, bin.size=bin.size)
	hic <- trimHicRange(hic, range = window.size + bin.size)



	start.pos <- hic$start.pos - bin.size/2
	binned.genome <- getBinnedChrom(chr=chrom, start=start.pos, end=chrom.size, window=window.size, step=bin.size)

	binned.genome <- as.tibble(binned.genome)
	names(binned.genome) <- c("chr", "start", "end")

	binned.genome <- binned.genome %>%
	  mutate(width = end - start) %>%
	  filter(width == window.size) %>%
	  select(-width)

	tdf <- getZigZagWindowInteractionsPerl(hic, 
		 binned.genome, 
		 window.size, 
		 bin.size,
		 rc,
		 query.pl= paste(wd, "/match_query_table.pl", sep=""))

	tdf$sum <- apply(tdf, 1, function(x){
	  m <- sum(as.numeric(x[c(4:length(x))]))
	  return(m)
	})

	fdf <- tdf
	fdf <- tdf[tdf$sum > 0,]
#	idf <- medianImputeZerosDataFrame(fdf, k=5)
#	idf <- idf[,-ncol(idf)]  #remove padded
	idf <- fdf[, -ncol(fdf)]
	idf <- as.tibble(idf)

#	bdf <- pyramidBin(idf)
	bdf <- idf

	 bdf$class <- bdf %>%
	    select(-chr, -start, -end) %>%
	    unite(col = class, sep = ",") %>%
	    pull()
	bdf <- bdf %>% select(chr, start, end, class)
	bdf=bdf[bdf$end < chrom.size,]
	if(rc=="F"){
		write.table(bdf, file = paste0(matrix_output_prefix,bin.size/1000,"kb_", chrom,".bed.f"),
			      col.names = F, row.names = F, quote = F, sep = "\t")
	}else{
                write.table(bdf, file = paste0(matrix_output_prefix,bin.size/1000,"kb_", chrom,".bed.rc"),
			                                  col.names = F, row.names = F, quote = F, sep = "\t")
	}
