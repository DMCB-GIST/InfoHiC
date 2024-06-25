# InfoHiC
- InfoHiC is a method to predict 3D genome folding from complex DNA rearrangements, which enables the training and validation usage of cancer Hi-C data. InfoHiC provides a decomposed level of interaction views of multiple contigs from the cancer Hi-C matrix. InfoHiC is composed of convolutional neural network (CNNs) that outputs chromatin interactions of genomic contigs and merges them in the total Hi-C views, based on a contig-specific copy number (CSCN) encoding that represent genomic variants in the contig matrix.

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
- The InfoHiC workflow is run by the snakemake.
- Environments are described in workflow/envs.
- Rules are described in workflow/Snakefile.
```
wget https://github.com/conda-forge/miniforge/releases/download/24.1.2-0/Miniforge3-Linux-x86_64.sh
bash Miniforge3-Linux-x86_64.sh
mamba create -c conda-forge -c bioconda -n snakemake snakemake
conda config --set channel_priority strict
conda activate snakemake
```
# InfoHiC repository
```
git clone https://github.com/DMCB-GIST/InfoHiC.git
InfoHiC_repo=${PWD}/InfoHiC
cd ${InfoHiC_repo}
```
After git clone, follow the steps below.
- [Conda environment setting](#conda-environment-setting)
- [Dataset download](#dataset-download)
- [InfoHiC prediction](#infohic-prediction)


# Conda environment setting
```
snakemake --core all --use-conda hic_mapping_env
snakemake --core all --use-conda InfoHiC_env
```
# Dataset download
```
snakemake --cores all --use-conda InfoHiC_download
```

# InfoHiC prediction
- Hi-C matrices are predicted using the InfoHiC model.
## Starting from WGS fastq
- If you already have InfoGenomeR output, go to [Starting from InfoGenomeR output](#starting-from-infogenomer-output)
- Else, test with low coverage WGS fastqs we provide first to obtain InfoGenomeR output. Then replace fastqs with yours.
- Details are here https://github.com/dmcblab/InfoGenomeR
### Inputs
The inputs should be structured like below
- InfoHiC trained model
```
model
├── contig_model.data-00000-of-00001
├── contig_model.index
└── contig_model.meta
```
- WGS fastqs
  - normal fastq files are optional for somatic mode
```
fastq
├── normal1.fq.gz
├── normal2.fq.gz
├── tumor1.fq.gz
└── tumor2.fq.gz
```
### workflow
#### InfoGenomeR workspace setting
```
cd $HOME

#InfoGenomeR repository
git clone https://github.com/dmcblab/InfoGenomeR.git
InfoGenomeR_repo=${PWD}/InfoGenomeR
cd ${InfoGenomeR_repo}

#environment setting
snakemake --core all --use-conda InfoGenomeR_env

#dataset download
snakemake --cores all --use-conda InfoGenomeR_download

#example dataset download
snakemake --core all --use-conda InfoGenomeR_example_download

# make a workspace directory
cd ${InfoGenomeR_repo}
workspace_dir=InfoGenomeR_workspace1
mkdir -p ${workspace_dir}

# link the reference in the workspace directory
ln -s ${PWD}/humandb/ref ${workspace_dir}/ref

# use low coverage examples data
ln -s ${PWD}/examples/fastq ${workspace_dir}/fastq
```
#### InfoGenomeR run
```
# Run the InfoGenomeR workflow. Select either somatic or total mode.
snakemake --core all --use-conda ${workspace_dir}/InfoGenomeR_output --config mode=somatic min_ploidy=2.5 max_ploidy=3.5

# This is InfoGenomeR output
InfoGenomeR_output=`readlink -f ${workspace_dir}/InfoGenomeR_output`
```
#### InfoHiC workspace setting
```
# go to the InfoHiC repo directory
cd ${InfoHiC_repo}

# make a workspace directory
workspace_dir=InfoHiC_workspace1
mkdir -p ${workspace_dir}

# Link the reference and the InfoHiC model in the workspace
ln -s ${PWD}/humandb/ref ${workspace_dir}/ref
ln -s ${PWD}/models/breast_model ${workspace_dir}/model

# take the InfoGenomeR output 
cp -r ${InfoGenomeR_output} ${workspace_dir}/InfoGenomeR_output
```
#### InfoHiC run
```
# set wildcards 
resolution=40000
window=2000000
cancer_type=BRCA
model=CSCN_encoding
gpu=1 # use the available gpu

# run the InfoHiC workflow
snakemake --cores all --use-conda ${workspace_dir}/InfoHiC_prediction/hic_${resolution}.window_${window}.${cancer_type}.${model}.gpu${gpu}

# run the post process
snakemake --cores all --use-conda ${workspace_dir}/InfoHiC_prediction/hic_${resolution}.window_${window}.${cancer_type}.${model}.gpu${gpu}.post_process

```
### Outputs
```
InfoHiC_workspace1/InfoHiC_prediction/hic_40000.window_2000000.BRCA.CSCN_encoding.gpu1.post_process
└── euler.8.14
    ├── contig1.30385446.43357567
    │   ├── contigs_ref_coor.tsv
    │   ├── contigs.tsv
    │   ├── ens_gene.bed
    │   ├── hic_iced_loop.bed
    │   ├── hic_iced.matrix
    │   ├── hic_iced.pdf
    │   ├── hic_iced_tad.bed
    │   ├── hic.matrix
    │   ├── hic.pdf
    │   ├── hic_tad.bed
    │   ├── super_enhancer.bed
    │   └── typical_enhancer.bed
    ├── contig2.58095296.66230780
    │   ├── contigs_ref_coor.tsv
    │   ├── contigs.tsv
    │   ├── ens_gene.bed
    │   ├── hic_iced_loop.bed
    │   ├── hic_iced.matrix
    │   ├── hic_iced.pdf
    │   ├── hic_iced_tad.bed
    │   ├── hic.matrix
    │   ├── hic.pdf
    │   ├── hic_tad.bed
    │   ├── super_enhancer.bed
    │   └── typical_enhancer.bed
    ......
```
- the post_process output folder contains chromosome sets where InfoHiC performed SV Hi-C prediction.
    - euler.8.14 indicates chromosomes 8 and 14
- Each euler directory contains SV contigs
    - contig2.58095296.66230780 indicates contig index, contig coordinate start, and contig coordinate end in a prediction window.
- Each contig folder contains predicted Hi-C information
    - contigs.tsv
        - full contig information of the contig 
        - contig index, breakpoint graph node index1, breakpoint graph node index2, ref chrom, ref pos, ref end, cumulative length
    - contigs_ref_coor.tsv
        - the current SV prediction window in the contig 
        - ref chrom, ref pos, ref end, ref orientation, contig index, contig pos, contig end, contig orientation
    - ens_gene.bed
        - Ensembl gene location in the config
    - super_enhancer.bed
        - SE location in the config
    - typical_enhancer.bed
        - TE location in the contig 
    - hic_iced_loop.bed
        - neo-loop location in the iced contig
    - hic_iced.matrix
        - prediction results with post iced normalization
    - hic_iced_tad.bed
        - noe-TAD location in the iced contig. The forth column indicates a TAD level from spectralTAD.
    - hic_iced.pdf
        - Visualization of contig Hi-C matrix, with neo-TAD, neo-loop, ens_gene, super_enhancer, and typical_enhancer annotations

<p align="center">
    <img width="1500" src="https://github.com/DMCB-GIST/InfoHiC/blob/main/doc/hic_iced.png">
  </a>
</p>




## Starting from InfoGenomeR output
### Inputs
- InfoHiC trained model
- InfoGenomeR output from WGS (https://github.com/dmcblab/InfoGenomeR)
### Workflow
```
# go to the InfoHiC base directory
cd InfoHiC

# make a workspace directory
workspace_dir=InfoHiC_workspace2
mkdir -p ${workspace_dir}

# Link the reference and the InfoHiC model in the root directory
ln -s ${PWD}/humandb/ref ${workspace_dir}/ref
ln -s ${PWD}/models/breast_model ${workspace_dir}/model

# take the InfoGenomeR output example
cp -r examples/T47D_chromosomes_8_14/InfoGenomeR_output ${workspace_dir}/InfoGenomeR_output

# set wildcards 
resolution=40000
window=2000000
cancer_type=BRCA
model=CSCN_encoding
gpu=1 # use the available gpu

# run the InfoHiC workflow
snakemake --cores all --use-conda ${workspace_dir}/InfoHiC_prediction/hic_${resolution}.window_${window}.${cancer_type}.${model}.gpu${gpu}

# run the post process
snakemake --cores all --use-conda ${workspace_dir}/InfoHiC_prediction/hic_${resolution}.window_${window}.${cancer_type}.${model}.gpu${gpu}.post_process

```
# InfoHiC training
- The training step can be skipped because we provide InfoHiC trained models.
- It takes two weeks to train on 1 Mb windows (~10 epoches).
- On 2 Mb windows, it takes a month.
- Take the one-day example on 1 Mb windows using the subset of T47D Hi-C reads.

## Starting from InfoGenomeR output
### Inputs
- InfoGenomeR output from WGS (https://github.com/dmcblab/InfoGenomeR)
- Hi-C reads
### Workflow
```
# go to the InfoHiC base directory
cd InfoHiC

# make the root output directory
root_dir=InfoHiC_training_output
mkdir -p ${root_dir}

# link the reference and the seed file in the root directory
ln -s ${PWD}/humandb/ref ${root_dir}/ref
ln -s ${PWD}/models/seed_file ${root_dir}/seed_file

# Place Hi-C reads and the InfoGenomeR output in the root directory
cp -r ${PWD}/examples/T47D_hic_reads_subset ${root_dir}/hic_reads
cp -r examples/T47D_chromosomes_8_14/InfoGenomeR_output ${root_dir}/InfoGenomeR_output

# set wildcards
resolution=40000

# Run Hi-C read mapping
snakemake --cores all --use-conda ${root_dir}/hic_${resolution}/3div


# set wildcards
window=1040000
split_idx=1
split_rate=0.1 # 0.1 for valid and test, and 0.8 for train

# Run Hi-C data post process and split
snakemake --cores all --use-conda ${root_dir}/hic_${resolution}/window_${window}.split${split_idx}_rate${split_rate}

# set wildcards
cancer_type=BRCA
mode=CSCN_encoding
gpu=1
epoch=1

# InfoHiC training
snakemake --cores all --use-conda ${root_dir}/InfoHiC_training.${cancer_type}/hic_${resolution}.window_${window}.split${split_idx}_rate${split_rate}/${mode}/gpu${gpu}.epoch${epoch}
```

Then, go to [Export an InfoHiC model](#export-an-infohic-model)


# Export an InfoHiC model
- After training, select a model and export it
``` 

# List the models, and select a best_checkpoint saved at the last step
model_dir=${root_dir}/InfoHiC_training.${cancer_type}/hic_${resolution}.window_${window}.split${split_idx}_rate${split_rate}/${mode}/gpu${gpu}.epoch${epoch}
ls -l ${model_dir}/training_run_data_40kb_ascn_ACGT_rc_shift 

# This is an example of best_checkpoint 
model=${model_dir}/training_run_data_40kb_ascn_ACGT_rc_shift/best_checkpoint-51198

# copy the model into the model_dir base with the best_checkpoint prefix
cp -r $model.data-00000-of-00001 ${model_dir}/best_checkpoint.data-00000-of-00001
cp -r $model.index ${model_dir}/best_checkpoint.index
cp -r $model.meta ${model_dir}/best_checkpoint.meta

# export it as a contig model finally
snakemake --cores all --use-conda ${model_dir}.model
```
### outputs
```
InfoHiC_training_output/InfoHiC_training.BRCA/hic_40000.window_1040000.split1_rate0.1/CSCN_encoding/gpu1.epoch1.model
├── contig_model.data-00000-of-00001
├── contig_model.index
└── contig_model.meta
```


