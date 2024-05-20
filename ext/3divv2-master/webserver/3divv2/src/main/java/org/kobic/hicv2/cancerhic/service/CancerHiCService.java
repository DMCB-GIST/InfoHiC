package org.kobic.hicv2.cancerhic.service;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.EmptyStackException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.zip.DataFormatException;

import javax.annotation.Resource;

import org.kobic.hicv2.cancerhic.mapper.CancerHiCMapper;
import org.kobic.hicv2.cancerhic.obj.ChromBinObj;
import org.kobic.hicv2.cancerhic.obj.InteractionItemObj;
import org.kobic.hicv2.cancerhic.obj.MatrixItemListObj;
import org.kobic.hicv2.cancerhic.obj.QueryObject;
import org.kobic.hicv2.cancerhic.obj.SampleParamObj;
import org.kobic.hicv2.cancerhic.vo.GeneWithBinVo;
import org.kobic.hicv2.cancerhic.vo.GenomeLengthVo;
import org.kobic.hicv2.cancerhic.vo.InteractionSparseMatV2Vo;
import org.kobic.hicv2.cancerhic.vo.PreFoundedSvVo;
import org.kobic.hicv2.cancerhic.vo.SampleInfoVo;
import org.kobic.hicv2.cancerhic.vo.StudyInfoVo;
import org.kobic.hicv2.hic.vo.SuperEnhancerVo;
import org.kobic.hicv2.parser.BooleanParserBase;
import org.kobic.hicv2.parser.ParserException;
import org.kobic.hicv2.parser.booleanPostfixParser.BooleanParserPostfixStack;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service(value = "cancerHiCService")
public class CancerHiCService {
	private static final Logger logger = LoggerFactory.getLogger(CancerHiCService.class);
	
	@Resource(name = "cancerHiCMapper")
	private CancerHiCMapper cancerHiCMapper;

	private static int getBinLength( List<ChromBinObj> regions ) {
		int sum = 0;
		for(ChromBinObj obj : regions) {
			sum += (obj.getChromEnd() - obj.getChromStart() + 1) / ChromBinObj._40K_;
		}
		return sum;
	}

	private int match2PerfectResolution( List<ChromBinObj> regions, List<SampleParamObj> samples, int resolution ) {
		int binDepth = CancerHiCService.getBinLength(regions);
		logger.debug("binDepth : " + binDepth );
		
//		if( resolution == ChromBinObj._40K_ && binDepth > 500) {
		if( binDepth > 1000 ) {
			logger.debug( "Resolution is downsized");
			SampleInfoVo sampleInfo = this.getSampleTableName( samples.get(0).getSample(), ChromBinObj._500K_ );

			for(ChromBinObj obj : regions)		obj.setBinSize( ChromBinObj._500K_ );
			for(SampleParamObj vo : samples)	vo.setTable( sampleInfo.getTable_name() );
			
			return ChromBinObj._500K_;
//		}else if( resolution == ChromBinObj._500K_ && binDepth <= 500 ) {
		}else{
			SampleInfoVo sampleInfo = this.getSampleTableName( samples.get(0).getSample(), ChromBinObj._40K_ );

			for(ChromBinObj obj : regions)		obj.setBinSize( ChromBinObj._40K_ );
			for(SampleParamObj vo : samples)	vo.setTable( sampleInfo.getTable_name() );
			
			return ChromBinObj._40K_;
		}
		
//		return resolution;
	}

	public Map<String, Object> getAnyInteractions500kNewTechV3( List<ChromBinObj> regions, List<SampleParamObj> samples, double threshold, String getDataType, int resolution ) throws UnsupportedEncodingException, DataFormatException {
		int optimizedResolution = this.match2PerfectResolution( regions, samples, resolution );

		Map<String, Object> params = new LinkedHashMap<String, Object>();
		params.put("regions", regions);

		Map<String, Object> retMap = new LinkedHashMap<String, Object>();
		for(SampleParamObj sample : samples) {
			if( retMap.containsKey( sample.getSample() ) ) continue;

			params.put("sample", sample);

			Map<String, Object> innerMap = CancerHiCService.make2MatrixObjNewTechV2(CancerHiCService.list2MapNewTechV2( this.cancerHiCMapper.getAnyInteractions500kMatV3(params) ), regions, threshold, getDataType, optimizedResolution);
			innerMap.put("sampleId", sample.getSample() );

			retMap.put( sample.getSample(), innerMap );
		}

		return retMap;
	}

	private static double[][] getMat( List<List<Double>> lst ) {
		int nRow = lst.size();
		int nCol = lst.get(0).size();
		for( int i=1; i<lst.size(); i++ ) {
			if( nCol != lst.get(i).size() ) {
				logger.error("Warning : coloumn size is diferedn");
			}
		}
		
		double[][] mat = new double[nRow][nCol];
		for( int i=0; i<lst.size(); i++ ) {
			for(int j=0; j<lst.get(i).size(); j++) {
				double val = lst.get(i).get(j);

				mat[i][j] = val;
			}
		}
		
//		for(int i=0; i<nRow; i++) {
//			for(int j=i+1; j<nCol; j++) {
//				if( mat[i][j] != mat[j][i] ) {
//					logger.info( "" + mat[i][j] + " vs " + mat[j][i] + "  (" + i + "," + j + ")");
//				}
//			}
//		}
		
		return mat;
	}
	
	private static List<InteractionSparseMatV2Vo> filterV2( List<InteractionSparseMatV2Vo> lst, long sRow, long eRow ) {
		if( lst == null ) return lst;

		List<InteractionSparseMatV2Vo> retLst = lst
		  .stream()
		  .filter(c -> sRow <= c.getCurrent_row() && c.getCurrent_row() <= eRow )
		  .collect(Collectors.toList());
		
		return retLst;
//
//
//		List<InteractionSparseMatVo> retLst = new ArrayList<InteractionSparseMatVo>();
//		for( InteractionSparseMatVo vo : lst ) {
//			if( sRow <= vo.getCurrent_row() && vo.getCurrent_row() <= eRow ) {
//				retLst.add( vo );
//			}
//		}
//		return retLst;
	}
	
//	private static Map<String, Object> make2MatrixObjNewTechV2Bak( Map<String, List<InteractionSparseMatV2Vo>> map, List<ChromBinObj> regions, double threshold, String getDataType ) {
//		int cumRow = 0;
//		Map<String, Integer> chromeBinSize = new LinkedHashMap<String, Integer>();
//		List<MatrixItemListObj> itemList = new ArrayList<MatrixItemListObj>();
//		
//		if( threshold == 0 ) threshold = 0.5;
//		
//		logger.debug("============================================ START proc data from Database ===============================================");
//		double totalMax = Double.MIN_VALUE;
//		for(int i=0; i<regions.size(); i++) {
//			ChromBinObj frontChrom = regions.get(i);
//			
//			int cumCol = 0;
//			int prevRowSize = 0;
//			int prevColSize = 0;
//
//			for( int j = 0; j<regions.size(); j++ ) {
//				ChromBinObj endChrom = regions.get(j);
//				String chromPair = frontChrom.getChrom() + "-" + endChrom.getChrom();
//				List<InteractionSparseMatV2Vo> lst = CancerHiCService.filterV2( map.get( chromPair ), frontChrom.getStartBin(), frontChrom.getEndBin() );
//
//				logger.debug("=============================> " + chromPair + " " + frontChrom.getStartBin() + "  " + frontChrom.getEndBin() + "    vs    " + endChrom.getStartBin() + "  " + endChrom.getEndBin() );
//
//				if( i == j )	chromeBinSize.put( frontChrom.getChrom() + "-" + i, (int)(frontChrom.getEndBin() - frontChrom.getStartBin() + 1) );
//
//				int iRow = cumRow;
// 				for(InteractionSparseMatV2Vo vo : lst) {
//					List<InteractionItemObj> vector = vo.getVector();
//
//					int newIrow = iRow + vo.getCurrent_row();
////					logger.debug( "" + vo.getCurrent_row() + " ==> " + newIrow );
//					int iCol = cumCol;
//					for(InteractionItemObj obj : vector) {
//						if( obj.getBin() >= endChrom.getStartBin() && obj.getBin() <= endChrom.getEndBin() ) {
//							int newIcol = (int) (iCol + ( obj.getBin() - endChrom.getStartBin() ));
//
////							if( newIcol <= iRow && obj.getValue() > threshold ){
//							if( newIcol <= newIrow && obj.getValue() > threshold ){
////								itemList.add( new MatrixItemListObj( frontChrom.getChrom(), endChrom.getChrom(), iRow, newIcol, obj.getValue()) );
//								itemList.add( new MatrixItemListObj( frontChrom.getChrom(), endChrom.getChrom(), newIrow, newIcol, obj.getValue()) );
//								double max = obj.getValue();
//								if( max > totalMax ) totalMax = max;
//							}
//						}
//					}
//
//					prevColSize = (int)(endChrom.getEndBin() - endChrom.getStartBin() + 1);
////					iRow++;
//				}
//				cumCol += prevColSize;
//				prevRowSize = (int)(frontChrom.getEndBin() - frontChrom.getStartBin() + 1);
//			}
//			cumRow += prevRowSize;
//		}
//
//		logger.info("nRow : " + cumRow );
//		Map<String, Object> retMap = new LinkedHashMap<String, Object>();
//		retMap.put("data", itemList);
//		retMap.put("nRow", cumRow);
//		retMap.put("nCol", cumRow);
//		retMap.put("genomeSize", chromeBinSize);
//		retMap.put("maxValue", totalMax);
//		logger.debug("Finish==================================>");
//
//		// upper triangle matrix : 784,513
//		// all matrix :          1,577,536
//		
//		return retMap;
//	}
	
	private static Map<String, Object> make2MatrixObjNewTechV2( Map<String, List<InteractionSparseMatV2Vo>> map, List<ChromBinObj> regions, double threshold, String getDataType, int resolution ) {
		Map<String, Integer> chromeBinSize = new LinkedHashMap<String, Integer>();
		List<MatrixItemListObj> itemList = new ArrayList<MatrixItemListObj>();
		
		if( resolution == ChromBinObj._40K_ )	threshold = 0.5;
		else									threshold = 0.01;
		
		logger.debug("============================================ START proc data from Database ===============================================");
		double totalMax = Double.MIN_VALUE;

		int inputQueryGenomicLength = 0;
		List<Integer> v = new ArrayList<Integer>();
		int currentCol = 0;
		int currentRow = 0;
		for(int i=0; i<regions.size(); i++) {
			ChromBinObj frontChrom = regions.get(i);

			chromeBinSize.put( frontChrom.getChrom() + "-" + i, (int)(frontChrom.getEndBin() - frontChrom.getStartBin() + 1) );
			
			inputQueryGenomicLength += (frontChrom.getChromEnd() - frontChrom.getChromStart() + 1);

			currentCol = 0;
			for( int j = 0; j<regions.size(); j++ ) {
				ChromBinObj endChrom = regions.get(j);
				String chromPair = frontChrom.getChrom() + "-" + endChrom.getChrom();
				List<InteractionSparseMatV2Vo> lst = CancerHiCService.filterV2( map.get( chromPair ), frontChrom.getStartBin(), frontChrom.getEndBin() );

				logger.debug("=============================> " + chromPair + " " + frontChrom.getStartBin() + "  " + frontChrom.getEndBin() + "    vs    " + endChrom.getStartBin() + "  " + endChrom.getEndBin() );

				if( lst != null ) {
					for( InteractionSparseMatV2Vo vo : lst ) {
						List<InteractionItemObj> vector = vo.getVector();
						
						for(InteractionItemObj obj : vector) {
							if( obj.getBin() >= endChrom.getStartBin() && obj.getBin() <= endChrom.getEndBin() ) {
								int iRow = (int)(currentRow + vo.getCurrent_row() - frontChrom.getStartBin());
								int iCol = (int)(currentCol + obj.getBin() - endChrom.getStartBin());
								if( iCol <= iRow && obj.getValue() >= threshold ) {
//									if( resolution == ChromBinObj._500K_ ){
									if( v.indexOf( (int)(obj.getValue()) ) == -1 )	v.add( (int)(obj.getValue()) );
//									}
	
									itemList.add( new MatrixItemListObj( frontChrom.getChrom(), endChrom.getChrom(), iRow, iCol, obj.getValue()) );
	
									double max = obj.getValue();
									if( max > totalMax ) totalMax = max;
								}
							}
						}
					}
				}
				currentCol += (endChrom.getEndBin() - endChrom.getStartBin() + 1);
			}
			currentRow += (frontChrom.getEndBin() - frontChrom.getStartBin() + 1);
		}
		
		// chromosome1 length : 248,956,422
		float maxBaseChromLenght = 248956422f;
		
		double ratio = (maxBaseChromLenght / inputQueryGenomicLength) > 1f ? 0.6d/(maxBaseChromLenght / inputQueryGenomicLength) : ((1 - ((maxBaseChromLenght/3) / inputQueryGenomicLength)) * 0.6d);
		// input 커지면 => 작은값(min:0, max: 1) --> 248956422f / (chr1 + chr2)   0 ~ 0.6
		// input 작으면 => 큰값 (min:1, max : Inf) --> 248956422f / chr6		  0.6/1 ~ 0.6/10.2

		double median = -1;
//		if( resolution == ChromBinObj._500K_ && v.size() > 0 ){
		if( v.size() > 0 ){
			Collections.sort( v );

			logger.debug("===================================>>>>>> " + ratio + " <<<< ======================= " + inputQueryGenomicLength);
			median = v.get( (int)( v.size() * (0.4 + (0.6-ratio)) ) );
		}

		logger.info("nRow : " + currentRow + " vs nCol : " + currentCol );
		Map<String, Object> retMap = new LinkedHashMap<String, Object>();
		retMap.put("data", itemList);
		retMap.put("nRow", currentRow);
		retMap.put("nCol", currentCol);
		retMap.put("genomeSize", chromeBinSize);
		retMap.put("maxValue", totalMax);
		retMap.put("median", median);
		retMap.put("resolution", resolution);
		logger.debug("Finish==================================>" + totalMax);

		// upper triangle matrix : 784,513
		// all matrix :          1,577,536
		
		return retMap;
	}
	
	private static Map<String, List<InteractionSparseMatV2Vo>> list2MapNewTechV2( List<InteractionSparseMatV2Vo> voList ) throws UnsupportedEncodingException, DataFormatException {
		Map<String, List<InteractionSparseMatV2Vo>> mat = new LinkedHashMap<String, List<InteractionSparseMatV2Vo>>();

		logger.debug("======================== list2MapNewTechV2 =============================");
		for(InteractionSparseMatV2Vo vo : voList) {
			vo.initString2SparseVector();

			String pair = vo.getChrom1() + "-" + vo.getChrom2();
			if( mat.containsKey(pair) )	mat.get(pair).add( vo );
			else {
				List<InteractionSparseMatV2Vo> lst = new ArrayList<InteractionSparseMatV2Vo>();
				lst.add(vo);
				mat.put(pair, lst);
			}
		}
		return mat;
	}
	
	public SampleInfoVo getSampleTableName(String sample, int resolution) {
		Map<String, String> paramMap = new LinkedHashMap<String, String>();
		paramMap.put("sample", sample);
		paramMap.put("resolution", String.valueOf(resolution) );
		
		return this.cancerHiCMapper.getSampleTableName(paramMap);
	}

	public List<SampleInfoVo> getSampleList() {
		return this.cancerHiCMapper.getSampleList( null );
	}
	
	public List<SampleInfoVo> getSampleList(String keyword, String type, String study_id) {
		Map<String, String> paramMap = new LinkedHashMap<String, String>();
//		if( type.equals("case") && keyword == null ) 			keyword = "";
//		else if( type.equals("control") && keyword == null )	keyword = "";

		paramMap.put("keyword", keyword);
		paramMap.put("type", type);
		paramMap.put("study_id", study_id);
		
		return this.cancerHiCMapper.getSampleList( paramMap );
	}
	
	public String evaluateQuery( String query, String type, String study_id ) throws ParserException {
		query = query.replace(" and ", "&");
		query = query.replace(" or ", "|");
		query = query.replace(" not ", "!");
		query = query.replace(" AND ", "&");
		query = query.replace(" OR ", "|");
		query = query.replace(" NOT ", "!");
		query = query.replace("'", "\"");
	
		if( query.trim().equals("") ) throw new ParserException("ERROR : Empty query");

		BooleanParserPostfixStack pps = new BooleanParserPostfixStack( this );
		pps.evaluate( query, type, study_id );

		return "ok";
	}

	public List<SampleInfoVo> doQueryEvaluate( String query, String type, String study_id ) throws EmptyStackException, ParserException {
		if( query != null ) {
			query = query.replace(" and ", "&");
			query = query.replace(" or ", "|");
			query = query.replace(" not ", "!");
			query = query.replace(" AND ", "&");
			query = query.replace(" OR ", "|");
			query = query.replace(" NOT ", "!");
			query = query.replace("'", "\"");
			
			if( query.startsWith("and ") )			query = query.replace("and ", "&");
			else if( query.startsWith("AND ") )		query = query.replace("AND ", "&");
			else if( query.endsWith(" and") )		query = query.replace(" and", "&");
			else if( query.endsWith(" AND") )		query = query.replace(" AND", "&");
	
			if( query.startsWith("or ") )			query = query.replace("or ", "|");
			else if( query.startsWith("OR ") )		query = query.replace("OR ", "|");
			else if( query.endsWith(" or") )		query = query.replace(" or", "|");
			else if( query.endsWith(" OR") )		query = query.replace(" OR", "|");
	
			if( query.startsWith("not ") )			query = query.replace("not ", "!");
			else if( query.startsWith("NOT ") )		query = query.replace("NOT ", "!");
			else if( query.endsWith(" not") )		query = query.replace(" not", "!");
			else if( query.endsWith(" NOT") )		query = query.replace(" NOT", "!");
			
			System.out.println( "=====================================================> " + query );
			
			if( query.trim().equals("") ) throw new ParserException("ERROR : Empty query");
		}

		BooleanParserBase pps = new BooleanParserPostfixStack( this );
		List<SampleInfoVo> list = pps.evaluate( query, type, study_id );

		return list;
	}

	public List<String> getChromosomeList(){
		return this.cancerHiCMapper.getChromosomeList();
	}
	
	public Map<String, GenomeLengthVo> getGenomeSizeHg18(){
		List<GenomeLengthVo> lst = this.cancerHiCMapper.getGenomeSizeHg18();

		Map<String, GenomeLengthVo> map = lst.stream()
			      .collect(Collectors.toMap(GenomeLengthVo::getChromosome, chromosome -> chromosome));
		
		return map;
	}

	public List<PreFoundedSvVo> getPreCalledSV( List<SampleParamObj> samples, List<ChromBinObj> regions ) {
		Map<String, Object> paramMap = new LinkedHashMap<String, Object>();
		
		List<PreFoundedSvVo> retList = new ArrayList<PreFoundedSvVo>();
		paramMap.put("samples", samples);
		for( int i = 0; i<regions.size(); i++ ){
			paramMap.put("region1", regions.get(i));

			for( int j = i; j<regions.size(); j++ ){
				paramMap.put("region2", regions.get(j));

				List<PreFoundedSvVo> subList = this.cancerHiCMapper.getPreCalledSV(paramMap);
				retList.addAll( subList );
			}
		}
		return retList;
	}
	
	public List<PreFoundedSvVo> getFilteredInPreCalledSV( List<SampleParamObj> samples, List<ChromBinObj> regions ) {
		List<PreFoundedSvVo> list = this.getPreCalledSV(samples, regions);
		
//		List<PreFoundedSvVo> nList = new ArrayList<PreFoundedSvVo>();
//		for(PreFoundedSvVo sv : list) {
//			boolean booleanSrc = false;
//			boolean booleanTar = false;
//			for(ChromBinObj region : regions) {
//				if( sv.getSrc_chrom().equals( region.getChrom() ) ) {
//					if( region.getChromStart() <= sv.getSrc_chrom_start() && region.getChromEnd() >= sv.getSrc_chrom_start() ) booleanSrc = true;
//				}
//				if( sv.getTar_chrom().equals( region.getChrom() ) ) {
//					if( region.getChromStart() <= sv.getTar_chrom_start() && region.getChromEnd() >= sv.getTar_chrom_start() ) booleanTar = true;
//				}
//				if( booleanSrc && booleanTar ) break;
//			}
//
//			if( booleanSrc && booleanTar ) {
//				nList.add( sv );
//			}
//		}
		
		return list;
	}
	
	public List<PreFoundedSvVo> getPreCalledSVBySampleId( List<String> sampleIds ) {
		return this.cancerHiCMapper.getPreCalledSVBySampleId(sampleIds);
	}
	
	public List<SuperEnhancerVo> getSuperEnhancer( List<SampleParamObj> samplesList, String chrom, long chromStart, long chromEnd, int bin, int beforeBinSize ) {
		List<SuperEnhancerVo> lst = null;
		for( SampleParamObj obj : samplesList ) {
			Map<String, Object> params = new LinkedHashMap<String, Object>();
			params.put("chrom", chrom);
			params.put("chromStart", chromStart);
			params.put("chromEnd", chromEnd);
			params.put("binResolution", bin);
			params.put("beforeBinSize", beforeBinSize);
			params.put("sample_name", obj.getSample());

			lst = this.cancerHiCMapper.getSuperEnhancer( params );
		}

		return lst;
	}

	public List<GeneWithBinVo> getGencodeV34Genes( String chrom, long chromStart, long chromEnd, int bin, int beforeBinSize, String[] optionGene ) {
		Map<String, Object> params = new LinkedHashMap<String, Object>();
		params.put("chrom", chrom);
		params.put("chromStart", chromStart);
		params.put("chromEnd", chromEnd);
		params.put("binResolution", bin);
		params.put("beforeBinSize", beforeBinSize);
		
		List<String> list = new ArrayList<String>();
		for( int i=0; i< optionGene.length; i++ ) {
			list.add( optionGene[i] );
		}
		params.put("list", list);

		return this.cancerHiCMapper.getGencodeV34Genes( params );
	}
	
	public List<GeneWithBinVo> getRefseqHG38Genes( String chrom, long chromStart, long chromEnd, int bin, int beforeBinSize, String[] optionGene ) {
		Map<String, Object> params = new LinkedHashMap<String, Object>();
		params.put("chrom", chrom);
		params.put("chromStart", chromStart);
		params.put("chromEnd", chromEnd);
		params.put("binResolution", bin);
		params.put("beforeBinSize", beforeBinSize);
		
		List<String> list = new ArrayList<String>();
		for( int i=0; i< optionGene.length; i++ ) {
			list.add( optionGene[i] );
		}
		params.put("list", list);

		return this.cancerHiCMapper.getRefseqHG38Genes( params );
	}
	
	public List<StudyInfoVo> getStudyInfo(){
		return this.cancerHiCMapper.getStudyInfo();
	}
	
	public List<Map<String, String>> getCharacteristicsSample( String type, String name, String property, String colName ){
		Map<String, String> params = new LinkedHashMap<String, String>();
		params.put("type", type);
		params.put("name", name);
		params.put("property", property);
		params.put("colName", colName);
		
		return this.cancerHiCMapper.getCharacteristicsSample( params );
	}
	
//	public TestVo getBlobTest(){
//		return this.cancerHiCMapper.getBlobTest();
//	}

//	public List<SampleParamObj> getNormalSampleId( List<SampleParamObj> samples ) {
//		for(SampleParamObj vo : samples) {
//			Map<String, String> paramMap = new LinkedHashMap<String, String>();
//			paramMap.put("exact_sample", vo.getSample());
//			
//			List<SampleInfoVo> list = this.cancerHiCMapper.getSampleList( paramMap );
//			
//			if( list != null && list.size() > 0 ) continue;
//			else{
//				vo.setSample("11-51N");
//				vo.setTable("Data500k");
//			}
//		}
//		return samples;
//	}
}
