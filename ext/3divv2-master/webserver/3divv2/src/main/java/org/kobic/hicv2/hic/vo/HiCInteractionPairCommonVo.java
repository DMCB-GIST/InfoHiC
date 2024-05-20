package org.kobic.hicv2.hic.vo;

import java.io.Serializable;
import java.util.List;

public class HiCInteractionPairCommonVo  implements Serializable{
	
	private static final long serialVersionUID = 1L;

	private int startPt;
	private int endPt;
	private float maxFreq;
	private int binSize;
	private int windowSize;
	private List<HiCInteractionPairVo> pairList;

	public int getStartPt() {
		return startPt;
	}
	public void setStartPt(int startPt) {
		this.startPt = startPt;
	}
	public int getEndPt() {
		return endPt;
	}
	public void setEndPt(int endPt) {
		this.endPt = endPt;
	}
	public float getMaxFreq() {
		return maxFreq;
	}
	public void setMaxFreq(float maxFreq) {
		this.maxFreq = maxFreq;
	}
	public int getBinSize() {
		return binSize;
	}
	public void setBinSize(int binSize) {
		this.binSize = binSize;
	}
	public int getWindowSize() {
		return windowSize;
	}
	public void setWindowSize(int windowSize) {
		this.windowSize = windowSize;
	}
	public List<HiCInteractionPairVo> getPairList() {
		return pairList;
	}
	public void setPairList(List<HiCInteractionPairVo> pariList) {
		this.pairList = pariList;
	}
}
