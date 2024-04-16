package org.kobic.hicv2.capturehic.vo;

import java.util.ArrayList;
import java.util.List;


public class GeneStructureVo extends GeneVo{
	private int cdsStart;
	private int cdsEnd;
	private int exonCount;
	private String exonStarts;
	private String exonEnds;
	
	private List<Exon> exons;

	public int getCdsStart() {
		return cdsStart;
	}
	public void setCdsStart(int cdsStart) {
		this.cdsStart = cdsStart;
	}
	public int getCdsEnd() {
		return cdsEnd;
	}
	public void setCdsEnd(int cdsEnd) {
		this.cdsEnd = cdsEnd;
	}
	public int getExonCount() {
		return exonCount;
	}
	public void setExonCount(int exonCount) {
		this.exonCount = exonCount;
	}
	public String getExonStarts() {
		return exonStarts;
	}
	public void setExonStarts(String exonStarts) {
		this.exonStarts = exonStarts;
	}
	public String getExonEnds() {
		return exonEnds;
	}
	public void setExonEnds(String exonEnds) {
		this.exonEnds = exonEnds;
	}
	
	public void makeExonObjects() {
		String[] starts = this.exonStarts.split(",");
		String[] ends = this.exonEnds.split(",");
		
		if( starts.length == ends.length ) {
			this.exons = new ArrayList<Exon>();

			for(int i=0; i<starts.length; i++) {
				Exon exon = new Exon( Integer.valueOf(starts[i]), Integer.valueOf(ends[i]) );
				
				this.exons.add( exon );
			}
		}
	}
	
	public List<Exon> getExons() {
		return exons;
	}
	public void setExons(List<Exon> exons) {
		this.exons = exons;
	}



	class Exon {
		private int start;
		private int end;
		
		public Exon(int start, int end) {
			this.start = start;
			this.end = end;
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
	}
}
