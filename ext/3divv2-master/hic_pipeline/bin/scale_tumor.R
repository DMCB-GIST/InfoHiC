
`%+%` <- function(a, b) paste(a, b, sep="")

args <- commandArgs(TRUE)
file_path=args[1]
avg_mean = as.numeric(args[2])
avg_std  = as.numeric(args[3])

file_name <- basename(file_path)
dir_path  <- dirname(file_path)
samplename <- unlist(strsplit(file_name, '\\.'))[1]
chrname    <- unlist(strsplit(file_name, '\\.'))[2]
outfilename <- dir_path %+% '/' %+% paste(samplename, chrname, 'covnorm.scale.gz', sep='.')

df <- read.table(gzfile(file_path),head=TRUE)

sample_mean = mean(df$capture_res) 
sample_std  = sd(df$capture_res)

new_res = (df$capture_res - sample_mean)/sample_std
new_res = (new_res * avg_std) + avg_mean

df$capture_res <- new_res
write.table(df, file=gzfile(outfilename), row.names=FALSE, col.names=TRUE, sep="\t", quote=FALSE)


