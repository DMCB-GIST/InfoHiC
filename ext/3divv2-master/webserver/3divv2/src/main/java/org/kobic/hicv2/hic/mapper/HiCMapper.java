package org.kobic.hicv2.hic.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.kobic.hicv2.hic.vo.EpigenomicsVo;
import org.kobic.hicv2.hic.vo.GeneVo;
import org.kobic.hicv2.hic.vo.H1EscTadVo;
import org.kobic.hicv2.hic.vo.HeatMapVo;
import org.kobic.hicv2.hic.vo.InteractionVo;
import org.kobic.hicv2.hic.vo.LocusVo;
import org.kobic.hicv2.hic.vo.SampleVo;
import org.kobic.hicv2.hic.vo.SuperEnhancerVo;
import org.springframework.stereotype.Repository;

@Repository(value = "hicMapper")
public interface HiCMapper {
	public List<LocusVo> getLocusInfo( Map<String, String> paramMap );
	public List<GeneVo> getGene( Map<String, Object> paramMap);
	public List<GeneVo> getGencode( Map<String, Object> paramMap );
	public List<HeatMapVo> getHeatMapData( Map<String, String> paramMap);
	public List<SampleVo> getSampleList();
	public List<SampleVo> getSampleListPcHiCTest();
	public String getTableName(Map<String, String> map);
	public List<String> getAutoCompleteGeneSymbol(Map<String, String> paramMap);
	public List<InteractionVo> getInteractionLast(Map<String, String> paramMap);
	public List<H1EscTadVo> getTadInfo(Map<String, String> paramMap);
	public List<SuperEnhancerVo> getEnhancerInfo (Map<String, String> paramMap);
	public List<SuperEnhancerVo> getPairwiseEnhancerInfo (Map<String, String> paramMap);
	public List<EpigenomicsVo> getEpigenomics(Map<String, String> map);
	public String getExistTable(String tableName);
	public String getExistEpigenome(String tableName);
	public int getBinningType(@Param(value="tableName") String tableName);
	public String getBinningTableName(@Param(value="tableName") String tableName);
	public int getBinningPosition(Map<String, String> paramMap);
	public List<String> getGenePromoter( Map<String, Object> paramMap);
	public List<String> getGenePromoterHG19( Map<String, Object> paramMap);
	public List<GeneVo> getGeneName( String geneName);
	public List<GeneVo> getGeneNameHG19( String geneName);
	public List<HeatMapVo> getHeatMapRawData( Map<String, String> paramMap );
	public List<InteractionVo> getInteractions4Convolution( Map<String, Object> paramMap );
	public String getExistTad(@Param(value="sample_name") String sample_name);
	
	public List<Map<String, Object>> getCharacteristicTypeInit();
	public List<Map<String, String>> getCharacteristicNameInit(Map<String, String> paramMap);
	public List<Map<String, Object>> getCharacteristicProperty( @Param(value="name") String name );
	public SampleVo getOnlyOneSample(@Param(value="sampleId") String sampleId);
	public List<String> getAutocompleteHicSamples( @Param(value="keyword") String keyword );
	public List<Map<String, String>> getCharacteristicSampleList( Map<String, String> paramMap );
}
