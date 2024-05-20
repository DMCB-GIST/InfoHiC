package org.kobic.hicv2.cancerhic.vo;

public class InteractionVo {
	private String chrom1;
	private String chrom2;
	private int bin1;
	private int bin2;
	private long chromStart1;
	private long chromEnd1;
	private long chromStart2;
	private long chromEnd2;
	private double intensity;

	public String getChrom1() {
		return chrom1;
	}
	public void setChrom1(String chrom1) {
		this.chrom1 = chrom1;
	}
	public String getChrom2() {
		return chrom2;
	}
	public void setChrom2(String chrom2) {
		this.chrom2 = chrom2;
	}
	public int getBin1() {
		return bin1;
	}
	public void setBin1(int bin1) {
		this.bin1 = bin1;
	}
	public int getBin2() {
		return bin2;
	}
	public void setBin2(int bin2) {
		this.bin2 = bin2;
	}
	public long getChromStart1() {
		return chromStart1;
	}
	public void setChromStart1(long chromStart1) {
		this.chromStart1 = chromStart1;
	}
	public long getChromEnd1() {
		return chromEnd1;
	}
	public void setChromEnd1(long chromEnd1) {
		this.chromEnd1 = chromEnd1;
	}
	public long getChromStart2() {
		return chromStart2;
	}
	public void setChromStart2(long chromStart2) {
		this.chromStart2 = chromStart2;
	}
	public long getChromEnd2() {
		return chromEnd2;
	}
	public void setChromEnd2(long chromEnd2) {
		this.chromEnd2 = chromEnd2;
	}
	public double getIntensity() {
		return intensity;
	}
	public void setIntensity(double intensity) {
		this.intensity = intensity;
	}
}
