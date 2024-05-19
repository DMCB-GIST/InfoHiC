#!/bin/bash

if [[ ! -s breast_model ]];then
	wget https://zenodo.org/records/10544099/files/breast_model.tar.gz
	tar -xvf breast_model.tar.gz
fi

if [[ ! -s breast_model_1Mb ]];then
	wget https://zenodo.org/records/11201552/files/breast_model_1Mb.tar.gz
	tar -xvf breast_model_1Mb.tar.gz

fi


if [[ ! -s brain_model ]];then
	wget https://zenodo.org/records/10544099/files/brain_model.tar.gz
	tar -xvf brain_model.tar.gz
fi

if [[ ! -s brain_model_1Mb ]];then
	wget https://zenodo.org/records/11201557/files/brain_model_1Mb.tar.gz
	tar -xvf brain_model_1Mb.tar.gz
fi
