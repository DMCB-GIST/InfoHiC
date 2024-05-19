# InfoHiC
- InfoHiC is a method to predict 3D genome folding from complex DNA rearrangements, which enables the training and validation usage of cancer Hi-C data. InfoHiC provides a decomposed level of interaction views of multiple contigs from the cancer Hi-C matrix. InfoHiC is composed of convolutional neural network (CNNs) that outputs chromatin interactions of genomic contigs and merges them in the total Hi-C views, based on a haplotype-specific copy number (HSCN) encoding that represent genomic variants in the contig matrix.

<p align="center">
    <img width="1500" src="https://github.com/DMCB-GIST/InfoHiC/blob/main/doc/overview.png">
  </a>
</p>


# Cancer Hi-C prediction models
- Brain
    - [NPC 1Mb CSCN decoding 40kb](https://zenodo.org/records/11201557/files/brain_model_1Mb.tar.gz)
    - [NPC 2Mb CSCN decoding 40kb](https://zenodo.org/records/10544099/files/brain_model.tar.gz)
- Breast
    - [T47D 1Mb CSCN encoding 40kb](https://zenodo.org/records/11201552/files/breast_model_1Mb.tar.gz)
    - [T47D 2Mb CSCN encoding 40kb](https://zenodo.org/records/10544099/files/breast_model.tar.gz)

- Hematopoietic
    - [K562 1Mb CSCN encoding 10kb](https://zenodo.org/records/11201627/files/Hematopoietic_model_1Mb.tar.gz)

# Snakemake install
```
wget https://github.com/conda-forge/miniforge/releases/download/24.1.2-0/Miniforge3-Linux-x86_64.sh
bash Miniforge3-Linux-x86_64.sh
mamba create -c conda-forge -c bioconda -n snakemake snakemake
conda config --set channel_priority strict
conda activate snakemake
```

# dataset download
```
snakemake --cores all --use-conda InfoHiC_download
```
# conda environment setting
```
snakemake --core all --use-conda hic_mapping_env
snakemake --core all --use-conda InfoHiC_env
```

# Running InfoHiC prediction
The InfoHiC workflow is run by the snakemake.
## Starting from InfoGenomeR output
### Inputs
- InfoHiC trained model
- InfoGenomeR output from WGS (https://github.com/dmcblab/InfoGenomeR)
### Workflow
```
# go to InfoHiC directory
cd InfoHiC

# make the root output directory
root_dir=InfoHiC_prediction_output
mkdir ${root_dir}

# after InfoHiC_download, place the reference and the InfoHiC model into the root directory
ln -s ${PWD}/models/breast_model ${root_dir}/model
ln -s ${PWD}/humandb/ref ${root_dir}/ref

# take the InfoGenomeR output example
cp -r examples/T47D_chromosomes_8_14/InfoGenomeR_output ${root_dir}/InfoGenomeR_output

# set wildcards 
resolution=40000
window=2000000
cancer_type=BRCA
model=CSCN_encoding
gpu=1 # use the available gpu

# run the InfoHiC workflow
snakemake --cores all --use-conda InfoHiC_prediction_output/InfoHiC_prediction/hic_${resolution}.window_${window}.${cancer_type}.${model}.gpu${gpu}

# run the post process
snakemake --cores all --use-conda InfoHiC_prediction_output/InfoHiC_prediction/hic_${resolution}.window_${window}.${cancer_type}.${model}.gpu${gpu}.post_process


```
