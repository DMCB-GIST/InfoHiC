package org.kobic.hicv2.project.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.kobic.hicv2.cancerhic.obj.ChromBinObj;
import org.kobic.hicv2.project.mapper.ProjectMapper;
import org.kobic.hicv2.project.vo.DownloadFileVo;
import org.kobic.hicv2.project.vo.GeneLocusVo;
import org.kobic.hicv2.project.vo.GeneVo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service(value = "projectService")
public class ProjectService {
	private static final Logger logger = LoggerFactory.getLogger(ProjectService.class);
	
	@Resource(name = "projectMapper")
	private ProjectMapper projectMapper;
	
	public List<GeneLocusVo> getGeneLocus4AutoComplete(String keyword){
		return this.projectMapper.getGeneLocus4AutoComplete(keyword);
	}
	
	public List<GeneLocusVo> getOptionGeneAutoComplete(String keyword, String[] dbArray) {
		List<String> dbList = new ArrayList<String>();
		
		for( int i=0; i< dbArray.length; i++ ) {
			dbList.add( dbArray[i] );
		}
		
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("keyword", keyword);
		map.put("dbList", dbList);
		
		return this.projectMapper.getOptionGeneAutoComplete( map );
	}
	
	public List<GeneLocusVo> getOptionGene( String[] array ) {
		List<String> list = new ArrayList<String>();
		
		for( int i=0; i< array.length; i++ ) {
			list.add( array[i] );
		}
		
		return this.projectMapper.getOptionGene( list );
	}
	
	public List<GeneVo> getGencodeV34Genes(List<ChromBinObj> regions){
		return this.projectMapper.getGencodeV34Genes(regions);
	}

	public List<GeneVo> getRefseqGenes(List<ChromBinObj> regions){
		return this.projectMapper.getRefseqGenes(regions);
	}
	
	public List<DownloadFileVo> getDownloadFileList(String keyword){
		return this.projectMapper.getDownloadFileList(keyword);
	}
}
