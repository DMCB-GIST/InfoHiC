package org.kobic.hicv2.cancerhic.vo;

import org.kobic.hicv2.hic.vo.GeneVo;

public class GeneWithBinVo extends GeneVo{
	private int start;
	private int end;
	private int originTxStart;
	private int originTxEnd;
	private int startBin;
	private int endBin;
	private int originTxStartBin;
	private int originTxEndBin;

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
	public int getOriginTxStart() {
		return originTxStart;
	}
	public void setOriginTxStart(int originTxStart) {
		this.originTxStart = originTxStart;
	}
	public int getOriginTxEnd() {
		return originTxEnd;
	}
	public void setOriginTxEnd(int originTxEnd) {
		this.originTxEnd = originTxEnd;
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
	public int getOriginTxStartBin() {
		return originTxStartBin;
	}
	public void setOriginTxStartBin(int originTxStartBin) {
		this.originTxStartBin = originTxStartBin;
	}
	public int getOriginTxEndBin() {
		return originTxEndBin;
	}
	public void setOriginTxEndBin(int originTxEndBin) {
		this.originTxEndBin = originTxEndBin;
	}
}
