`%+%` <- function(a, b) paste(a, b, sep="")
library(covNormRpkg)

scale_input <- function(df_vec)
{
	df_vec = log(df_vec)
	df_vec[is.infinite(df_vec)] = 0
	df_vec = (df_vec - mean(df_vec))/sd(df_vec)

	return(df_vec)
}

args <- commandArgs(TRUE)
file_path=args[1]
file_5kb_path=args[2]

file_name <- basename(file_path)
dir_path  <- dirname(file_path)
samplename <- unlist(strsplit(file_name, '\\.'))[1]
chrname    <- unlist(strsplit(file_name, '\\.'))[2]
outfilename <- dir_path %+% '/' %+% paste(samplename, chrname, '5kbcovnorm.gz', sep='.')

raw_data <- read.table(gzfile(file_path),head=TRUE)
raw_data_filter <- filterInputDF(raw_data, check_trans_values=FALSE)

max_line = 50000000 
row_num = nrow(raw_data_filter)
ds_ratio = -1
if(row_num > max_line){ds_ratio = max_line/row_num}

cov_result <- normCoverage(raw_data_filter, sample_ratio=ds_ratio)
intercept <- cov_result$intercept
coeff1 <- cov_result$coeff_cov1
coeff2 <- cov_result$coeff_cov2
param = c(intercept, coeff1, coeff2)
#write.table(param, file='outfilename',row.names=FALSE,col.names=TRUE,sep="\t",quote=F)

raw_5kb_data <- read.table(gzfile(file_5kb_path),head=TRUE)
raw_5kb_data <- filterInputDF(raw_5kb_data, check_trans_values=FALSE)

u_vec = raw_5kb_data$freq
capture_vec1=scale_input(raw_5kb_data$cov_frag1)
capture_vec2=scale_input(raw_5kb_data$cov_frag2)
exp_value_capture=round(exp(intercept + coeff1*capture_vec1 + coeff2*capture_vec2),4)
capture_res=round((u_vec)/(exp_value_capture), 4)
capture_res[is.infinite(capture_res)] = 50

rand <- seq(1:length(capture_res))
covnorm_5kb_df <- cbind(raw_5kb_data, rand, exp_value_capture, capture_res)
write.table(covnorm_5kb_df, file=gzfile(outfilename), row.names=FALSE, col.names=TRUE, sep="\t", quote=FALSE)
