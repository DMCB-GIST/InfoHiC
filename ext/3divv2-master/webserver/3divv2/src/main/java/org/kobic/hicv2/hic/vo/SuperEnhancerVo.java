package org.kobic.hicv2.hic.vo;

public class SuperEnhancerVo {
	
	private String chr;
	private int start;
	private int end;
	private String id;
	
	private int startBin;
	private int endBin;
	private int originStartBin;
	private int originEndBin;
	
	private int originStart;
	private int originEnd;

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
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public int getOriginStart() {
		return originStart;
	}
	public void setOriginStart(int originStart) {
		this.originStart = originStart;
	}
	public int getOriginEnd() {
		return originEnd;
	}
	public void setOriginEnd(int originEnd) {
		this.originEnd = originEnd;
	}
	public int getStartBin() {
		return startBin;
	}
	public void setStartBin(int startBin) {
		this.startBin = startBin;
	}
	public int getEndBin() {
		return endBin;
	}
	public void setEndBin(int endBin) {
		this.endBin = endBin;
	}
	public int getOriginStartBin() {
		return originStartBin;
	}
	public void setOriginStartBin(int originStartBin) {
		this.originStartBin = originStartBin;
	}
	public int getOriginEndBin() {
		return originEndBin;
	}
	public void setOriginEndBin(int originEndBin) {
		this.originEndBin = originEndBin;
	}
}
