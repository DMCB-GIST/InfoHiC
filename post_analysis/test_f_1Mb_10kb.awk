{
	a=$2+500000;
	b=$2+510000;

	f_i=4;
	print a"\t"b"\t"$f_i;


	f_i=5;
	j=1;
	for(i=1;i<51;i++){
		s=a-(j)*10000;
		e=b+(j-1)*10000;
		print s"\t"e"\t"$f_i;
		f_i=f_i+1;
		s=a-(j)*10000;
		e=b+(j)*10000;
		print s"\t"e"\t"$f_i;
		f_i=f_i+1;
		j=j+1;
	}
}
