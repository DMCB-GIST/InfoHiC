package org.kobic.hicv2.cancerhic.vo;

import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.zip.DataFormatException;

import org.kobic.hicv2.cancerhic.obj.InteractionItemObj;
import org.kobic.hicv2.util.ZLib;

public class InteractionSparseMatV2Vo extends AbstractInteractionMatVo{
	private List<InteractionItemObj> vector;
	private byte[] intensities;

	public void initString2SparseVector() throws UnsupportedEncodingException, DataFormatException {
		if( this.intensities != null ) {
			String intensities = ZLib.decompress( this.intensities );

			this.vector = Stream.of( intensities.split(",") )
		      .map (elem -> new InteractionItemObj(Integer.parseInt(elem.split(":")[0]), Double.parseDouble(elem.split(":")[1])))
		      .collect(Collectors.toList());
		}
	}

	public byte[] getIntensities() {
		return intensities;
	}

	public void setIntensities(byte[] intensities) {
		this.intensities = intensities;
	}

	public List<InteractionItemObj> getVector() {
		return vector;
	}

	public void setVector(List<InteractionItemObj> vector) {
		this.vector = vector;
	}
}