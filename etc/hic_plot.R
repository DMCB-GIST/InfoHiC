args=commandArgs(T)
library(RColorBrewer)
res=as.numeric(args[3])
symetric=T
t=read.table(args[1])

if(symetric){
	        lower_diagonal=t
        tmp=lower_diagonal[,1]
	        lower_diagonal[,1]=lower_diagonal[,2]
	        lower_diagonal[,2]=tmp;
		        t=rbind(t,lower_diagonal)
}


#t=read.table("T47D.chr10.covnorm.format")
library("reshape2")
library("ggplot2")
t[t[,3]<0,3]=0
t[t[,3]>as.numeric(args[2]),3]=as.numeric(args[2])

#g=ggplot(data = t, aes(x=V1, y=V2, fill=V3)) +
#	geom_tile() + scale_fill_gradient2(low="white", high="red") + theme_bw() + theme(panel.border = element_blank(), panel.grid.major = element_blank(),
#	panel.grid.minor = element_blank(), axis.line = element_line(colour = "black")) + coord_equal()



g=ggplot(data = t, aes(x=V1, y=V2, fill=V3)) +
	 geom_tile(width=res, height=res) + scale_fill_gradientn(colours=brewer.pal(9, 'YlOrRd')) + theme_bw() + theme(panel.border = element_blank(), panel.grid.major = element_blank(),
	panel.grid.minor = element_blank(), axis.line = element_line(colour = "black")) + coord_equal()
#g=g+scale_x_continuous(breaks = seq(75960000, 79960000, by = 40000))

#g=g+scale_y_continuous(breaks = seq(75960000, 79960000, by= 40000))

g
dev.off()
