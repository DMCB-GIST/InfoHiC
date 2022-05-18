{
	a=$2+960000;
	b=$2+1000000;

	f_i=4;
	print a"\t"b"\t"$f_i;


	f_i=5;
	j=1;
	for(i=1;i<25;i++){
		s=a-(j)*40000;
		e=b+(j-1)*40000;
		print s"\t"e"\t"$f_i;
		f_i=f_i+1;
		s=a-(j)*40000;
		e=b+(j)*40000;
		print s"\t"e"\t"$f_i;
		f_i=f_i+1;
		j=j+1;
	}
}
