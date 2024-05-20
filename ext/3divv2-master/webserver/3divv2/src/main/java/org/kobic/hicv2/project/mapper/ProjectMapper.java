package org.kobic.hicv2.project.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.kobic.hicv2.cancerhic.obj.ChromBinObj;
import org.kobic.hicv2.project.vo.DownloadFileVo;
import org.kobic.hicv2.project.vo.GeneLocusVo;
import org.kobic.hicv2.project.vo.GeneVo;
import org.springframework.stereotype.Repository;

@Repository(value = "projectMapper")
public interface ProjectMapper {
	public List<GeneLocusVo> getGeneLocus4AutoComplete(String keyword);
	public List<GeneLocusVo> getOptionGeneAutoComplete( Map<String, Object> map );
	public List<GeneLocusVo> getOptionGene( List<String> list );
	public List<GeneVo> getGencodeV34Genes(List<ChromBinObj> regions);
	public List<GeneVo> getRefseqGenes(List<ChromBinObj> regions);
	public List<DownloadFileVo> getDownloadFileList(@Param(value="keyword") String keyword);
}
