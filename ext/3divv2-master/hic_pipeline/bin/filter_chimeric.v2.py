from itertools import izip
import operator
import sys
import re
import fileinput

file_name=str(sys.argv[1])
read_length=int(sys.argv[2])

old_id=''
tmp_list=[]


for line in fileinput.input([file_name]):
    if line[0]!='@':
        [id1,flag1,chr_from1,loc_from1,mapq1,cigar1,d1_1, d2_1, d3_1, read1, read_qual1]=line.split('\t')[0:11]
        #print cigar1
        #print re.split('\d+',cigar1)[1:]

        M_index=re.split('\d+',cigar1)
        #print M_index
        try:
            M_index=M_index.index('M')
        except:
            M_index=read_length
        if id1==old_id:
            tmp_list.append([line[:-1],M_index,mapq1,flag1])
        else:
            #print tmp_list
            if old_id!='':
                if len(tmp_list)==1:
                    print tmp_list[0][0]
                else:
                    tmp_tmp_list=[]
                    for i in tmp_list:
                        if int(i[2])>=10:
                            tmp_tmp_list.append(i)
                    if len(tmp_tmp_list)==1:
                        print tmp_tmp_list[0][0]
                    else:
                        if tmp_list[0][3]=='0': # + strand
                            tmp_list.sort(key=operator.itemgetter(1))
                            print tmp_list[0][0]
                        else:
                            tmp_list.sort(key=operator.itemgetter(1))
                            print tmp_list[-1][0]

                old_id=id1
                tmp_list=[]
                tmp_list.append([line[:-1],M_index,mapq1,flag1])
            else:
                old_id=id1
                tmp_list.append([line[:-1],M_index,mapq1,flag1])
        #print tmp_list
        #print old_id
print tmp_list[0][0]

