package org.kobic.hicv2.capturehic.mapper;

import java.util.List;
import java.util.Map;

import org.kobic.hicv2.capturehic.vo.BinFragmentVo;
import org.kobic.hicv2.capturehic.vo.CapturedHiCVo;
import org.kobic.hicv2.capturehic.vo.CapturedSampleVo;
import org.kobic.hicv2.capturehic.vo.GeneStructureVo;
import org.kobic.hicv2.hic.vo.LocusVo;
import org.springframework.stereotype.Repository;

@Repository(value = "captureHiCMapper")
public interface CaptureHiCMapper {
	public List<LocusVo> getLocusInfo( Map<String, String> paramMap );
	public List<CapturedHiCVo> getCapturedHiCData( Map<String, Object> paramMap );
	public BinFragmentVo getBinStartPos(Map<String, String> paramMap);
	public List<CapturedSampleVo> getSampleList();
	public List<GeneStructureVo> getGene(Map<String, Object> paramMap);
	public List<GeneStructureVo> getGencode(Map<String, Object> paramMap);
	public List<CapturedSampleVo> getCaptureHiCDownloadList();
	public List<CapturedHiCVo> getCapturedHiCData4Smoothing(Map<String, Object>paramMap);
	public List<String> getAutoCompleteGeneSymbolHg19(Map<String, String> paramMap);
}
