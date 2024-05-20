
import sys
import os

proc_sample_list = sys.argv[1]

cpu=4


WORKDIR = '/home/sillo/3DIV/Data'
BINDIR = '/home/sillo/3DIV/bin'
PBSDIR = '/home/sillo/3DIV/PBS'

def make_PBS(sampleid, sra_ids):

	pbsfilename = PBSDIR + '/PBS_'+sampleid+'_tumor_3DIV.pbs'
	sra_list = sra_ids.split(',')

	output1=open(pbsfilename,'w')
	output1.write('#PBS -N ' +sampleid+'_tumor_3DIV\n')
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

	output1.write('python {}/check_meanvar_normal.py {}/{} {}/scale_normal.R AVGMEAN AVGVAR\n'.format(BINDIR, WORKDIR, sampleid, BINDIR))

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
	pbsfilename = make_PBS(sampleid, sra_ids)
	os.system('qsub {}'.format(pbsfilename))
#
f.close()
