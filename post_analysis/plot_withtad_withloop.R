#library(ggforce)
library(RColorBrewer)
library(grid)

args=commandArgs(T)
pdf(paste(args[1],".pdf",sep=""))
options(scipen=999)
gap_view=F
M_plot_gap=1000000
max_depth=as.numeric(args[2])

t=read.table(args[1])
library("reshape2")
library("ggplot2")

contig_name=t[1,1];
t=t[,c(2,4,5)]
names(t)=c("V1","V2","V3")
t[t[,3]<0,3]=0
#t[t[,4]<0,4]=0

t[t[,3]>max_depth,3]=max_depth
#t[t[,4]>max_depth,4]=max_depth


if(args[5]!="null" && file.exists(args[5]) && file.info(args[5])$size != 0){

	e=read.table(args[5],stringsAsFactors=F)
	le=e[e[,3] == contig_name,]
	if(args[4]!="null" && file.exists(args[4]) &&  file.info(args[4])$size != 0){
	        fus=read.table(args[4],stringsAsFactors=F)
		fus=fus[fus[,1]==contig_name,]
		v=c()
		for(i in 1:nrow(fus)){
			w=which(le[,5]<fus[i,2] & fus[i,2]<le[,6]);
			v=c(v,w);
		}
		if(length(v)>0){
			v=unique(v)
			le=le[-v,]
		}
	}


	if(nrow(le)>0){
		le_line=data.frame()
		for(j in 1:nrow(le)){
			le_line[j,1]=le[j,3]
			le_line[j,2]=le[j,5] + 100000
			le_line[j,3]=le[j,5] - 100000
			le_line[j,4]=le[j,6] + 100000
			le_line[j,5]=le[j,6] - 100000
			le_line[j,6]=le[j,13]
		}
	}


}
if(args[6]!="null" && file.exists(args[6]) && file.info(args[6])$size != 0){

	h=read.table(args[6],stringsAsFactors=F)
	lh=h[h[,3] == contig_name,]
	if(nrow(lh)>0){
		lh_line=data.frame()
		for(j in 1:nrow(lh)){
			lh_line[j,1]=lh[j,3]
			lh_line[j,2]=lh[j,5] + 200000
			lh_line[j,3]=lh[j,5] - 200000
			lh_line[j,4]=lh[j,6] + 200000
			lh_line[j,5]=lh[j,6] - 200000
			lh_line[j,6]=lh[j,2]
		}
	}



}

if(args[7]!="null" && file.exists(args[7]) && file.info(args[7])$size != 0){
	te=read.table(args[7],stringsAsFactors=F)
	lte=te[te[,3] == contig_name,]
	if(nrow(lte)>0){
		lte_line=data.frame()
		for(j in 1:nrow(lte)){
			lte_line[j,1]=lte[j,3]
			lte_line[j,2]=lte[j,5] + 300000
			lte_line[j,3]=lte[j,5] - 300000
			lte_line[j,4]=lte[j,6] + 300000
			lte_line[j,5]=lte[j,6] - 300000
			lte_line[j,6]=lte[j,2]
		}
	}
}




if(args[3]!="null" && file.exists(args[3]) && file.info(args[3])$size != 0){
	td=read.table(args[3],stringsAsFactors=F)
	td=td[order(td[,4],decreasing=T),]
	td_line=data.frame()
	i=1;
	for(j in 1:nrow(td)){
		td_line[i,1]=td[j,1];
		td_line[i,2]=td[j,2];
		td_line[i,3]=td[j,2];
		td_line[i,4]=td[j,2];
		td_line[i,5]=td[j,3];
		td_line[i,6]=td[j,4];
		td_line[i+1,1]=td[j,1];
		td_line[i+1,2]=td[j,2];
		td_line[i+1,3]=td[j,3];
		td_line[i+1,4]=td[j,3];
		td_line[i+1,5]=td[j,3];
		td_line[i+1,6]=td[j,4];
		i=i+2;

	}
}

#g=ggplot(data = t, aes(x=V2, y=V4, fill=V5)) +
#          geom_tile(width=40000, height=40000) + scale_fill_gradient2(low="white", high="red") +theme_bw() + theme(panel.border = element_blank(), panel.grid.major = element_blank(),
#                                                                                           panel.grid.minor = element_blank(), axis.line = element_line(colour = "black")) + coord_equal()



#g=g+geom_segment(aes(x=V2, y=V3, xend=V4, yend=V5, colour="cyan"),data=td_line)


g=ggplot(data = t, aes(x=V1, y=V2, fill=V3)) + geom_tile(width=40000, height=40000) + scale_fill_gradientn(colours=brewer.pal(9, 'YlOrRd')) +theme_bw() +theme(panel.border = element_blank(), panel.grid.major = element_blank(),panel.grid.minor = element_blank(), axis.line = element_line(colour = "black")) + coord_equal()


if(args[3]!="null" && file.exists(args[3]) && file.info(args[3])$size != 0){

	g=g+geom_segment(aes(x=V2, y=V3, xend=V4, yend=V5, colour=V6),data=td_line, inherit.aes=F,size=0.1)
#	g=g+geom_text(aes(x=V2, y=V3, label=V2), data=td_line, inherit.aes=F, angle=45, size=0.2)

}


if(args[8]!="null"){
	if(args[8]!="all"){
		le_line_gene=le_line[le_line[,6] == args[8],]
		le_line_gene[,2] = le_line_gene[,2] + 400000
		le_line_gene[,3] = le_line_gene[,3] - 400000
		g=g+geom_text(aes(x=V2, y=V3, label=V6), data=le_line_gene, inherit.aes=F,angle=-45,size=0.2)
		sub_le_line=le_line[le_line[,6]==args[8],];
		if(args[5]!="null"){
			g=g+geom_segment(aes(x=V2, y=V3, xend=V4, yend=V5),data=sub_le_line, inherit.aes=F, color="black")
		}

	}else{
                le_line_gene=le_line
		le_line_gene[,2] = le_line_gene[,2] + 400000
		le_line_gene[,3] = le_line_gene[,3] - 400000
		g=g+geom_text(aes(x=V2, y=V3, label=V6), data=le_line_gene, inherit.aes=F,angle=-45,size=0.2)
		if(args[5]!="null"){
			g=g+geom_segment(aes(x=V2, y=V3, xend=V4, yend=V5),data=le_line, inherit.aes=F, color="black")
		}

	}
}
if(args[6]!="null" && file.exists(args[6]) && file.info(args[6])$size != 0){

	g=g+geom_segment(aes(x=V2, y=V3, xend=V4, yend=V5),data=lh_line, inherit.aes=F, color="yellow")
}
if(args[7]!="null" && file.exists(args[7]) && file.info(args[7])$size != 0){

	g=g+geom_segment(aes(x=V2, y=V3, xend=V4, yend=V5),data=lte_line, inherit.aes=F, color="yellow")
}



if(args[4]!="null" && file.exists(args[4]) &&  file.info(args[4])$size != 0){
	fus=read.table(args[4],stringsAsFactors=F)

	fus_line=data.frame()
	fli=1
	for(fusi in 1:nrow(fus)){
#		coor= (fus[fusi,2] %/% 40000) * 40000
		coor= fus[fusi,2]
		fus_line[fli,1]=coor
		fus_line[fli,2]=coor
		fus_line[fli,3]=coor-2000000
		fus_line[fli,4]=coor
		fli=fli+1
	        fus_line[fli,1]=coor
	        fus_line[fli,2]=coor
	        fus_line[fli,3]=coor
	        fus_line[fli,4]=coor+2000000
		fli=fli+1
	}

	g=g+geom_segment(aes(x=V1, y=V2, xend=V3, yend=V4), data=fus_line, inherit.aes=F,color="white",size=0.1)
#	g=g+geom_text(aes(x=V1, y=V2, label=V1), data=fus_line, inherit.aes=F, angle=45, size=0.2)
}

if(args[9]!="null" && file.exists(args[9]) &&  file.info(args[9])$size != 0){
	library("ggforce")
	loop=read.table(args[9],stringsAsFactors=F)
	loop$V3=40000
	g=g+geom_circle(aes(x0=V1, y0=V2, r=V3),color='blue', data= loop,inherit.aes=F)
}
g
dev.off()
