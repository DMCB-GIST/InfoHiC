package org.kobic.hicv2.cancerhic.vo;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.kobic.hicv2.cancerhic.obj.InteractionItemObj;

public class InteractionSparseMatVo extends AbstractInteractionMatVo{
	private String intensities;
	private List<InteractionItemObj> vector;
	private List<Double> vector2;

	public void initString2SparseVector() {
		if( this.getIntensities() != null && !this.getIntensities().isEmpty() ) {
			this.vector = Stream.of( this.getIntensities().split(",") )
		      .map (elem -> new InteractionItemObj(Integer.parseInt(elem.split(":")[0]), Double.parseDouble(elem.split(":")[1])))
		      .collect(Collectors.toList());
		}
	}
	
	public void initString2Vector() {
		if( this.getIntensities() != null && !this.getIntensities().isEmpty() ) {
			this.vector2 = Stream.of( this.getIntensities().split(",") )
		      .map (elem -> Double.valueOf(elem))
		      .collect(Collectors.toList());
		}
	}
	public String getIntensities() {
		return intensities;
	}
	public void setIntensities(String intensities) {
		this.intensities = intensities;
	}
	public List<InteractionItemObj> getVector() {
		return vector;
	}

	public void setVector(List<InteractionItemObj> vector) {
		this.vector = vector;
	}

	public List<Double> getVector2() {
		return vector2;
	}

	public void setVector2(List<Double> vector2) {
		this.vector2 = vector2;
	}
}