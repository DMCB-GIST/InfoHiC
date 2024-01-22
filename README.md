# InfoHiC
- InfoHiC is a method to predict 3D genome folding from complex DNA rearrangements, which enables the training and validation usage of cancer Hi-C data. InfoHiC provides a decomposed level of interaction views of multiple contigs from the cancer Hi-C matrix. InfoHiC is composed of convolutional neural network (CNNs) that outputs chromatin interactions of genomic contigs and merges them in the total Hi-C views, based on a haplotype-specific copy number (HSCN) encoding that represent genomic variants in the contig matrix.

<p align="center">
    <img width="1500" src="https://github.com/DMCB-GIST/InfoHiC/blob/main/doc/overview.png">
  </a>
</p>


# Cancer Hi-C prediction models
- Brain
    - [NPC 1Mb CSCN decoding 40kb](https://zenodo.org/records/10547043/files/brain_model_1Mb.tar.gz)
    - [NPC 2Mb CSCN decoding 40kb](https://zenodo.org/record/7559281/files/breast_model.tar.gz)
- Breast
    - [T47D 1Mb CSCN encoding 40kb](https://zenodo.org/records/10547765/files/breast_model_1Mb.tar.gz)
    - [T47D 2Mb CSCN encoding 40kb](https://zenodo.org/record/7559281/files/brain_model.tar.gz)

- Hematopoietic
    - [K562 1Mb CSCN encoding 10kb] (https://zenodo.org/records/10547768/files/Hematopoietic_model_1Mb.tar.gz)

# Requirements
- R (version 3.6.3)
    - plyr
    - dplyr
    - RColorBrewer
    - reshape2
    - ggplot2
    - ggforce
    - grid
    - SepctralTAD
- python (version 3.8)
    - tensorflow (version 2.11.0)
    - numpy (version 1.22.0)
    - pysam
    - pickle
    - scipy
    - neoloop
    - iced (version 0.5.10)
    - joblib
    - sklearn
- perl
    - Bio::DB::Fasta
- samtools

# Environment settings
```
cd /home/dmcblab # enter a home or working directory
git clone https://github.com/DMCB-GIST/InfoHiC.git
cd InfoHiC
cd models
./download.sh # download a model for cancer Hi-C prediction.
export InfoHiC_lib=/home/dmcblab/InfoHiC
export PATH=$InfoHiC_lib/InfoGenomeR_processing:$InfoHiC_lib/InfoHiC_tensorflow:$InfoHiC_lib/post_analysis:$PATH
export FRAC=0.9 # flexible memory usage (per_process_gpu_memory_fraction=$FRAC). The minimum for testing is 7GB.
```

# Inputs
- Following inputs are required, which can be generated by InfoGenomeR (https://github.com/dmcblab/InfoGenomeR)
	- contigs.fa
	- contigs.index
	- contigs.bed
	- contigs.cn_file
	- sv_window
	- ref_window
# Outputs
- contig Hi-C matrix and total Hi-C matrix
- neoloop and neo-TAD annotation
- Enhancer hijacking annotation


# Running InfoHiC
- InfoGenomeR_processing
```
Usage: InfoGenomeR_processing <InfoGenomeR_output> <fasta_file>

Options:
        -e, --ens (required)
                 Ensembl annotation
        -s, --se (required)
                 Super enhancer annotation
        -t, --te (required)
                 Typical enhancer annotation
        -h, --help
```

- InfoHiC_test
```
Usage: InfoHiC_test <InfoGenomeR_output> [options]

Options:
        -m, --mode (required)
                 Select the mode (HSCN_encoding, HSCN_decoding)
        -w, --window (required)
                 window size (1Mb, 2Mb)
        -g, --gpu (required)
                 gpu index (default: 0)
        -c, --checkpoint (required)
                 trained model checkpoint

        -h, --help
```
- InfoHiC post analysis
```
Usage: InfoHiC_post <InfoHiC_output> [options]

Options:
        -w, --window (required)
                 window size (1Mb, 2Mb)
        -m, --true_matrix (optional)
                 comparison with the true matrix. Enter a true matrix directory
        -h, --help
```

# Tutorial 1 (T47D)
```
wget https://zenodo.org/record/7559305/files/tutorial3_v2.tar.gz ## T47D
tar -xvf tutorial3_v2.tar.gz
cd tutorial3_v2/total_job_test
```
- Process the InfoGenomeR output
```
### Process the InfoGenomeR output 
ref=GRCh37.fa ## reference genome fasta file without the chr prefix.
InfoGenomeR_processing InfoGenomeR_output $ref -e ${InfoHiC_lib}/humandb/hg19_ensGene.txt -s ${InfoHiC_lib}/humandb/SE_package.bed.BRCA.rf -t ${InfoHiC_lib}/humandb/TE_package.bed.BRCA.rf
```
- Predict Hi-C matrix
```
### Predict Hi-C matrix
InfoHiC_test InfoGenomeR_output -m HSCN_encoding -w 2Mb -g 0 -c ${InfoHiC_lib}/models/breast_model/T47D_transfer_2Mb
```

- perform a post analysis
```
### post analysis
wget https://zenodo.org/record/7559345/files/T47D_experiment.tar.gz
tar -xvf T47D_experiment.tar.gz
InfoHiC_post InfoGenomeR_output -w 2Mb -m T47D_experiment
```

```
cd InfoGenomeR_output/karyotypes/euler.8.14/
# karyotypes.pdf 
<p align="center">
    <img width="400" src="https://github.com/dmcb-gist/InfoHiC/blob/main/doc/euler.8.14/karyotypes.png">
  </a>
</p>
# all.pdf showing the InfoHiC prediction result with Hi-C experiment 
<p align="center">
    <img width="700" src="https://github.com/dmcb-gist/InfoHiC/blob/main/doc/euler.8.14/HiC_prediction.png">
  </a>
</p>

