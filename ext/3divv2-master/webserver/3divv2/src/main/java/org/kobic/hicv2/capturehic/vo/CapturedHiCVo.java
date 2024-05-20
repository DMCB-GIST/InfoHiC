package org.kobic.hicv2.capturehic.vo;

public class CapturedHiCVo {
	private String type;
	private int promoter_yn;
	private String chrom;
	private long bin1_s;
	private long bin1_e;
	private long bin2_s;
	private long bin2_e;
	
	private int freq;
	private int dist;
	private float dist_res;
	private float pvalue;
	private float all_capture_res;
	
	private float smoothed_all_capture_res;
	private float smoothed_freq;

	public float getSmoothed_all_capture_res() {
		return smoothed_all_capture_res;
	}
	public void setSmoothed_all_capture_res(float smoothed_all_capture_res) {
		this.smoothed_all_capture_res = smoothed_all_capture_res;
	}
	public float getSmoothed_freq() {
		return smoothed_freq;
	}
	public void setSmoothed_freq(float smoothed_freq) {
		this.smoothed_freq = smoothed_freq;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	
	public int getPromoter_yn() {
		return promoter_yn;
	}
	public void setPromoter_yn(int promoter_yn) {
		this.promoter_yn = promoter_yn;
	}
	public String getChrom() {
		return chrom;
	}
	public void setChrom(String chrom) {
		this.chrom = chrom;
	}
	public long getBin1_s() {
		return bin1_s;
	}
	public void setBin1_s(long bin1_s) {
		this.bin1_s = bin1_s;
	}
	public long getBin1_e() {
		return bin1_e;
	}
	public void setBin1_e(long bin1_e) {
		this.bin1_e = bin1_e;
	}
	public long getBin2_s() {
		return bin2_s;
	}
	public void setBin2_s(long bin2_s) {
		this.bin2_s = bin2_s;
	}
	public long getBin2_e() {
		return bin2_e;
	}
	public void setBin2_e(long bin2_e) {
		this.bin2_e = bin2_e;
	}
	public int getFreq() {
		return freq;
	}
	public void setFreq(int freq) {
		this.freq = freq;
	}
	public int getDist() {
		return dist;
	}
	public void setDist(int dist) {
		this.dist = dist;
	}
	public float getAll_capture_res() {
		return all_capture_res;
	}
	public void setAll_capture_res(float all_capture_res) {
		this.all_capture_res = all_capture_res;
	}
	public float getDist_res() {
		return dist_res;
	}
	public void setDist_res(float dist_res) {
		this.dist_res = dist_res;
	}
	public float getPvalue() {
		return pvalue;
	}
	public void setPvalue(float pvalue) {
		this.pvalue = pvalue;
	}
}
