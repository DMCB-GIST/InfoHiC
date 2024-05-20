package org.kobic.hicv2.util;

import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Utils {
	private static final Logger logger = LoggerFactory.getLogger(Utils.class);
	
	public static double null2Zero(String value) {
		try {
			if( value == null )			return 0;
			else if( value.isEmpty() )	return 0;
			else return Double.parseDouble(value);
		}catch(NumberFormatException e) {
			logger.error( e.getMessage() );
			
			return 0;
		}
	}
	
	public static double null2Value(String value, long nVal) {
		try {
			if( value == null )			return nVal;
			else if( value.isEmpty() )	return nVal;
			else return Double.parseDouble(value);
		}catch(NumberFormatException e) {
			logger.error( e.getMessage() );
			
			return nVal;
		}
	}
	
	public static String null2String(String value, String nVal) {
		if( value == null )			return nVal;
		else if( value.isEmpty() )	return nVal;
		
		return value;
	}
	
	public static<Double> Stream<Double> getSlice(Stream<Double> stream, long l, long m){
		return stream.collect(Collectors.collectingAndThen
				(
						Collectors.toList(),
						list -> list.stream()
								.skip(l)
								.limit(m - l + 1)
				)
		);
	}
	
	public static double[][] convolution2DV2(double[][] input, int dim, int dim2, double[][] kernel, int kernelDim) {
		double[][] output = new double[dim][dim2];
		for (int i = 0; i < dim; ++i) {
			for (int j = 0; j < dim2; ++j) {
				output[i][j] = 0;
			}
		}
		for (int i = 0; i < dim; ++i) {
			for (int j = 0; j < dim2; ++j) {
				output[i][j] = Utils.singlePixelConvolutionV2(input, i, j, kernel, kernelDim);
			}
		}
        return output;
    }
	public static double singlePixelConvolutionV2(double [][] input, int x, int y, double [][] k, int kernelDim){
		double output = 0;
		int offset = (int)(kernelDim / 2);
		for(int i=0;i<kernelDim;++i){
			for(int j=0;j<kernelDim;++j){
				int iRow = x+i-offset;
				int iCol = y+j-offset;
				
				if( iRow < 0 || iCol < 0 )											output = output + 0;
				else if( iRow > input.length - 1 || iCol > input[0].length - 1 )	output = output + 0;
				else																output = output + (input[iRow][iCol] * k[i][j]);
			}
		}
		return output / Math.pow(kernelDim, 2);
	}
	
	public static double[] convolution2DV21(double[][] input, double[][] kernel, int index, int windowSize) {
		double[] output = new double[input[0].length];

		int offset = (int)((windowSize) / 2);

		for (int i = 0; i < output.length; i++) {
			output[i] = singlePixelConvolution2( input, i, index, kernel, offset);
		}

        return output;
    }
	
	
	public static double singlePixelConvolution2(double [][] input, int x, int y, double [][] k, int offset){
		double output = 0;
		for(int i=0;i<k.length;++i){
			for(int j=0;j<k.length;++j){
				int iCol = x+j-offset;
				int iRow = y+i-offset;
				
				if( iRow < 0 || iCol < 0 )											output = output + 0;
				else if( iRow > input.length - 1 || iCol > input[0].length - 1 )	output = output + 0;
				else																output = output + (input[iRow][iCol] * k[i][j]);
			}
		}
		return output;
	}
	
	public static float[][] convolution2DV2(float[][] input, int dim, float[][] kernel, int kernelDim) {
		float[][] output = new float[dim][dim];
		for (int i = 0; i < dim; ++i) {
			for (int j = 0; j < dim; ++j) {
				output[i][j] = 0;
			}
		}
		for (int i = 0; i < dim; ++i) {
			for (int j = 0; j < dim; ++j) {
				output[i][j] = Utils.singlePixelConvolutionV2(input, i, j, kernel, kernelDim);
			}
		}
        return output;
    }
	
	public static float singlePixelConvolutionV2(float [][] input, int x, int y, float [][] k, int kernelDim){
		float output = 0;
		int offset = (int)(kernelDim / 2);
		for(int i=0;i<kernelDim;++i){
			for(int j=0;j<kernelDim;++j){
				int iRow = x+i-offset;
				int iCol = y+j-offset;
				
				if( iRow < 0 || iCol < 0 )										output = output + 0;
				else if( iRow > input.length - 1 || iCol > input.length - 1 )	output = output + 0;
				else															output = output + (input[iRow][iCol] * k[i][j]);
			}
		}
		return (float)(output / Math.pow(kernelDim, 2));
	}
	
	public static double[] convolution2D( double[][] input, double[][] kernel ) {
		double[] output = new double[input[0].length];
		
		int offset = (int)(input.length / 2);

		for (int i = 0; i < output.length; i++) {
			output[i] = 0;
		}

		for (int i = 0; i < output.length; i++) {
			output[i] = singlePixelConvolution(input, i, kernel, offset);
		}
        return output;
    }
	
	public static double singlePixelConvolution(double [][] input, int x, double [][] k, int offset){
		int iRow=0;
		int iCol=0;
		double output = 0;
		
		for(int i=0; i<input.length; i++) {
			for(int j=x-offset; j<=x+offset; j++) {
				double value = 0;
				
				try {
					value = input[i][j];
				}catch(Exception e) {
					value = 0;
				}

				output += (k[iRow][iCol] * value);
				iCol++;
			}
			iCol=0;
			iRow++;
		}
		return output;
	}
}
