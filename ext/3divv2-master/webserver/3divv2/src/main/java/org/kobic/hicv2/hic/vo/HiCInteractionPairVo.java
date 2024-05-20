package org.kobic.hicv2.hic.vo;

import java.io.Serializable;

public class HiCInteractionPairVo implements Serializable{
	
	private static final long serialVersionUID = 1L;

	private int bin;
	private int interactionPair;
	private float count;
	private int colOrder;
	private int rowOrder;

	public int getBin() {
		return bin;
	}
	public void setBin(int bin) {
		this.bin = bin;
	}
	public int getInteractionPair() {
		return interactionPair;
	}
	public void setInteractionPair(int interactionPair) {
		this.interactionPair = interactionPair;
	}
	public float getCount() {
		return count;
	}
	public void setCount(float count) {
		this.count = count;
	}
	public int getColOrder() {
		return colOrder;
	}
	public void setColOrder(int colOrder) {
		this.colOrder = colOrder;
	}
	public int getRowOrder() {
		return rowOrder;
	}
	public void setRowOrder(int rowOrder) {
		this.rowOrder = rowOrder;
	}
}
