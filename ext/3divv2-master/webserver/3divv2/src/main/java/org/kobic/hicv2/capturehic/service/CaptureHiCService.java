package org.kobic.hicv2.capturehic.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.kobic.hicv2.capturehic.mapper.CaptureHiCMapper;
import org.kobic.hicv2.capturehic.vo.BinFragmentVo;
import org.kobic.hicv2.capturehic.vo.CapturedHiCVo;
import org.kobic.hicv2.capturehic.vo.CapturedSampleVo;
import org.kobic.hicv2.capturehic.vo.GeneStructureVo;
import org.kobic.hicv2.hic.vo.LocusVo;
import org.springframework.stereotype.Service;

@Service(value = "captureHiCService")
public class CaptureHiCService {
	@Resource(name = "captureHiCMapper")
	private CaptureHiCMapper captureHiCMapper;

	public List<CapturedHiCVo> getCapturedHiCData(Map<String, Object> paramMap) {
		return this.captureHiCMapper.getCapturedHiCData(paramMap);
	}
	
	public BinFragmentVo getBinStartPos( String chrom, int pos ) {
		Map<String, String> paramMap = new LinkedHashMap<String, String>();
		paramMap.put("chrom", chrom);
		paramMap.put("pos", Integer.toString(pos) );

		return this.captureHiCMapper.getBinStartPos(paramMap);
	}
	
	public List<CapturedSampleVo> getSampleList() {
		return this.captureHiCMapper.getSampleList();
	}
	
	public List<GeneStructureVo> getGeneData( Map<String, Object> paramMap ) {
		List<GeneStructureVo> lst = this.captureHiCMapper.getGene(paramMap);
		for( GeneStructureVo vo : lst ) vo.makeExonObjects();

		return lst;
	}
	
	public List<GeneStructureVo> getGencodeData( Map<String, Object> paramMap ) {
		List<GeneStructureVo> lst = this.captureHiCMapper.getGencode(paramMap);

		return lst;
	}
	
	public List<CapturedSampleVo> getCaptureHiCDownloadList(){
		return this.captureHiCMapper.getCaptureHiCDownloadList();
	};
	
	public List<CapturedHiCVo> getCapturedHiCData4Smoothing(Map<String, Object> paramMap){
		return this.captureHiCMapper.getCapturedHiCData4Smoothing(paramMap);
	}
	
	public static List<CapturedHiCVo> convolution(List<CapturedHiCVo> lst) {
		for(int i=0; i < (lst.size() / 2) + 1; i++) {
			int leftIndex = i;

			int rightIndex = lst.size()-(i+1);
			
			if( leftIndex > rightIndex ) break;
			
			lst.get(leftIndex).setSmoothed_all_capture_res( CaptureHiCService.convolution(lst, leftIndex, false) );
			lst.get(leftIndex).setSmoothed_freq( CaptureHiCService.convolution(lst, leftIndex, true) );

			lst.get(rightIndex).setSmoothed_all_capture_res( CaptureHiCService.convolution(lst, rightIndex, false) );
			lst.get(rightIndex).setSmoothed_freq( CaptureHiCService.convolution(lst, rightIndex, true) );
		}
		
		return lst;
	}
	
	public static float convolution(List<CapturedHiCVo> lst, int base, boolean doRawFreq) {
		float nVal = 0;
		if( base-2 >=0 )			nVal += 0.05 * ( doRawFreq ? lst.get( base - 2 ).getFreq()	:	lst.get( base - 2 ).getAll_capture_res());
		if( base-1 >= 0 )			nVal += 0.15 * ( doRawFreq ? lst.get( base - 1 ).getFreq()	:	lst.get( base - 1 ).getAll_capture_res());
		lst.get( base );			nVal += 0.60 * ( doRawFreq ? lst.get(base).getFreq()		:	lst.get( base + 0 ).getAll_capture_res());
		if( base+1 < lst.size() )	nVal += 0.15 * ( doRawFreq ? lst.get(base + 1).getFreq()	:	lst.get( base + 1 ).getAll_capture_res());
		if( base+2 < lst.size() )	nVal += 0.05 * ( doRawFreq ? lst.get(base + 2).getFreq()	:	lst.get( base + 2 ).getAll_capture_res());
		
		return nVal;
	}

	public static void main(String[] args) {
		List<CapturedHiCVo> lst = new ArrayList<CapturedHiCVo>();
		
		CapturedHiCVo vo1 = new CapturedHiCVo();
		CapturedHiCVo vo2 = new CapturedHiCVo();
		CapturedHiCVo vo3 = new CapturedHiCVo();
		CapturedHiCVo vo4 = new CapturedHiCVo();
		CapturedHiCVo vo5 = new CapturedHiCVo();
		CapturedHiCVo vo6 = new CapturedHiCVo();
		CapturedHiCVo vo7 = new CapturedHiCVo();
		CapturedHiCVo vo8 = new CapturedHiCVo();
		CapturedHiCVo vo9 = new CapturedHiCVo();
		CapturedHiCVo vo10 = new CapturedHiCVo();
		
		lst.add( vo1 );
		lst.add( vo2 );
		lst.add( vo3 );
		lst.add( vo4 );
		lst.add( vo5 );
		lst.add( vo6 );
		lst.add( vo7 );
		lst.add( vo8 );
		lst.add( vo9 );
		lst.add( vo10 );
		
		vo1.setAll_capture_res(0);
		vo2.setAll_capture_res(1);
		vo3.setAll_capture_res(2);
		vo4.setAll_capture_res(3);
		vo5.setAll_capture_res(2);
		vo6.setAll_capture_res(1);
		vo7.setAll_capture_res(0);
		vo8.setAll_capture_res(1);
		vo9.setAll_capture_res(2);
		vo10.setAll_capture_res(1);

		CaptureHiCService.convolution(lst);
	}
	
	public List<String> getAutoCompleteGeneSymbolHg19( String keyword ) {
		Map<String, String> paramMap = new HashMap<String, String>();
		paramMap.put("symbol", keyword);
		paramMap.put("length", Integer.toString( keyword.length() ) );

		return this.captureHiCMapper.getAutoCompleteGeneSymbolHg19( paramMap );
	}
	
	public List<LocusVo> getLociOfTssInSpecificGene( String param ) {
		Map<String, String> paramMap = new HashMap<String, String>();
		paramMap.put("name", param);

		return this.captureHiCMapper.getLocusInfo(paramMap);
	}
}
