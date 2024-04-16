import pysam
import csv
import sys
fasta_open=pysam.Fastafile(sys.argv[2])
with open(sys.argv[1]) as f:
        l=csv.reader(f, delimiter='\t')
        for c in l:
            seq_dna=fasta_open.fetch(c[0],int(c[1]),int(c[2]))
            seq_dna=seq_dna.upper()
            if seq_dna.count('N') < 0.1*(int(c[2])-int(c[1])):
                print(*c, sep="\t")
