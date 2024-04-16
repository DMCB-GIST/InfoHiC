package org.kobic.hicv2.cancerhic.obj;

public class MatrixItemListObj {
	private String chrom1;
	private String chrom2;
	private int iRow;
	private int iCol;
	private int rawIrow;
	private int rawIcol;
	
	private double intensity;
	
	public MatrixItemListObj(String chrom1, String chrom2, int iRow, int iCol, double intensity) {
		this.chrom1 = chrom1;
		this.chrom2 = chrom2;
		this.iRow = iRow;
		this.iCol = iCol;
		this.rawIrow = iRow;
		this.rawIcol = iCol;
		this.intensity = intensity;
	}

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

	public int getiRow() {
		return iRow;
	}

	public void setiRow(int iRow) {
		this.iRow = iRow;
	}

	public int getiCol() {
		return iCol;
	}

	public void setiCol(int iCol) {
		this.iCol = iCol;
	}

	public double getIntensity() {
		return intensity;
	}

	public void setIntensity(double intensity) {
		this.intensity = intensity;
	}

	public int getRawIrow() {
		return rawIrow;
	}

	public void setRawIrow(int rawIrow) {
		this.rawIrow = rawIrow;
	}

	public int getRawIcol() {
		return rawIcol;
	}

	public void setRawIcol(int rawIcol) {
		this.rawIcol = rawIcol;
	}
}
