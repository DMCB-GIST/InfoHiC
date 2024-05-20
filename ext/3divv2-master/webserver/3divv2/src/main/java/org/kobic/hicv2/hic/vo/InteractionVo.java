package org.kobic.hicv2.hic.vo;

public class InteractionVo {
	private String chr;
	private int bin1;
	private int bin2;
	private double count;
	private double foldChange;
	private int bin1_idx;
	private int bin2_idx;
	private int bin2Len;
//	private double all_capture_res;

	public String getChr() {
		return chr;
	}
	public int getBin1_idx() {
		return bin1_idx;
	}
	public void setBin1_idx(int bin1_idx) {
		this.bin1_idx = bin1_idx;
	}
	public int getBin2_idx() {
		return bin2_idx;
	}
	public void setBin2_idx(int bin2_idx) {
		this.bin2_idx = bin2_idx;
	}
	public void setChr(String chr) {
		this.chr = chr;
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
	public double getCount() {
		return count;
	}
	public void setCount(double count) {
		this.count = count;
	}
	
	public double getFoldChange() {
		return foldChange;
	}
	public void setFoldChange(double foldChange) {
		this.foldChange = foldChange;
	}
	
	public int getBin2Len() {
		return bin2Len;
	}
	public void setBin2Len(int bin2Len) {
		this.bin2Len = bin2Len;
	}
	//	public double getAll_capture_res() {
//		return all_capture_res;
//	}
//	public void setAll_capture_res(double all_capture_res) {
//		this.all_capture_res = all_capture_res;
//	}
	public boolean isOverlapped(int start, int end, int windowSize) {
		int min = Math.min(start,  bin2);
		int max = Math.max(end,  this.bin2 + windowSize);
		
		int diff = max - min + 1;
		int sum = (end-start+1) + (this.bin2 + windowSize - this.bin2 + 1);

		if( diff < sum ) return true;
		
		return false;
	}
}
