use Bio::DB::Fasta;
use warnings;

my $fa=$ARGV[0];
my $db = Bio::DB::Fasta->new($fa);
my @db_chr = $db->get_all_primary_ids;
my $chr_prefix=0;
if (substr($db_chr[0],0,3) eq "chr"){
        $chr_prefix=1;
}

#my $db = Bio::DB::Fasta->new("/NAS_Storage1/qlalf1457/ucsc.hg19.fasta");
open(my $new_full_f1, '>', "hap1.fa");
open(my $new_full_f2, '>', "hap2.fa");


for(my $chrs=1; $chrs<=23; $chrs++){
        my $chr_name;
        if ($chrs == 23){
		if ($chr_prefix == 1){
	                $chr_name="chrX";
		}else{
			$chr_name="X"
		}
        }else{
		if( $chr_prefix == 1){
	                $chr_name="chr".$chrs;
		}else{
			$chr_name=$chrs;
		}
        }
        my $new_fa1 = $db->seq("${chr_name}");
        my $new_fa2 = $db->seq("${chr_name}");

	my $reads;
	if ($chrs == 23){
	        open($reads, '<', "./diploid_haplotype.X");
	}else{
                open($reads, '<', "./diploid_haplotype.".$chrs);
	}

        while(my $read_line = <$reads>){
                @read_line=();
                chomp $read_line;
                next if $read_line =~ /^\#/ || $read_line =~ /^\s*$/ || $read_line =~ /^\+/;
                @read_line = split(/\t+/, $read_line);
		my $idx=$read_line[1]-1;
		substr($new_fa1, $idx, length($read_line[3])) = $read_line[3];
                substr($new_fa2, $idx, length($read_line[4])) = $read_line[4];

        }



        print $new_full_f1 ">${chr_name}\n";
        while( my $chunk = substr($new_fa1, 0, 80, "")){
                  print $new_full_f1 "$chunk\n";
        }


        print $new_full_f2 ">${chr_name}\n";
        while( my $chunk = substr($new_fa2, 0, 80, "")){
                  print $new_full_f2 "$chunk\n";
        }


}

