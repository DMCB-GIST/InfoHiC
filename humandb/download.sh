#!/bin/bash
if [[ ! -s ref ]];then
	wget -N https://zenodo.org/records/11201483/files/ref.tar.gz
	tar -xvf ref.tar.gz
fi

