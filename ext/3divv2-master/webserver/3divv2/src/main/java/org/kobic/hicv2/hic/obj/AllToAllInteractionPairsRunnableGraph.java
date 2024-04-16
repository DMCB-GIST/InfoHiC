package org.kobic.hicv2.hic.obj;

import java.util.List;
import java.util.concurrent.CountDownLatch;

import org.kobic.hicv2.hic.vo.InteractionVo;
import org.kobic.hicv2.util.Utils;

public class AllToAllInteractionPairsRunnableGraph implements Runnable {
    private final CountDownLatch doneLatch;
    private final int context;
    
    private List<InteractionVo> rawInteractionVoList;
    private int dimRow;
    private int dimCol;
    private int resolution;
    private double[] output;
    private double[] fcOutput;
    private Integer matIndex;
    
    private double[][] matrix;
    private double[][] fcmatrix;
    
    public AllToAllInteractionPairsRunnableGraph(CountDownLatch doneLatch, int context, List<InteractionVo> rawInteractionVoList, double[][] rawData, double[][] fcMatrix, int resolution, Integer matIndex) {
        this.doneLatch = doneLatch;
        this.context = context;

        this.rawInteractionVoList = rawInteractionVoList;
        this.matrix = rawData;
        this.fcmatrix = fcMatrix;
        this.dimRow = this.matrix.length;
        this.dimCol = this.matrix[0].length;
        this.resolution = resolution;
        this.matIndex = matIndex;
    }

    public void run() {
        doTask();
        doneLatch.countDown(); //처리가 끝날때마다 값을 내려 Main 의 TASKS의 값을 다운 시킨다.
    }
    
    protected void doTask() {
        String name = Thread.currentThread().getName();
        System.out.println(name + ":MyTask:BEGIN:context = " + context);
        try {
//			double[][] matrix = new double[this.dimRow][this.dimCol];
//			double[][] fcmatrix = new double[this.dimRow][this.dimCol];
//			for(int i=0; i<this.dimRow; i++) {
//				for(int j=0; j<this.dimCol; j++) {
//					matrix[i][j] = 0;
//					fcmatrix[i][j] = 0;
//				}
//			}
//
//			for(InteractionVo vo : this.rawInteractionVoList) {
//				int iRow = vo.getBin1_idx();
//				int iCol = vo.getBin2_idx();
//
//				try {
//					matrix[iRow][iCol] = vo.getCount();
//					fcmatrix[iRow][iCol] = vo.getFoldChange();
//				}catch(Exception e){
//					System.err.println("over dimension");
//				}
//			}

			int colvolutionDimension = (int)( this.resolution / 1000 );
			
			double[][] convolutionMatrix = new double[colvolutionDimension][colvolutionDimension];
			for(int i=0; i<convolutionMatrix.length; i++) {
				for(int j=0; j<convolutionMatrix[0].length; j++) {
					convolutionMatrix[i][j] = 1;
				}
			}

			this.output = Utils.convolution2DV21( this.matrix, convolutionMatrix, this.matIndex,  this.resolution/1000 );
			this.fcOutput = Utils.convolution2DV21( this.fcmatrix, convolutionMatrix, this.matIndex, this.resolution/1000 );
        } catch (Exception e) {
        	;
        } finally {
            System.out.println(name + ":MyTask:END:context = " + context);
        }
    }
    
	public double[] getCountOutput() {
		return this.output;
	}
	
	public double[] getFoldChangeOutput() {
		return this.fcOutput;
	}
	
	public int getResolution() {
		return this.resolution;
	}
}