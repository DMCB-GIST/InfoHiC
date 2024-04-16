package org.kobic.hicv2.cancerhic.obj;

public class ChromBinObj {
	public static final int _40K_ = 40000;
	public static final int _500K_ = 500000;

	private String chrom;
	private long startBin;
	private long endBin;

	private long chromStart;
	private long chromEnd;
	private long binSize;
	
	public ChromBinObj( String chrom, String chromStart, String chromEnd, long binSize ) {
		this( chrom, Long.parseLong(chromStart), Long.parseLong(chromEnd), binSize );
	}
	
	public ChromBinObj( String chrom, long chromStart, long chromEnd, long binSize ) {
		this.chrom = chrom;
		this.chromStart = chromStart;
		this.chromEnd = chromEnd;
		
		this.startBin = (long) Math.ceil(chromStart / binSize);
		this.endBin = (long) Math.ceil(chromEnd / binSize) - 1;
		
		this.binSize = binSize;
		
//		this.startBin = (long) Math.floor(chromStart / binSize);
//		this.endBin = (long) Math.floor(chromEnd / binSize);
	}

	public String getChrom() {
		return chrom;
	}
	public void setChrom(String chrom) {
		this.chrom = chrom;
	}
	public long getStartBin() {
		return startBin;
	}
	public void setStartBin(long startBin) {
		this.startBin = startBin;
	}
	public long getEndBin() {
		return endBin;
	}
	public void setEndBin(long endBin) {
		this.endBin = endBin;
	}
	public long getChromStart() {
		return chromStart;
	}
	public void setChromStart(long chromStart) {
		this.chromStart = chromStart;
	}
	public long getChromEnd() {
		return chromEnd;
	}
	public void setChromEnd(long chromEnd) {
		this.chromEnd = chromEnd;
	}

	public long getBinSize() {
		return binSize;
	}

	public void setBinSize(long binSize) {
		this.binSize = binSize;

		this.startBin = (long) Math.ceil(chromStart / this.binSize);
		this.endBin = (long) Math.ceil(chromEnd / this.binSize) - 1;
	}
}
