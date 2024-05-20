
`%+%` <- function(a, b) paste(a, b, sep="")
library(stringr)

args <- commandArgs(TRUE)
file_path=args[1]
#avg_mean = as.numeric(args[2])
#avg_std  = as.numeric(args[3])

file_name <- basename(file_path)
dir_path  <- dirname(file_path)
samplename <- unlist(strsplit(file_name, '\\.'))[1]
chrname    <- unlist(strsplit(file_name, '\\.'))[2]
outfilename <- dir_path %+% '/' %+% paste(samplename, chrname, 'distnorm.scale2.gz', sep='.')

df <- read.table(gzfile(file_path),head=TRUE)

sample_mean = mean(df$capture_res) 
sample_std  = sd(df$capture_res)

new_res = (df$capture_res - sample_mean)/sample_std
new_res = (new_res * avg_std) + avg_mean
#new_res = df$capture_res

chr  <- str_split_fixed(df$frag1 , "\\.", 3)[,1]
bin1 <- str_split_fixed(df$frag1 , "\\.", 3)[,2]
bin2 <- str_split_fixed(df$frag2 , "\\.", 3)[,2]
RawCount <- df$freq
CapturabilityOne <- df$cov_frag1
CapturabilityTwo <- df$cov_frag2
Distance <- df$dist
all_exp <- df$exp_value_capture
all_capture_res <- df$capture_res
exp_value_dist <- df$exp_value_dist
dist_foldchange <- df$dist_res
rescaled_intensity <- new_res
idx <- seq(1:nrow(df))
p_value <- -log10(df$p_result_dist)

outdf <- cbind(idx, chr, bin1, bin2, RawCount, RawCount, CapturabilityOne, CapturabilityTwo, Distance, all_exp, all_capture_res, exp_value_dist, dist_foldchange, rescaled_intensity, p_value)

write.table(outdf, file=gzfile(outfilename), row.names=FALSE, col.names=TRUE, sep="\t", quote=FALSE)


