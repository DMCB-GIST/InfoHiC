`%+%` <- function(a, b) paste(a, b, sep="")
library(covNormRpkg)

args <- commandArgs(TRUE)
file_path=args[1]

file_name <- basename(file_path)
dir_path  <- dirname(file_path)
samplename <- unlist(strsplit(file_name, '\\.'))[1]
chrname    <- unlist(strsplit(file_name, '\\.'))[2]
outfilename <- dir_path %+% '/' %+% paste(samplename, chrname, 'covnorm.gz', sep='.')

raw_data <- read.table(gzfile(file_path),head=TRUE)
raw_data_filter <- filterInputDF(raw_data, check_trans_values=FALSE)
raw_data_filter <- raw_data_filter[which(raw_data_filter$freq > 1),]

max_line = 50000000 
row_num = nrow(raw_data_filter)
ds_ratio = -1
if(row_num > max_line){ds_ratio = max_line/row_num}

cov_result <- normCoverage(raw_data_filter, sample_ratio=ds_ratio, do_shuffle=FALSE)
cov_result$intercept
cov_result$coeff_cov1
cov_result$coeff_cov2
cov_df <- cov_result$result_df

write.table(cov_df, file=gzfile(outfilename), row.names=FALSE, col.names=TRUE, sep="\t", quote=FALSE)
