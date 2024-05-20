package org.kobic.hicv2.cancerhic.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.kobic.hicv2.cancerhic.vo.GeneWithBinVo;
import org.kobic.hicv2.cancerhic.vo.GenomeLengthVo;
import org.kobic.hicv2.cancerhic.vo.InteractionSparseMatV2Vo;
import org.kobic.hicv2.cancerhic.vo.InteractionSparseMatVo;
import org.kobic.hicv2.cancerhic.vo.PreFoundedSvVo;
import org.kobic.hicv2.cancerhic.vo.SampleInfoVo;
import org.kobic.hicv2.cancerhic.vo.StudyInfoVo;
import org.kobic.hicv2.hic.vo.SuperEnhancerVo;
import org.springframework.stereotype.Repository;

@Repository(value = "cancerHiCMapper")
public interface CancerHiCMapper {
//	public List<InteractionVo> getAnyInteractions500k(Map<String, Object> params);
	public List<InteractionSparseMatVo> getAnyInteractions500kMat(Map<String, Object> params);
	public List<InteractionSparseMatV2Vo> getAnyInteractions500kMatV3(Map<String, Object> params);
	public List<SampleInfoVo> getSampleList(Map<String, String> params);
	public SampleInfoVo getSampleTableName(Map<String, String> params);
	public List<String> getChromosomeList();
	public List<GenomeLengthVo> getGenomeSizeHg18();
	public List<PreFoundedSvVo> getPreCalledSV( Map<String, Object> params );
	public List<SuperEnhancerVo> getSuperEnhancer( Map<String, Object> params );
	public List<GeneWithBinVo> getGencodeV34Genes( Map<String, Object> params );
	public List<GeneWithBinVo> getRefseqHG38Genes( Map<String, Object> params );
	public List<StudyInfoVo> getStudyInfo();
	public List<Map<String, String>> getCharacteristicsSample( Map<String, String> params );
	public List<PreFoundedSvVo> getPreCalledSVBySampleId( @Param("sampleIds") List<String> sampleIds );
}