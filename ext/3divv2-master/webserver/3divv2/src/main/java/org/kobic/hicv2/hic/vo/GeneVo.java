package org.kobic.hicv2.hic.vo;

public class GeneVo {
	private String chrom;
	private int txStart;
	private int txEnd;
	private String name;
	private String num;
	private int nameLength;
	private String tableNM;
	private String locus;
	private String strand;
	
	
	public String getTableNM() {
		return tableNM;
	}
	public void setTableNM(String tableNM) {
		this.tableNM = tableNM;
	}
	public int getNameLength() {
		return nameLength;
	}
	public void setNameLength(int nameLength) {
		this.nameLength = nameLength;
	}
	public String getNum() {
		return num;
	}
	public void setNum(String num) {
		this.num = num;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getChrom() {
		return chrom;
	}
	public void setChrom(String chrom) {
		this.chrom = chrom;
	}
	public int getTxStart() {
		return txStart;
	}
	public void setTxStart(int txStart) {
		this.txStart = txStart;
	}
	public int getTxEnd() {
		return txEnd;
	}
	public void setTxEnd(int txEnd) {
		this.txEnd = txEnd;
	}
	public String getLocus() {
		return locus;
	}
	public void setLocus(String locus) {
		this.locus = locus;
	}
	public String getStrand() {
		return strand;
	}
	public void setStrand(String strand) {
		this.strand = strand;
	}
}
