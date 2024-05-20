package org.kobic.hicv2.project.vo;

public class GeneLocusVo {
	private String name;
	private String chr;
	private int start;
	private int end;
	private String strand;
	private String db;

	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getChr() {
		return chr;
	}
	public void setChr(String chr) {
		this.chr = chr;
	}
	public int getStart() {
		return start;
	}
	public void setStart(int start) {
		this.start = start;
	}
	public int getEnd() {
		return end;
	}
	public void setEnd(int end) {
		this.end = end;
	}
	public String getStrand() {
		return strand;
	}
	public void setStrand(String strand) {
		this.strand = strand;
	}
	public String getDb() {
		return db;
	}
	public void setDb(String db) {
		this.db = db;
	}
}
