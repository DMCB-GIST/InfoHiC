`%+%` <- function(a, b) paste(a, b, sep="")
library(plyr)
library(stringr)

args <- commandArgs(TRUE)
file_path=args[1]

file_name <- basename(file_path)
dir_path  <- dirname(file_path)
samplename <- unlist(strsplit(file_name, '\\.'))[1]
chrname    <- unlist(strsplit(file_name, '\\.'))[2]
outfilename <- dir_path %+% '/' %+% paste(samplename, chrname, 'covnorm.500kb.gz', sep='.')

df <- read.table(gzfile(file_path),header=TRUE)

fs1 <- str_split_fixed(df$frag1,"\\.",3)
fs2 <- str_split_fixed(df$frag2,"\\.",3)

new_id <- paste(fs1[,1], as.integer(as.numeric(fs1[,2])/500000), fs2[,1], as.integer(as.numeric(fs2[,2])/500000), sep=".") 
freq2 <- df$capture_res

df2 <- data.frame(new_id,freq2)

df3<-ddply(df2,.(new_id),summarize,sum=sum(freq2))

splitid <-str_split_fixed(df3$new_id,"\\.",4)

bin1 <-splitid[,2]
bin2 <-splitid[,4]
chr1 <-splitid[,1]
chr2 <-splitid[,3]
intensity <- df3$sum

df4 <- data.frame(bin1, bin2, chr1, chr2, intensity)

write.table(df4, file=gzfile(outfilename), row.names=FALSE, col.names=TRUE, sep="\t", quote=FALSE)


