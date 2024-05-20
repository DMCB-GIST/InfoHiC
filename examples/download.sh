#!/bin/bash

if [[ ! -s T47D_chromosomes_8_14 ]];then
	wget -N https://zenodo.org/records/11212634/files/T47D_chromosomes_8_14.tar.gz
	tar -xvf T47D_chromosomes_8_14.tar.gz
fi

if [[ ! -s T47D_hic_reads_subset ]];then
	wget -N https://zenodo.org/records/11218397/files/T47D_hic_reads_subset.tar.gz
	tar -xvf T47D_hic_reads_subset.tar.gz
fi
