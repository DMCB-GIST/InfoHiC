package org.kobic.hicv2.hic.vo;

public class LocusVo {
	private String chrom;
	private int txStart;
	private int txEnd;
	private String strand;
	
	
	public String getChrom() {
		return chrom;
	}
	public void setChrom(String chrom) {
		this.chrom = chrom;
	}
	public int getTxStart() {
		return txStart;
	}
	public void setTxStart(int txStart) {
		this.txStart = txStart;
	}
	public int getTxEnd() {
		return txEnd;
	}
	public void setTxEnd(int txEnd) {
		this.txEnd = txEnd;
	}
	public String getStrand() {
		return strand;
	}
	public void setStrand(String strand) {
		this.strand = strand;
	}
}
