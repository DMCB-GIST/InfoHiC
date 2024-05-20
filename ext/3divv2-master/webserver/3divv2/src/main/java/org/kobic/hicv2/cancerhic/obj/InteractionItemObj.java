package org.kobic.hicv2.cancerhic.obj;

public class InteractionItemObj {
	private int bin;
	private double value;
	
	public InteractionItemObj(){
		this(-1, -1);
	}
	public InteractionItemObj(int bin, double value){
		this.bin = bin;
		this.value = value;
	}
	public int getBin() {
		return bin;
	}
	public void setBin(int bin) {
		this.bin = bin;
	}
	public double getValue() {
		return value;
	}
	public void setValue(double value) {
		this.value = value;
	}
}
