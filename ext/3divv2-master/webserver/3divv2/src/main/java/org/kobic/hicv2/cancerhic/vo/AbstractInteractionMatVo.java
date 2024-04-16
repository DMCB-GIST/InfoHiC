package org.kobic.hicv2.cancerhic.vo;

public class AbstractInteractionMatVo {
	private String chrom1;
	private String chrom2;
	private int nrow;
	private int ncol;
	private int current_row;

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
	public int getNrow() {
		return nrow;
	}
	public void setNrow(int nrow) {
		this.nrow = nrow;
	}
	public int getNcol() {
		return ncol;
	}
	public void setNcol(int ncol) {
		this.ncol = ncol;
	}
	public int getCurrent_row() {
		return current_row;
	}
	public void setCurrent_row(int current_row) {
		this.current_row = current_row;
	}
}
