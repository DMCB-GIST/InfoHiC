`%+%` <- function(a, b) paste(a, b, sep="")
library(covNormRpkg)

args <- commandArgs(TRUE)
file_path=args[1]

file_name <- basename(file_path)
dir_path  <- dirname(file_path)
samplename <- unlist(strsplit(file_name, '\\.'))[1]
chrname    <- unlist(strsplit(file_name, '\\.'))[2]
outfilename <- dir_path %+% '/' %+% paste(samplename, chrname, 'distnorm.gz', sep='.')
outpdfname <-  dir_path %+% '/' %+% paste(samplename, chrname, 'fitdistr.pdf', sep='.')

df <- read.table(gzfile(file_path),head=TRUE)
df <- df[which(df$dist > 15000 & df$dist < 2100000),]

max_line = 50000000 
row_num = nrow(df)
ds_ratio = -1
if(row_num > max_line){ds_ratio = max_line/row_num}

cov_result <- normCoverage(df, sample_ratio=ds_ratio)
cov_result$intercept
cov_result$coeff_cov1
cov_result$coeff_cov2
cov_df <- cov_result$result_df

dist_result <- normDistance(cov_df, max_dist=2000000, sample_ratio=ds_ratio)
dist_result$intercept
dist_result$coeff_dist
dist_df <- dist_result$result_df
final_df <- contactPval(dist_df, outpdfname)

#warnings()
write.table(final_df, file=gzfile(outfilename), row.names=FALSE, col.names=TRUE, sep="\t", quote=FALSE)
head(final_df)

