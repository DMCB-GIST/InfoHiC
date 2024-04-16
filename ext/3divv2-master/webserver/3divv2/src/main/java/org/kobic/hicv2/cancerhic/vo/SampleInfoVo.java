package org.kobic.hicv2.cancerhic.vo;

public class SampleInfoVo implements java.io.Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;


	private String id;
	private int sample_id;
	private String sample;
	private String type;
	private String desc;
	private String valid_yn;
	private String file_name;
	private String file_size;
	private String table_name;
	private int resolution;
	
	public String getFile_name() {
		return file_name;
	}
	public void setFile_name(String file_name) {
		this.file_name = file_name;
	}
	public String getFile_size() {
		return file_size;
	}
	public void setFile_size(String file_size) {
		this.file_size = file_size;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getDesc() {
		return desc;
	}
	public void setDesc(String desc) {
		this.desc = desc;
	}
	public String getValid_yn() {
		return valid_yn;
	}
	public void setValid_yn(String valid_yn) {
		this.valid_yn = valid_yn;
	}
	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getSample() {
		return sample;
	}
	public void setSample(String sample) {
		this.sample = sample;
	}
	public String getTable_name() {
		return table_name;
	}
	public void setTable_name(String table_name) {
		this.table_name = table_name;
	}
	public int getResolution() {
		return resolution;
	}
	public void setResolution(int resolution) {
		this.resolution = resolution;
	}
	public int getSample_id() {
		return sample_id;
	}
	public void setSample_id(int sample_id) {
		this.sample_id = sample_id;
	}
}
