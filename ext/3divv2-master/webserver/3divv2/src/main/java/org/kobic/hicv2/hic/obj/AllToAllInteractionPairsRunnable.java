package org.kobic.hicv2.hic.obj;

import java.util.List;
import java.util.concurrent.CountDownLatch;

import org.kobic.hicv2.hic.vo.InteractionVo;
import org.kobic.hicv2.util.Utils;

public class AllToAllInteractionPairsRunnable implements Runnable {
    private final CountDownLatch doneLatch;
    private final int context;
    
    private List<InteractionVo> rawInteractionVoList;
    private int dimRow;
    private int dimCol;
    private int resolution;
    private double[][] output;
    
    private double[][] matrix;
    
    public AllToAllInteractionPairsRunnable(CountDownLatch doneLatch, int context, List<InteractionVo> rawInteractionVoList, double[][] rawData, int resolution) {
        this.doneLatch = doneLatch;
        this.context = context;

        this.rawInteractionVoList = rawInteractionVoList;
        this.matrix = rawData;
        this.dimRow = this.matrix.length;
        this.dimCol = this.matrix[0].length;
        this.resolution = resolution;
    }
    
    public void run() {
        doTask();
        doneLatch.countDown(); //처리가 끝날때마다 값을 내려 Main 의 TASKS의 값을 다운 시킨다.
    }
    
    protected void doTask() {
//        String name = Thread.currentThread().getName();
//        System.out.println(name + ":MyTask:BEGIN:context = " + context);
        try {
			int colvolutionDimension = (int)( this.resolution / 1000 );
			
			double[][] convolutionMatrix = new double[colvolutionDimension][colvolutionDimension];
			for(int i=0; i<convolutionMatrix.length; i++) {
				for(int j=0; j<convolutionMatrix[0].length; j++) {
					convolutionMatrix[i][j] = 1;
				}
			}
	
			this.output = Utils.convolution2DV2( matrix, matrix.length, matrix[0].length, convolutionMatrix, convolutionMatrix.length );
//			this.fcOutput = Utils.convolution2DV2( fcmatrix, fcmatrix.length, fcmatrix[0].length, convolutionMatrix, convolutionMatrix.length );
        } catch (Exception e) {
        	;
        } finally {
//            System.out.println(name + ":MyTask:END:context = " + context);
        }
    }
    
	public double[][] getCountOutput() {
		return this.output;
	}
	
//	public double[][] getFoldChangeOutput() {
//		return this.fcOutput;
//	}
	
	public int getResolution() {
		return this.resolution;
	}
}