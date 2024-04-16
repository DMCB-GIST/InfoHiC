package org.kobic.hicv2.cancerhic.vo;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class InteractionMatVo extends AbstractInteractionMatVo{
	private static final Logger logger = LoggerFactory.getLogger(InteractionMatVo.class);

	private String intensities;
	private List<Double> vector;

	public void initString2Vector() {
		if( this.intensities != null && !this.intensities.isEmpty() ) {
			this.vector = Stream.of( this.intensities.split(",") )
		      .map (elem -> Double.valueOf(elem))
		      .collect(Collectors.toList());
		}
	}

	public List<Double> getVector() {
		return vector;
	}

	public void setVector(List<Double> vector) {
		this.vector = vector;
	}

	public String getIntensities() {
		return intensities;
	}

	public void setIntensities(String intensities) {
		this.intensities = intensities;
	}
}
