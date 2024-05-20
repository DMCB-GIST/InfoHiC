package org.kobic.hicv2.cancerhic.vo;

public class GenomeLengthVo {
	private String chrom;
	private String chromosome;
	private long length;
	private int len_5k;
	private int len_40k;
	private int len_500k;

	public String getChrom() {
		return chrom;
	}
	public void setChrom(String chrom) {
		this.chrom = chrom;
	}
	public String getChromosome() {
		return chromosome;
	}
	public void setChromosome(String chrmosome) {
		this.chromosome = chrmosome;
	}
	public long getLength() {
		return length;
	}
	public void setLength(long length) {
		this.length = length;
	}
	public int getLen_5k() {
		return len_5k;
	}
	public void setLen_5k(int len_5k) {
		this.len_5k = len_5k;
	}
	public int getLen_40k() {
		return len_40k;
	}
	public void setLen_40k(int len_40k) {
		this.len_40k = len_40k;
	}
	public int getLen_500k() {
		return len_500k;
	}
	public void setLen_500k(int len_500k) {
		this.len_500k = len_500k;
	}

}
