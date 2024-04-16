package org.kobic.hicv2.cancerhic.obj;

public class SampleParamObj {
	private String sample;
	private String table;
	private String region;
	
//	private ChromBinObj binObj;

	public String getSample() {
		return sample;
	}
	public void setSample(String sample) {
		this.sample = sample;
	}
	public String getTable() {
		return table;
	}
	public void setTable(String table) {
		this.table = table;
	}
	public String getRegion() {
		return region;
	}
	public void setRegion(String region) {
		this.region = region;
	}
//	public void procRegion( int binSize ) {
//		if( this.region != null && !this.region.isEmpty() ) {
//			String[] div = this.region.split(":");
//			String[] pos = div[1].split("-");
//
//			String chrom = div[0];
//
//			this.binObj = new ChromBinObj( chrom, pos[0], pos[1], binSize );
//		}
//	}
//	public ChromBinObj getBinObj() {
//		return binObj;
//	}
//	public void setBinObj(ChromBinObj binObj) {
//		this.binObj = binObj;
//	}
}
