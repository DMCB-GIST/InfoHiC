package org.kobic.hicv2.hic.obj;

import java.util.List;
import java.util.concurrent.CountDownLatch;

import org.kobic.hicv2.hic.vo.HeatMapVo;
import org.kobic.hicv2.util.Utils;


public class HeatmapRunnable implements Runnable {
    private final CountDownLatch doneLatch;
    private final int context;
    
    private List<HeatMapVo> rawHeatMapVoList;
    private int dim;
    private int resolution;
    private float[][] output;
    
    public HeatmapRunnable(CountDownLatch doneLatch, int context, List<HeatMapVo> rawHeatMapVoList, int dim, int resolution) {
        this.doneLatch = doneLatch;
        this.context = context;
        
        this.rawHeatMapVoList = rawHeatMapVoList;
        this.dim = dim;
        this.resolution = resolution;
    }
    
    public void run() {
        doTask();
        doneLatch.countDown(); //처리가 끝날때마다 값을 내려 Main 의 TASKS의 값을 다운 시킨다.
    }
    
    protected void doTask() {
        String name = Thread.currentThread().getName();
//        System.out.println(name + ":MyTask:BEGIN:context = " + context);
        try {
			float[][] fcMatrix = new float[this.dim][this.dim];
			for(int i=0; i<this.dim; i++) {
				for(int j=0; j<this.dim; j++) {
					fcMatrix[i][j] = 0;
				}
			}
			for(HeatMapVo vo : this.rawHeatMapVoList) {
				int iRow = vo.getBin();
				int iCol = vo.getInteractionPair();
	
				try {
					fcMatrix[iRow][iCol] = vo.getCount();
				}catch(Exception e){}
			}
	
			int colvolutionDimension = (int)( this.resolution / 1000 );
			
			float[][] convolutionMatrix = new float[colvolutionDimension][colvolutionDimension];
			for(int i=0; i<convolutionMatrix.length; i++) {
				for(int j=0; j<convolutionMatrix[0].length; j++) {
					convolutionMatrix[i][j] = 1;
				}
			}
	
			this.output = Utils.convolution2DV2( fcMatrix, fcMatrix.length, convolutionMatrix, convolutionMatrix.length );
        } catch (Exception e) {
        	;
        } finally {
//            System.out.println(name + ":MyTask:END:context = " + context);
        }
    }
    
    public float[][] getOutput() {
    	return this.output;
    }
}