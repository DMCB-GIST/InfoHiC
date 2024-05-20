
import sys
import os

proc_sample_list = sys.argv[1]

cpu=12

FASTA='/home/sillo/3DIV/utils/hg38.fa'    
FAI='/home/sillo/3DIV/utils/hg38.fa.fai' 

FASTERQDUMP='/home/sillo/downloads/sratoolkit.2.9.6-1-ubuntu64/bin/fasterq-dump'
SAMTOOLS='/home/junghyun/bin/samtools-1.3/bin/samtools'
PICARDJAR='/home/junghyun/programs/picard_tool/picard.jar'
BWA = '/home/junghyun/programs/bwa/bwa'

WORKDIR = '/home/sillo/3DIV/Data'
BINDIR = '/home/sillo/3DIV/bin'
PBSDIR = '/home/sillo/3DIV/PBS'
COVBIN = '/home/sillo/3DIV/utils/allchr.40kb.bin'
COVBIN2 = '/home/sillo/3DIV/utils/allchr.5kb.bin'

def make_PBS(sampleid, sra_ids):

	pbsfilename = PBSDIR + '/PBS_'+sampleid+'_normal_3DIV.pbs'
	sra_list = sra_ids.split(',')

	output1=open(pbsfilename,'w')
	output1.write('#PBS -N ' +sampleid+'_normal_3DIV\n')
	output1.write('#PBS -q workq\n')
	output1.write('#PBS -l nodes=1:ppn='+str(cpu)+'\n')
	output1.write('#PBS -j oe\n')
	output1.write('\n')
	output1.write('# go workdir\n')
	output1.write('cd $PBS_O_WORKDIR\n')
	output1.write('\n')
	output1.write('# run command \n')
	output1.write('sleep 5\n')
	output1.write('\n')
	output1.write('echo -n \"I am on: \"\n')
	output1.write('hostname;\n')	
	output1.write('echo finding ssh-accessible nodes:\n')
	output1.write('echo -n \"running on: \"\n')
	output1.write('\n')
	output1.write('FASTA='+FASTA+'\n')
	output1.write('FAI='+FAI+'\n')
	output1.write('FASTERQDUMP={}\n'.format(FASTERQDUMP))
	output1.write('BWA='+BWA+'\n')
	output1.write('SAMTOOLS='+SAMTOOLS+'\n')
	output1.write('PICARDJAR='+PICARDJAR+'\n')
	output1.write('\n')
	"""
	for SRA_id in sra_list: #Comment this loop if already downloaded
		output1.write('$FASTERQDUMP --split-files --outdir {}/{} {}\n'.format(WORKDIR, sampleid, SRA_id))
	#
	"""
	"""
	output1.write('cat {}/{}/*_1.fastq > {}/{}/{}_1.fastq\n'.format(WORKDIR, sampleid, WORKDIR, sampleid, sampleid))
	output1.write('cat {}/{}/*_2.fastq > {}/{}/{}_2.fastq\n'.format(WORKDIR, sampleid, WORKDIR, sampleid, sampleid))
	output1.write('cat {}/{}/{}_1.fastq | $BWA mem -M -t {} $FASTA - > {}/{}/{}_1.sam\n'.format(WORKDIR, sampleid, sampleid, str(cpu), WORKDIR, sampleid, sampleid))
	output1.write('cat {}/{}/{}_2.fastq | $BWA mem -M -t {} $FASTA - > {}/{}/{}_2.sam\n'.format(WORKDIR, sampleid, sampleid, str(cpu), WORKDIR, sampleid, sampleid))

	output1.write('python {}/filter_chimeric.v2.py {}/{}/{}_1.sam > {}/{}/{}_1.filtered.sam \n'.format(BINDIR, WORKDIR, sampleid, sampleid, WORKDIR, sampleid, sampleid))
	output1.write('python {}/filter_chimeric.v2.py {}/{}/{}_2.sam > {}/{}/{}_2.filtered.sam \n'.format(BINDIR, WORKDIR, sampleid, sampleid, WORKDIR, sampleid, sampleid))

	output1.write('python {}/make_paired_sam.py {}/{}/{}_1.filtered.sam {}/{}/{}_2.filtered.sam | $SAMTOOLS view -Sb -t $FAI -o {}/{}/{}.merged.bam\n'.format(BINDIR, WORKDIR, sampleid, sampleid, WORKDIR, sampleid, sampleid, WORKDIR, sampleid, sampleid))

	output1.write('$SAMTOOLS view -S {}/{}/{}.merged.bam | python {}/filter_self_trans_reads_stdin.py | $SAMTOOLS view -Sb -t $FAI -o {}/{}/{}.filtered.merged.bam\n'.format(WORKDIR, sampleid, sampleid, BINDIR, WORKDIR, sampleid, sampleid))
	output1.write('$SAMTOOLS sort {}/{}/{}.filtered.merged.bam > {}/{}/{}.sorted.filtered.merged.bam\n'.format(WORKDIR, sampleid, sampleid, WORKDIR, sampleid, sampleid))

	output1.write('java -Xmx50g -jar $PICARDJAR MarkDuplicates VALIDATION_STRINGENCY=LENIENT REMOVE_DUPLICATES=TRUE ASSUME_SORTED=TRUE I={}/{}/{}.sorted.filtered.merged.bam O={}/{}/{}.nodup.sorted.filtered.merged.bam M={}/{}/{}.METRIX.TXT TMP_DIR=/tmp\n'.format(WORKDIR, sampleid, sampleid, WORKDIR, sampleid, sampleid, WORKDIR, sampleid, sampleid))
	output1.write('$SAMTOOLS index {}/{}/{}.nodup.sorted.filtered.merged.bam\n'.format(WORKDIR, sampleid, sampleid))

	output1.write('coverageBed -counts -abam {}/{}/{}.nodup.sorted.filtered.merged.bam -b {} > {}/{}/{}.40kb.coverage\n'.format(WORKDIR, sampleid, sampleid, COVBIN, WORKDIR, sampleid, sampleid))
	output1.write('sortBed -i {}/{}/{}.40kb.coverage > {}/{}/{}.40kb.sort.coverage\n'.format(WORKDIR, sampleid, sampleid, WORKDIR, sampleid, sampleid))
		
	output1.write('coverageBed -counts -abam {}/{}/{}.nodup.sorted.filtered.merged.bam -b {} > {}/{}/{}.5kb.coverage\n'.format(WORKDIR, sampleid, sampleid, COVBIN2, WORKDIR, sampleid, sampleid))
	output1.write('sortBed -i {}/{}/{}.5kb.coverage > {}/{}/{}.5kb.sort.coverage\n'.format(WORKDIR, sampleid, sampleid, WORKDIR, sampleid, sampleid))
	"""	
	output1.write('python {}/make_5kb_feature_normalize_v2.py {}/{}/{}.nodup.sorted.filtered.merged.bam  {}/coverage_normalize.R {}/cis_dist_normalize.R\n'.format(BINDIR, WORKDIR, sampleid, sampleid, BINDIR, BINDIR))

	output1.write('\n')
	output1.write('sleep 30\n')
	output1.write('exit 0')
	output1.close()

	return pbsfilename
#

f = open(proc_sample_list)
f.readline()
for line in f:
	line = line.rstrip()
	linedata = line.split("\t")

	sampledesc = linedata[0]
	sampleid = linedata[4]
	sra_ids = linedata[2]
	
	sampledir = "{}/{}".format(WORKDIR, sampleid)
	if not os.path.exists(sampledir): os.mkdir(sampledir)
	w = open(sampledir + "/DESCRIPTION.txt",'w')
	w.write(sampledesc)
	w.close()

	pbsfilename = make_PBS(sampleid, sra_ids)
	os.system('qsub {}'.format(pbsfilename))
#
f.close()
