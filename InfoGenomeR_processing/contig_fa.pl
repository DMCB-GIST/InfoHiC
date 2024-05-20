use Env;
use Bio::DB::Fasta;
use warnings;
use strict;
my $nf;
my @fa;
`rm -rf $ARGV[0].index`;
`rm -rf $ARGV[1].index`;
$fa[0]=  Bio::DB::Fasta->new($ARGV[0]);
$fa[1]=  Bio::DB::Fasta->new($ARGV[1]);
my @db_chr = $fa[0]->get_all_primary_ids;
my $chr_prefix=0;
if (substr($db_chr[0],0,3) eq "chr"){
        $chr_prefix=1;
}


open(my $contigs, '>', "contigs.fa");
open(my $contigs_cn_file, '>', "contigs.cn_file");
open(my $contigs_bed, '>', "contigs.bed");
open(my $contig_index, '>', "contigs.index");

open($nf, "./node_keys");
my @node;
my $ni=0;
while(my $line = <$nf>){
	chomp $line;
	next if $line =~ /^\#/ || $line =~ /^\s*$/ || $line =~ /^\+/;
        my @line=split(/\s+/,$line);
	next if $line[0] eq "chrom";
	for(my $i=0; $i<=$#line;$i=$i+1){
		$node[$ni][$i]=$line[$i];
	}
	$ni=$ni+1;
}

my $f;


my $seq="";
open($f, "./path1");
my $pi=1;
while(my $line = <$f>){
	my $i;
	my $j;
	chomp $line;
	next if $line =~ /^\#/ || $line =~ /^\s*$/ || $line =~ /^\+/;
	my @line=split(/\s+/,$line);
	my $cum_len=0;
	for($i=3;$i<=$#line; $i=$i+2){
		$j=$i+1;
		my $l_seq="";

		my $fa_idx= $node[$line[$i]][4] -1;
		if( $line[$i] < $line[$j]){
			if($chr_prefix==1){
				$l_seq=$fa[$fa_idx]->seq("chr$node[$line[$i]][1]", $node[$line[$i]][2]=> $node[$line[$j]][2]);
			}else{
				$l_seq=$fa[$fa_idx]->seq("$node[$line[$i]][1]", $node[$line[$i]][2]=> $node[$line[$j]][2]);
			}
		}else{
			if($chr_prefix==1){
				$l_seq=$fa[$fa_idx]->seq("chr$node[$line[$i]][1]", $node[$line[$j]][2]=> $node[$line[$i]][2]);
			}else{
				$l_seq=$fa[$fa_idx]->seq("$node[$line[$i]][1]", $node[$line[$j]][2]=> $node[$line[$i]][2]);
			}
			$l_seq =~ tr/ACGTacgt/TGCAtgca/;
			$l_seq = scalar reverse $l_seq;
		}
		$l_seq = uc $l_seq;
		$cum_len=$cum_len+length($l_seq);
		print $contig_index "contig$pi\t$line[$i]\t$line[$j]\tchr$node[$line[$i]][1]\t$node[$line[$i]][2]\t$node[$line[$j]][2]\t$cum_len\n";
		$seq=$seq.$l_seq;

	}

        my $contigs_length=length($seq);

        print $contigs ">contig$pi\n";
        while( my $chunk = substr($seq, 0, 80, "")){
                  print $contigs "$chunk\n";
        }
	print $contigs_cn_file "contig$pi\t1\t$contigs_length\t$line[2]\n";

	if ($line[1] eq "linear"){
		print $contigs_bed "contig$pi\t1\t$contigs_length\treference\t$line[1]\n";
	}else{
		my $ncl=int($contigs_length/6);
		my $ncl2=int($contigs_length/6*5);
		print $contigs_bed "contig$pi\t$ncl\t$ncl2\treference\t$line[1]\n";
	}

	$pi=$pi+1;
}


`samtools faidx contigs.fa`;
`Rscript $ENV{InfoHiC_lib}/InfoGenomeR_processing/sv_window.R`;
