package org.kobic.hicv2.cancerhic.vo;

public class PreFoundedSvVo {
	private String sample;
	private String src_chrom;
	private long src_chrom_start;
	private String tar_chrom;
	private long tar_chrom_start;
	private String sv_type;
	private int cluter;
	private String orientation;

	public String getSample() {
		return sample;
	}
	public void setSample(String sample) {
		this.sample = sample;
	}
	public String getSrc_chrom() {
		return src_chrom;
	}
	public void setSrc_chrom(String src_chrom) {
		this.src_chrom = src_chrom;
	}
	public long getSrc_chrom_start() {
		return src_chrom_start;
	}
	public void setSrc_chrom_start(long src_chrom_start) {
		this.src_chrom_start = src_chrom_start;
	}
	public String getTar_chrom() {
		return tar_chrom;
	}
	public void setTar_chrom(String tar_chrom) {
		this.tar_chrom = tar_chrom;
	}
	public long getTar_chrom_start() {
		return tar_chrom_start;
	}
	public void setTar_chrom_start(long tar_chrom_start) {
		this.tar_chrom_start = tar_chrom_start;
	}
	public String getSv_type() {
		return sv_type;
	}
	public void setSv_type(String sv_type) {
		this.sv_type = sv_type;
	}
//	public long getSrc_chrom_end() {
//		return this.src_chrom_start;
//	}
//	public long getTar_chrom_end() {
//		return this.tar_chrom_start;
//	}
	public int getCluter() {
		return cluter;
	}
	public void setCluter(int cluter) {
		this.cluter = cluter;
	}
	public String getOrientation() {
		return orientation;
	}
	public void setOrientation(String orientation) {
		this.orientation = orientation;
	}
	
}
