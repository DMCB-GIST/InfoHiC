package org.kobic.hicv2.project.vo;

public class DownloadFileVo {

	private String id;
	private String celline_name;
	private String sample_name;
	private String file_size;
	private String cutoff;
	private String file_path;
	private String reference;
	private String geo_accession;
	private String super_enhancer_path;
	
	
	public String getReference() {
		return reference;
	}
	public void setReference(String reference) {
		this.reference = reference;
	}
	public String getGeo_accession() {
		return geo_accession;
	}
	public void setGeo_accession(String geo_accession) {
		this.geo_accession = geo_accession;
	}
	public String getCelline_name() {
		return celline_name;
	}
	public void setCelline_name(String celline_name) {
		this.celline_name = celline_name;
	}
	public String getSample_name() {
		return sample_name;
	}
	public void setSample_name(String sample_name) {
		this.sample_name = sample_name;
	}
	public String getFile_size() {
		return file_size;
	}
	public void setFile_size(String file_size) {
		this.file_size = file_size;
	}
	public String getCutoff() {
		return cutoff;
	}
	public void setCutoff(String cutoff) {
		this.cutoff = cutoff;
	}
	public String getFile_path() {
		return file_path;
	}
	public void setFile_path(String file_path) {
		this.file_path = file_path;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getSuper_enhancer_path() {
		return super_enhancer_path;
	}
	public void setSuper_enhancer_path(String super_enhancer_path) {
		this.super_enhancer_path = super_enhancer_path;
	}
	
	
}
