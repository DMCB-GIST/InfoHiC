package org.kobic.hicv2.hic.vo;

public class SampleVo implements java.io.Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String num;
	private String id;
	private String celline_name;
	private String table_name;
	private String valid_yn;
	private String binning_table_name;
	private String sample_name;
	private String super_enhancer;
	private String epigenomic_annotation;
	private String tad;
	private String epigenome_table;
	private String super_enhancer_table;
	private int binning_type;

	public String getNum() {
		return num;
	}
	public void setNum(String num) {
		this.num = num;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getCelline_name() {
		return celline_name;
	}
	public void setCelline_name(String celline_name) {
		this.celline_name = celline_name;
	}
	public String getTable_name() {
		return table_name;
	}
	public void setTable_name(String table_name) {
		this.table_name = table_name;
	}
	public String getValid_yn() {
		return valid_yn;
	}
	public void setValid_yn(String valid_yn) {
		this.valid_yn = valid_yn;
	}
	public String getBinning_table_name() {
		return binning_table_name;
	}
	public void setBinning_table_name(String binning_table_name) {
		this.binning_table_name = binning_table_name;
	}
	public String getSample_name() {
		return sample_name;
	}
	public void setSample_name(String sample_name) {
		this.sample_name = sample_name;
	}
	public String getSuper_enhancer() {
		return super_enhancer;
	}
	public void setSuper_enhancer(String super_enhancer) {
		this.super_enhancer = super_enhancer;
	}
	public String getEpigenomic_annotation() {
		return epigenomic_annotation;
	}
	public void setEpigenomic_annotation(String epigenomic_annotation) {
		this.epigenomic_annotation = epigenomic_annotation;
	}
	public String getTad() {
		return tad;
	}
	public void setTad(String tad) {
		this.tad = tad;
	}
	public String getEpigenome_table() {
		return epigenome_table;
	}
	public void setEpigenome_table(String epigenome_table) {
		this.epigenome_table = epigenome_table;
	}
	public int getBinning_type() {
		return binning_type;
	}
	public void setBinning_type(int binning_type) {
		this.binning_type = binning_type;
	}
	public String getSuper_enhancer_table() {
		return super_enhancer_table;
	}
	public void setSuper_enhancer_table(String super_enhancer_table) {
		this.super_enhancer_table = super_enhancer_table;
	}
}
