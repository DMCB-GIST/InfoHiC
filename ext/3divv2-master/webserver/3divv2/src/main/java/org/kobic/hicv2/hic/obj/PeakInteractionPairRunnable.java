package org.kobic.hicv2.hic.obj;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CountDownLatch;

import org.kobic.hicv2.hic.mapper.HiCMapper;
import org.kobic.hicv2.hic.vo.InteractionVo;
import org.kobic.hicv2.util.Utils;


public class PeakInteractionPairRunnable implements Runnable {
    private final CountDownLatch doneLatch;
    private final int context;
    
    private int BASE_WINDOW_SIZE;
    private int pos;
    private String chrom;
    private String boundaryRange;
    private String tableName;
    private int windowSize;
    private double peakValue;
    private int startPt;
    private int endPt;
    private List<InteractionVo> interpolatedInteractionPairList;
    
    private HiCMapper projectMapper;
    private Map<String, Object> retMap;
    
    public PeakInteractionPairRunnable(CountDownLatch doneLatch, int context, HiCMapper projectMapper, String chrom, int pos, int windowSize, int BASE_WINDOW_SIZE, int startPt, int endPt, String tableName, String boundaryRange) {
        this.doneLatch = doneLatch;
        this.context = context;
 
        this.chrom = chrom;
        this.pos = pos;
        this.startPt = startPt;
        this.endPt = endPt;
        this.windowSize = windowSize;
        this.tableName = tableName;
        this.boundaryRange = boundaryRange;
        this.projectMapper = projectMapper;
        this.BASE_WINDOW_SIZE = BASE_WINDOW_SIZE;
    }
    
    public double getPeakValue() {
    	return this.peakValue;
    }
    
    public Map<String, Object> getReturnMap() {
    	return this.retMap;
    }
    
    public int getWindowSize() {
    	return this.windowSize;
    }
    
    public void run() {
        doTask();
        doneLatch.countDown(); //처리가 끝날때마다 값을 내려 Main 의 TASKS의 값을 다운 시킨다.
    }
    
    protected void doTask() {
//        String name = Thread.currentThread().getName();
//        System.out.println(name + ":MyTask:BEGIN:context = " + context);
        try {
//        	long a = System.currentTimeMillis();
			List<Integer> val = this.getSquareMatrixAreas(this.windowSize, this.BASE_WINDOW_SIZE, this.pos);

			int bin1Min = Collections.min(val);
			int bin1Max = Collections.max(val);
			Map<String, Object> paramMap = new HashMap<String, Object>();
			paramMap.put("chrom", this.chrom);
			paramMap.put("pos", this.pos);
			paramMap.put("boundary", this.boundaryRange);
			paramMap.put("list", val);
			paramMap.put("tableName", this.tableName);

			System.out.println("database call : " + this.context);
			List<InteractionVo> interactionPairList = this.projectMapper.getInteractions4Convolution(paramMap);

			this.interpolatedInteractionPairList = this.getInterpolatedInteractionPairs( interactionPairList, bin1Min, bin1Max, this.startPt, this.endPt, this.windowSize, this.chrom );

			this.peakValue = PeakInteractionPairRunnable.getPeakValue(this.interpolatedInteractionPairList);
			
			this.retMap = new HashMap<String, Object>();
			this.retMap.put("bait", this.pos);
			this.retMap.put("startPt", this.startPt);
			this.retMap.put("endPt", this.endPt);
			this.retMap.put("windowSize", this.windowSize);
			this.retMap.put("boundaryRange", this.boundaryRange);
			this.retMap.put("interactionPairs", this.interpolatedInteractionPairList );
			this.retMap.put("peakValue", this.peakValue );
			
//			long b = System.currentTimeMillis();
//			
//			System.out.println(this.context + "   ===================> " + ((float)(b-a)/1000) + "sec");
        } catch (Exception e) {
        	;
        } finally {
//            System.out.println(name + ":MyTask:END:context = " + context);
        }
    }
    
	private List<InteractionVo> getInterpolatedInteractionPairs( List<InteractionVo> list, int bin1Min, int bin1Max, int startPt, int endPt, int windowSize, String chr ) {
		int nRow = (bin1Max - bin1Min + 1000)/1000;
		int nCol = (endPt - startPt + 1000)/1000;
		double[][] matrix = new double[nRow][nCol];
		double[][] fcMatrix = new double[nRow][nCol];
		for(int i=0; i<nRow; i++) {
			for(int j=0; j<nCol; j++) {
				matrix[i][j] = 0;
				fcMatrix[i][j] = 0;
			}
		}

//		System.out.println( "List size = " + list.size() );
		for(InteractionVo vo : list) {
			int iRow = (vo.getBin1() - bin1Min) / 1000;
			int iCol = (vo.getBin2() - startPt) / 1000;

			try {
				matrix[iRow][iCol] = vo.getCount();
				fcMatrix[iRow][iCol] = vo.getFoldChange();
			}catch(Exception e){}
		}
//		System.out.println( "Matrix sum = " + Utils.sum(matrix) );
		
		double[][] convolutionMatrix = new double[nRow][nRow];
		for(int i=0; i<convolutionMatrix.length; i++) {
			for(int j=0; j<convolutionMatrix[0].length; j++) {
				convolutionMatrix[i][j] = 1;
			}
		}

		double[] output = Utils.convolution2D( matrix, convolutionMatrix );
		double[] output2 = Utils.convolution2D( fcMatrix, convolutionMatrix );

//		System.out.println( "Output sum = " + Utils.sum(output) );
		
		List<InteractionVo> newList = new ArrayList<InteractionVo>();
		for(int i=0; i<output.length; i++) {
			InteractionVo vo = new InteractionVo();
			vo.setBin1(bin1Min);
			vo.setBin2( (i*1000) + startPt );
			vo.setChr( chr );
			vo.setCount( output[i] / Math.pow(windowSize / 1000, 2) );
			vo.setFoldChange( output2[i] / Math.pow(windowSize / 1000, 2) );

			newList.add(vo);
		}

		return newList;
	}
    
	private static double getPeakValue( List<InteractionVo> lst ) {
		if( lst != null && lst.size() > 0 ) {
			double max = lst.get(0).getCount(); 
			for( int i=1; i<lst.size(); i++) {
				if( max < lst.get(i).getCount() ) max = lst.get(i).getCount();
			}
			return max;
		}
		return 0;
	}
	
	private static double getFoldChangePeakValue( List<InteractionVo> lst ) {
		if( lst != null && lst.size() > 0 ) {
			double max = lst.get(0).getFoldChange(); 
			for( int i=1; i<lst.size(); i++) {
				if( max < lst.get(i).getFoldChange() ) max = lst.get(i).getFoldChange();
			}
			return max;
		}
		return 0;
	}
    
	private List<Integer> getSquareMatrixAreas( int ws, int BASE_WINDOW_SIZE, int basePos ) {
		List<Integer> boundaryList = new ArrayList<Integer>();
		int lowerBoundaryOfWindow = -1 * (int)((float)ws / (2*BASE_WINDOW_SIZE)) * BASE_WINDOW_SIZE;
		int upperBoundaryOfWindow = ws + lowerBoundaryOfWindow - 1;

		System.out.println( "          ( window size : " + ws + ")    =================> " + lowerBoundaryOfWindow + " " + upperBoundaryOfWindow + " <==============    " + "    " + BASE_WINDOW_SIZE + "    " + basePos);
		for(int boundary=lowerBoundaryOfWindow; boundary<=upperBoundaryOfWindow; boundary+=BASE_WINDOW_SIZE) {
			int val = basePos + boundary;
			boundaryList.add( val );
		}

		return boundaryList;
	}
}