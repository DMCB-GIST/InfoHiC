args=commandArgs(T)
library(RColorBrewer)

mode=args[1]
options(scipen=999)
gap_view=T
M_plot_gap=1000000
max_depth=as.numeric(args[2])

if(mode=="test"){
	t=read.table("0.output.format")
}else{

	p=read.table("0.output.format",stringsAsFactors=F)
	cantor_pairing<-function(a,b){
		a=a/40000;
		b=b/40000;
		return(0.5*(a+b)*(a+b+1)+b);
	}
 	chr_n1=substring(p[,1],4);
	chr_n1[chr_n1=="X"]=23
        chr_n2=substring(p[,3],4);
        chr_n2[chr_n2=="X"]=23
	p$V6=cantor_pairing(p[,2]+as.numeric(chr_n1),p[,4]+as.numeric(chr_n2))
#	p$V6=cantor_pairing(p[,2], as.numeric(chr_n1))
#	p$V7=cantor_pairing(p[,4], as.numeric(chr_n2))

	#t=read.table("tmp/40kb_chr10.bed.format.format")
	t=read.table("./true.matrix",stringsAsFactors=F)

        chr_n1=substring(t[,1],4);
        chr_n1[chr_n1=="X"]=23
        chr_n2=substring(t[,3],4);
	chr_n2[chr_n2=="X"]=23

	w1=which(as.numeric(chr_n1) >as.numeric(chr_n2))
	if(length(w1)>0){
		tmp=t[w1,1];
		t[w1,1]=t[w1,3];
		t[w1,3]=tmp;
	       tmp=t[w1,2];
		t[w1,2]=t[w1,4];
		t[w1,4]=tmp;
	}
	w2=which(t[,1]  == t[,3] & t[,2] > t[,4])
	if(length(w2)>0){
	       tmp=t[w2,2];
		t[w2,2]=t[w2,4];
		t[w2,4]=tmp;
	}

	t$V6=cantor_pairing(t[,2]+as.numeric(chr_n1),t[,4]+as.numeric(chr_n2))
	t=t[t$V6 %in% p$V6,]

#	t$V6=cantor_pairing(t[,2], as.numeric(chr_n1))
#	t$V7=cantor_pairing(t[,4], as.numeric(chr_n2))
#	t=t[t$V6 %in% c(p$V6,p$V7) & t$V7 %in% c(p$V6,p$V7),]
	write.table(t[,1:5],"./true.matrix.all.format",quote=F,sep="\t",row.names=F,col.names=F)


	if(mode=="all"){
		t=t[,1:5]
		t$tag="true"
		pt=read.table("0.output.format")
#		tmp=pt[,1]
#		pt[,1]=pt[,3]
#		pt[,3]=tmp
#		tmp=pt[,2]
#		pt[,2]=pt[,4]
#		pt[,4]=tmp
		pt$tag="test"
		t=rbind(t,pt)
	}
}

library("reshape2")
library("ggplot2")
pdf(paste(mode,".pdf",sep=""))
r=read.table("ref.ref_window",stringsAsFactors=F)
sv=read.table("ref.sv_window",stringsAsFactors=F)


r$gap=0
r$gap[1] =r[1,2] - M_plot_gap
if(nrow(r)>1){
	for(i in 2:nrow(r)){
		if(r[i,1] == r[i-1,1]){
			if(abs(r[i-1,3] - r[i,2]) > M_plot_gap ){
				r[i,"gap"] =r[i-1,"gap"]+40000* ((abs(r[i-1,3] - r[i,2]) - M_plot_gap )%/% 40000)

			}else{
				r[i,"gap"]=r[i-1,"gap"]
			}
		}else{
			lr=r[1:(i-1),]
#			r[i,"gap"]=r[i,2]-(sum(lr[,3]-lr[,2])+nrow(lr)*M_plot_gap)+M_plot_gap;
			r[i,"gap"]=r[i,2]-(sum(lr[,3]-lr[,2])+nrow(lr)*M_plot_gap)-M_plot_gap;

		}
	}
}


v=c()
for( i in 1:nrow(r)){

		w1=t[,1]==t[,3] & t[,1]==r[i,1] & (t[,2]+t[,4])/2 >=r[i,2] & (t[,2]+t[,4])/2 <= r[i,3]
		if(any(w1)){
			v=c(v,which(w1))
		}
		if(mode=="test"){
			write.table(t[which(w1),], paste("./ref_window/ref_pred.",i,sep=""),quote=F, row.names=F, col.names=F, sep="\t")
		}else{
                        write.table(t[which(w1),], paste("./ref_window/ref_true.",i,sep=""),quote=F, row.names=F, col.names=F, sep="\t")
		}
}



for( i in 1:nrow(sv)){
	

		w2=t[,1] == sv[i,1] & t[,2] >= sv[i,2] & t[,2] <=sv[i,3]
		w3=t[,3] == sv[i,4] & t[,4] >=sv[i,5] & t[,4] <= sv[i,6]


		w4=t[,1] == sv[i,4] & t[,2] >= sv[i,5] & t[,2] <=sv[i,6]  
		w5=t[,3] == sv[i,1] & t[,4] >=sv[i,2] & t[,4] <= sv[i,3]

		if(  any(w2&w3)){
			v=c(v,which(w2&w3))
		}else if(any(w4&w5)){
                        v=c(v,which(w4&w5))
		}
		if(mode=="test"){
                        write.table(t[which((w2&w3)|(w4&w5)),], paste("./sv_window/sv_pred.",i,sep=""),quote=F, row.names=F, col.names=F, sep="\t")
		}else{
                        write.table(t[which((w2&w3)|(w4&w5)),], paste("./sv_window/sv_true.",i,sep=""),quote=F, row.names=F, col.names=F, sep="\t")
		}
}



t=t[v,];


if(gap_view){
	for( i in 1:nrow(t)){
		
		w0=t[i,1] == r[,1] & t[i,3]==r[,1] & t[i,1]==t[i,3] &(t[i,2]+t[i,4])/2 >= r[,2] & (t[i,2]+t[i,4])/2  <=r[,3]

		if(any(w0)){
			t[i,2]=t[i,2]-r[w0,"gap"]
			t[i,4]=t[i,4]-r[w0,"gap"]
		}else{
			w1=t[i,1] == r[,1] & t[i,2] >= r[,2] & t[i,2] <= r[,3]
			t[i,2]=t[i,2]-r[w1,"gap"]
			w2=t[i,3] == r[,1] & t[i,4] >= r[,2] & t[i,4] <= r[,3]
			t[i,4]=t[i,4]-r[w2,"gap"]
		}

	}
}

t[t[,5]<0,5]=0
t[t[,5]>max_depth,5]=max_depth

if(mode=="all"){
	w=which(t$tag=="true")
	tmp=t[w,1]
	t[w,1]=t[w,3]
	t[w,3]=tmp
	tmp=t[w,2]
	t[w,2]=t[w,4]
	t[w,4]=tmp
}


g=ggplot(data = t, aes(x=V2, y=V4, fill=V5)) +
          geom_tile(width=40000, height=40000) +  scale_fill_gradientn(colours=brewer.pal(9, 'YlOrRd')) + theme_bw() + theme(panel.border = element_blank(), panel.grid.major = element_blank(), 
                                                                                           panel.grid.minor = element_blank(), axis.line = element_line(colour = "black")) + coord_equal()


#g=g+theme(panel.background=element_rect(fill=brewer.pal(9, 'YlOrRd')[1]))
g
dev.off()
