package org.kobic.hicv2.hic.service;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.ibatis.annotations.Param;
import org.json.simple.JSONObject;
import org.kobic.hicv2.hic.mapper.HiCMapper;
import org.kobic.hicv2.hic.vo.EpigenomicsVo;
import org.kobic.hicv2.hic.vo.GeneVo;
import org.kobic.hicv2.hic.vo.H1EscTadVo;
import org.kobic.hicv2.hic.vo.HeatMapVo;
import org.kobic.hicv2.hic.vo.InteractionVo;
import org.kobic.hicv2.hic.vo.LocusVo;
import org.kobic.hicv2.hic.vo.SampleVo;
import org.kobic.hicv2.hic.vo.SuperEnhancerVo;
import org.springframework.stereotype.Service;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

@Service(value = "hicService")
public class HiCService {
	private static double[] filter = new double[]{0.0138663463, 0.0351355755, 0.0724108992, 0.121375024, 0.1654719647, 0.1834803806, 0.1654719647, 0.121375024, 0.0724108992, 0.0351355755, 0.0138663463};

	@Resource(name = "hicMapper")
	private HiCMapper hicMapper;
		
	public List<LocusVo> getLociOfTssInSpecificGene( String param ) {
		Map<String, String> paramMap = new HashMap<String, String>();
		paramMap.put("name", param);

		return this.hicMapper.getLocusInfo(paramMap);
	}

	public Map<Object, Object> getDataProcessingBySingleSample( String loci, String windowSize, String windowSize2, String boundaryRange, int startPt, int endPt, int heatmap_windowSize) throws Exception{
		String[] data = loci.split(";");
		String dataOrder = data[0];
		String sampleId = data[1];
		String locus = data[3];
		String tad = data[4];
		
		String[] params = locus.split(":");

		String chr = params[0];

		long a = System.currentTimeMillis();
		
		SampleVo sampleVo = this.hicMapper.getOnlyOneSample( sampleId );
		
		long a1 = System.currentTimeMillis();

		long b = System.currentTimeMillis();
		
		Map<Object, Object> map = this.getInteractionsLast(locus, windowSize, windowSize2, startPt, endPt, boundaryRange, sampleVo, dataOrder );

		List<SuperEnhancerVo> enhancerList = null;
		if( sampleVo.getSuper_enhancer().equals("Y") )
			enhancerList = this.getEnhancerInfo(chr, startPt, endPt, sampleVo);

		long c = System.currentTimeMillis();
		Map<String, Map<Integer, List<Map<String, Object>>>> geneMap = this.getGene(loci, boundaryRange, startPt, endPt);
		
		long f = System.currentTimeMillis();
		Map<String, Map<Integer, List<Map<String, Object>>>> gencodeMap = this.getGencode(loci, boundaryRange, startPt, endPt);
		
		long d = System.currentTimeMillis();
		JsonObject heatmapJson = this.getHeatMapLast(chr, sampleVo, startPt, endPt, heatmap_windowSize, tad);

		long e = System.currentTimeMillis();
		
		System.out.println( "getTable : " + (float)(a1-a)/1000 + "sec");
		System.out.println( "getAllToAll : " + (float)(b-a1)/1000 + "sec");
		System.out.println( "getInteraction for bar graph : " + (float)(c-b)/1000 + "sec");
		System.out.println( "getGene : " + (float)(f-c)/1000 + "sec");
		System.out.println( "getGencode : " + (float)(d-f)/1000 + "sec");
		System.out.println( "getHeatmap : " + (float)(e-d)/1000 + "sec");

		map.put("enhancer", enhancerList);
		map.put("gene", geneMap);
		map.put("gencode", gencodeMap);
		map.put("heatmap", heatmapJson);
		map.put("selTad", tad);

		return map;
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
	
	public Map<String, Map<Integer, List<Map<String, Object>>>> getGencode(String loci, String boundaryRange, int startPt, int endPt) {
		String[] data = loci.split(";");
		String locus = data[3];

		Map<String, Object> paramMap = new HashMap<String, Object>();
		String[] params = locus.split(":");

		paramMap.put("chrom", params[0]);

		if( startPt < 1 ) startPt = 1;
		
		paramMap.put("startPt", startPt);
		paramMap.put("endPt", endPt);
		
		List<GeneVo> getGencodeList = this.hicMapper.getGencode(paramMap);
		
		Map<String, List<Map<String, Object>>> resultMap = new HashMap<String, List<Map<String, Object>>>();
		
		List<Map<String, Object>> gencodeList = new ArrayList<Map<String, Object>>();
		
		for(GeneVo vo : getGencodeList) {
			Map<String, Object> retMap = new HashMap<String, Object>();
			
			retMap.put("startPt", startPt);
			retMap.put("boundaryRange", boundaryRange);
			retMap.put("txStart", vo.getTxStart());
			retMap.put("txEnd", vo.getTxEnd());
			retMap.put("name", vo.getName());
			retMap.put("chrom", vo.getChrom());
			retMap.put("num", vo.getNum());
			retMap.put("tableNm", vo.getTableNM());
				
			retMap.put("nameLength", vo.getNameLength());
			retMap.put("scaledNameLength", vo.getNameLength() * Integer.valueOf(boundaryRange)/50);
			
			retMap.put("strand", vo.getStrand());
			
			gencodeList.add(retMap);
			resultMap.put("Gencode", gencodeList);
		}
		
		Map<String, Map<Integer, List<Map<String, Object>>>> dbMap = new HashMap<String, Map<Integer, List<Map<String, Object>>>>();
		
		for(Iterator<String> iter = resultMap.keySet().iterator(); iter.hasNext();) {
			String db = iter.next();
			
			Map<Integer, List<Map<String, Object>>> map = new LinkedHashMap<Integer, List<Map<String, Object>>>();
			int idx=0;
			
			while(true) {
				if(resultMap.get(db).isEmpty()) {
					break;
				} else {
					List<Map<String, Object>> lineList = new ArrayList<Map<String, Object>>();
					
					for(int i=0; i<resultMap.get(db).size(); i++) {
						int minLength = 0;
						int maxLength = 0;
						int prevLength = 0;
						int currentLength = 0;
						
						if(lineList.isEmpty()) {
							lineList.add(resultMap.get(db).get(i));
							continue;
						} else {
							boolean bool = true;
							for(int j=0; j<lineList.size(); j++) {
								if(Integer.parseInt(resultMap.get(db).get(i).get("txEnd").toString()) <= Integer.parseInt(lineList.get(j).get("txEnd").toString())) {
									maxLength = Integer.parseInt(lineList.get(j).get("txEnd").toString());
								} else { 
									maxLength = Integer.parseInt(resultMap.get(db).get(i).get("txEnd").toString());
								}
								
								int scaledNameLengthA = Integer.parseInt(lineList.get(j).get("scaledNameLength").toString());
								int scaledNameLengthB = Integer.parseInt(resultMap.get(db).get(i).get("scaledNameLength").toString());
								
								int a = Integer.parseInt(lineList.get(j).get("txStart").toString()) - scaledNameLengthA;
								int b = Integer.parseInt(resultMap.get(db).get(i).get("txStart").toString()) - scaledNameLengthB;
										
								if( a <= b ){
									minLength = a;
								} else { 
									minLength = b;
								}
								
								prevLength = Integer.parseInt(lineList.get(j).get("txEnd").toString()) - a;
								currentLength = Integer.parseInt(resultMap.get(db).get(i).get("txEnd").toString()) - b;
								
								//중복영역이 있다. overlap됨. 다른라인에 그려야 한다.
								if((maxLength - minLength) < (prevLength + currentLength)) {
									// next track!
									bool = true;
									break;
								} else {
									bool = false;
								}
							}
							if(bool==false) lineList.add(resultMap.get(db).get(i));
						}
					}
					map.put(idx, lineList);
					for(Iterator<Map<String, Object>> secIter=lineList.iterator(); secIter.hasNext();){
						Map<String, Object> lineMap = secIter.next();
						resultMap.get(db).remove(lineMap);
					}
					idx++;
				}
			}
			dbMap.put(db, map);
		}

		return dbMap;
	}
	
	public Map<String, Map<Integer, List<Map<String, Object>>>> getGene(String loci, String boundaryRange, int startPt, int endPt) {
		String[] data = loci.split(";");
		String locus = data[3];

		Map<String, Object> paramMap = new HashMap<String, Object>();
		String[] params = locus.split(":");

		paramMap.put("chrom", params[0]);

		if( startPt < 1 ) startPt = 1;
		
		paramMap.put("startPt", startPt);
		paramMap.put("endPt", endPt);
		
		List<GeneVo> getGeneList = this.hicMapper.getGene(paramMap);
		
		Map<String, List<Map<String, Object>>> resultMap = new HashMap<String, List<Map<String, Object>>>();
		
		List<Map<String, Object>> refseqList = new ArrayList<Map<String, Object>>();
		List<Map<String, Object>> ensemblList = new ArrayList<Map<String, Object>>();
		List<Map<String, Object>> ucscList = new ArrayList<Map<String, Object>>();
		
		List<Map<String, Object>> gencodeList = new ArrayList<Map<String, Object>>();
		
		for(GeneVo vo : getGeneList) {
			Map<String, Object> retMap = new HashMap<String, Object>();
			
			retMap.put("startPt", startPt);
			retMap.put("boundaryRange", boundaryRange);
			retMap.put("txStart", vo.getTxStart());
			retMap.put("txEnd", vo.getTxEnd());
			retMap.put("name", vo.getName());
			retMap.put("chrom", vo.getChrom());
			retMap.put("num", vo.getNum());
			retMap.put("tableNm", vo.getTableNM());
				
			retMap.put("nameLength", vo.getNameLength());
			retMap.put("scaledNameLength", vo.getNameLength() * Integer.valueOf(boundaryRange)/50);
			
			retMap.put("strand", vo.getStrand());
			
			if(vo.getTableNM().equals("Refseq")) {
				refseqList.add(retMap);
				resultMap.put("Refseq", refseqList);
			} else if(vo.getTableNM().equals("Ensembl")) {
				ensemblList.add(retMap);
				resultMap.put("Ensembl", ensemblList);
			} else if(vo.getTableNM().equals("UCSC")) {
				ucscList.add(retMap);
				resultMap.put("UCSC", ucscList);
			} else if( vo.getTableNM().equals("Gencode") ) {
				ucscList.add(retMap);
				resultMap.put("Gencode", gencodeList);
			}
		}
		
		Map<String, Map<Integer, List<Map<String, Object>>>> dbMap = new HashMap<String, Map<Integer, List<Map<String, Object>>>>();
		
		for(Iterator<String> iter = resultMap.keySet().iterator(); iter.hasNext();) {
			String db = iter.next();
			
			Map<Integer, List<Map<String, Object>>> map = new LinkedHashMap<Integer, List<Map<String, Object>>>();
			int idx=0;
			
			while(true) {
				if(resultMap.get(db).isEmpty()) {
					break;
				} else {
					List<Map<String, Object>> lineList = new ArrayList<Map<String, Object>>();
					
					for(int i=0; i<resultMap.get(db).size(); i++) {
						int minLength = 0;
						int maxLength = 0;
						int prevLength = 0;
						int currentLength = 0;
						
						if(lineList.isEmpty()) {
							lineList.add(resultMap.get(db).get(i));
							continue;
						} else {
							boolean bool = true;
							for(int j=0; j<lineList.size(); j++) {
								if(Integer.parseInt(resultMap.get(db).get(i).get("txEnd").toString()) <= Integer.parseInt(lineList.get(j).get("txEnd").toString())) {
									maxLength = Integer.parseInt(lineList.get(j).get("txEnd").toString());
								} else { 
									maxLength = Integer.parseInt(resultMap.get(db).get(i).get("txEnd").toString());
								}
								
								int scaledNameLengthA = Integer.parseInt(lineList.get(j).get("scaledNameLength").toString());
								int scaledNameLengthB = Integer.parseInt(resultMap.get(db).get(i).get("scaledNameLength").toString());
								
								int a = Integer.parseInt(lineList.get(j).get("txStart").toString()) - scaledNameLengthA;
								int b = Integer.parseInt(resultMap.get(db).get(i).get("txStart").toString()) - scaledNameLengthB;
										
								if( a <= b ){
									minLength = a;
								} else { 
									minLength = b;
								}
								
								prevLength = Integer.parseInt(lineList.get(j).get("txEnd").toString()) - a;
								currentLength = Integer.parseInt(resultMap.get(db).get(i).get("txEnd").toString()) - b;
								
								//중복영역이 있다. overlap됨. 다른라인에 그려야 한다.
								if((maxLength - minLength) < (prevLength + currentLength)) {
									// next track!
									bool = true;
									break;
								} else {
									bool = false;
								}
							}
							if(bool==false) lineList.add(resultMap.get(db).get(i));
						}
					}
					map.put(idx, lineList);
					for(Iterator<Map<String, Object>> secIter=lineList.iterator(); secIter.hasNext();){
						Map<String, Object> lineMap = secIter.next();
						resultMap.get(db).remove(lineMap);
					}
					idx++;
				}
			}
			dbMap.put(db, map);
		}

		return dbMap;
	}

	public List<SampleVo> getSampleList() {
		return this.hicMapper.getSampleList();
	}
	public List<SampleVo> getSampleListPcHiCTest() {
		return this.hicMapper.getSampleListPcHiCTest();
	}
	
	public String getTableName( String id ) {
		Map<String, String> paramMap = new HashMap<String, String>();
		paramMap.put("id", id);

		return this.hicMapper.getTableName( paramMap );
	}
	
	public List<String> getAutoCompleteGeneSymbol( String keyword ) {
		Map<String, String> paramMap = new HashMap<String, String>();
		paramMap.put("symbol", keyword);
		paramMap.put("length", Integer.toString( keyword.length() ) );

		return this.hicMapper.getAutoCompleteGeneSymbol( paramMap );
	}

	private static Collection<HeatMapVo> getDifferCollections(List<HeatMapVo> a, List<HeatMapVo> b) {
		Map<String, HeatMapVo> map = new LinkedHashMap<String, HeatMapVo>();
		for(HeatMapVo vo:a) {
			HeatMapVo newVo = vo.clone();
			map.put(vo.getKey(), newVo);
		}

		for(HeatMapVo vo:b) {
			if( map.containsKey(vo.getKey()) ) {
				map.get(vo.getKey()).subtract( vo );
			}else {
				vo.setCount(vo.getCount()*(-1));
				map.put(vo.getKey(), vo );
			}
		}
		
		return map.values();
	}
	
	private static List<Integer> computeHeatmapPairIndex(int pos, int length, String startPt, int windowSize) {
		int posEnd = pos + length - 1;

		List<Integer> lst = new ArrayList<Integer>();
		if( length > windowSize ) {
			for(int i=pos; i<=posEnd; i+= windowSize) {
				int binIdx = (int) Math.floor( (float)(i - Integer.parseInt(startPt)) / windowSize);
				lst.add( binIdx );
			}
		}else {
			int binIdx = (int) Math.floor( (float)(pos - Integer.parseInt(startPt)) / windowSize);
			lst.add( binIdx );
		}
		return lst;
	}
	
	private static List<HeatMapVo> getHeatMapDataInGeneral( List<HeatMapVo> lst, String startPt, String endPt, int heatmapWindowSize ) {
		List<HeatMapVo> newList = new ArrayList<HeatMapVo>();
		Map<String, Float> map = new LinkedHashMap<String, Float>();
		
		for(HeatMapVo heatmapVo : lst) {
			float count = heatmapVo.getCount();

			List<Integer> binList = HiCService.computeHeatmapPairIndex(heatmapVo.getBin(), heatmapVo.getBinLength(), startPt, heatmapWindowSize);
			
			List<Integer> interactionPairList = HiCService.computeHeatmapPairIndex(heatmapVo.getInteractionPair(), heatmapVo.getInteractionPairLength(), startPt, heatmapWindowSize);
			
			for(int binIdx : binList) {
				for(int interactionPairIdx : interactionPairList) {
					String key = binIdx + "-" + interactionPairIdx;

					if( map.containsKey( key ) ) map.put( key, map.get(key) + count );
					else						 map.put( key, count );
				}
			}
		}

		for(Iterator<String> iter = map.keySet().iterator(); iter.hasNext();) {
			String key = iter.next();
			String[] values = key.split("-");
			int binIdx = Integer.valueOf( values[0] );
			int interactionPairIdx = Integer.valueOf( values[1] );
			
			float count = (float) (map.get(key) / Math.pow((float)heatmapWindowSize/5000, 2));
			
			HeatMapVo vo = new HeatMapVo();
			vo.setBin( binIdx );
			vo.setInteractionPair( interactionPairIdx );
			vo.setCount( count );
			newList.add( vo );
		}

		return newList;
	}

	/* 최종 : Triangle Heatmap By Single Sample (Multiple)*/
	public JsonObject getHeatMapLast( String chr, SampleVo sampleVo, int startPt, int endPt, int heatmapWindowSize, String tad ) throws Exception{
		if(startPt < 0) startPt = 1;
		
		JsonObject obj = new JsonObject();
		JsonArray data_arr = new JsonArray();
		JsonObject data_obj = new JsonObject();
		JsonObject tad_obj = new JsonObject();
		JsonArray tad_arr = new JsonArray();
		
		Map<String,String> paramMap = new HashMap<String, String>();
		
		paramMap.put("chrom", chr);
		paramMap.put("startPt", Integer.toString(startPt));
		paramMap.put("endPt", Integer.toString(endPt));
		paramMap.put("tableName", sampleVo.getTable_name());
		paramMap.put("heatmapWindowSize", Integer.toString(heatmapWindowSize));
		
//		int binningType = this.hicMapper.getBinningType( tableName );
//		if( binningType == 1 ) {
//			paramMap.put("binTableName", "BinAnnotation20171231");
//		}else if( binningType == 2 ){
//			paramMap.put("binTableName", "BinAnnotation");
//		}
		
		paramMap.put("binTableName", sampleVo.getBinning_table_name());

		List<HeatMapVo> heatmapDataList = HiCService.getHeatMapDataInGeneral( this.hicMapper.getHeatMapRawData(paramMap), Integer.toString(startPt), Integer.toString(endPt), heatmapWindowSize );

		double maxCount = 0;
		for(HeatMapVo vo : heatmapDataList){
			data_obj = new JsonObject();
			data_obj.addProperty("source", vo.getBin());
			data_obj.addProperty("target", vo.getInteractionPair());
			data_obj.addProperty("value", vo.getCount());
			data_arr.add(data_obj);
			
			if(vo.getCount() > maxCount) maxCount = vo.getCount();
			
			obj.add("links", data_arr);
		}

		String tadTableNm = "";
		if(tad.equals("TopDom (w=20)"))					tadTableNm = "TAD_TopDom_w20_" + sampleVo.getSample_name();
		else if(tad.equals("TopDom (w=5)"))				tadTableNm = "TAD_TopDom_w20_" + sampleVo.getSample_name();
		else if(tad.equals("DI (window size = 2Mb)") )	tadTableNm = "TAD_HMM_2Mb_" + sampleVo.getSample_name();
		else											tadTableNm = "TAD_HMM_500Kb_" + sampleVo.getSample_name();

		String tadYn = sampleVo.getTad();
		if(tadYn.equals("Y")) {
			if(tadTableNm != ""){
				List<H1EscTadVo> tadInfo = this.getTadInfo(chr, startPt, endPt, heatmapWindowSize, tadTableNm);
				for(H1EscTadVo tadVo : tadInfo){
					tad_obj = new JsonObject();
					tad_obj.addProperty("chr", tadVo.getChr());
					tad_obj.addProperty("tadStartIdx", tadVo.getStartIdx());
					tad_obj.addProperty("tadEndIdx", tadVo.getEndIdx());
					tad_obj.addProperty("tadStart", tadVo.getStart());
					tad_obj.addProperty("tadEnd", tadVo.getEnd());
					tad_arr.add(tad_obj);
					
					obj.add("tad", tad_arr);
				}
			}
		}

		obj.addProperty("max", maxCount);
		obj.addProperty("boundary", (endPt - startPt)/2 );

		return obj;	
	}
	
	private int getRelativeBinPosition( String tableName, String chrom, String pos ) {
		Map<String, String> paramMap = new HashMap<String, String>();
		paramMap.put("tableName", this.hicMapper.getBinningTableName(tableName));
		paramMap.put("chrom", chrom);
		paramMap.put("pos", pos);
		
		return this.hicMapper.getBinningPosition(paramMap);
	}

	private Map<Object, Object> getInteractionsLast( String loci, String windowSizeFrom, String windowSizeTo, int startPt, int endPt, String boundaryRange, SampleVo sampleVo, String dataOrder ) throws Exception {
		String[] params = loci.split(":");

		String chr = params[0];
		int pos = this.getRelativeBinPosition( sampleVo.getTable_name(), params[0], params[1]);
		double globalPeakValue = Double.MIN_VALUE;
		
		if( startPt < 1 ) startPt = 1;
		
		Map<String, String > paramMap = new HashMap<String, String>();
		
		paramMap.put("startPt", Integer.toString(startPt));
		paramMap.put("endPt", Integer.toString(endPt));
		paramMap.put("tableName", sampleVo.getTable_name());
		paramMap.put("pos", Integer.toString(pos));
		paramMap.put("chr", chr);
		paramMap.put("binTableName", sampleVo.getBinning_table_name() );
		
		List<InteractionVo> list = this.hicMapper.getInteractionLast(paramMap);

		List<InteractionVo> resultList = new ArrayList<InteractionVo>();
		if(!list.isEmpty() && sampleVo.getBinning_type() == 1 )	resultList = this.convolution(list, startPt, endPt);
		else													resultList = this.fillingNotInteractionRegion(list, startPt, endPt);
		
		double peakValue = HiCService.getPeakValue(resultList);

		if( peakValue > globalPeakValue ) globalPeakValue = peakValue;

		Map<String, Object> map = new LinkedHashMap<String, Object>();
		
		map.put("dataOrder", dataOrder);
		map.put("bait", pos);
		map.put("chrom", chr);
		map.put("startPt", startPt);
		map.put("endPt", endPt);
		map.put("windowSize", windowSizeFrom);
		map.put("windowSize2", windowSizeTo);
		map.put("boundaryRange", boundaryRange);
		map.put("interactionPairs", resultList);
		map.put("peakValue", HiCService.getPeakValue(resultList) );
		map.put("fcPeakValue", HiCService.getFoldChangePeakValue(resultList) );
		map.put("globalPeakValue", globalPeakValue );
		map.put("sampleName", sampleVo.getCelline_name() );
		map.put("sampleId", sampleVo.getId() );

		Map<Object, Object> retMap = new LinkedHashMap<Object, Object>();
		retMap.put("aveHic", map);

		return retMap;
	}
	
	private List<InteractionVo> fillingNotInteractionRegion(List<InteractionVo> list, int startPt, int endPt ) throws Exception{
		List<InteractionVo> resultList = new ArrayList<InteractionVo>();

		if( list.size() > 0 ) {
			if( list.get(0).getBin2() > startPt ) {
				InteractionVo vo1 = new InteractionVo();
	
				vo1.setBin1(list.get(0).getBin1());
				vo1.setBin2(startPt);
				vo1.setChr(list.get(0).getChr());
				vo1.setCount(0);
				vo1.setBin2Len( list.get(0).getBin2() - startPt );
				resultList.add(vo1);
				resultList.add( list.get(0) );
			}else {
				resultList.add( list.get(0) );
			}
	
			InteractionVo previousVo = resultList.get( resultList.size()-1 );
			for(int i=1; i<list.size(); i++) {
				InteractionVo currentVo = list.get(i);
	
				if( previousVo.getBin2() + previousVo.getBin2Len() < currentVo.getBin2() ){
					InteractionVo vo1 = new InteractionVo();
	
					vo1.setBin1( currentVo.getBin1() );
					vo1.setBin2( previousVo.getBin2() + previousVo.getBin2Len() );
					vo1.setChr( currentVo.getChr() );
					vo1.setCount(0);
					vo1.setBin2Len( currentVo.getBin2() - (previousVo.getBin2() + previousVo.getBin2Len()) );
					resultList.add( vo1 );
					resultList.add( currentVo );
				}else {
					resultList.add( currentVo );
				}
				previousVo = currentVo;
			}
		}
		
		return resultList;
	}
	
	/** Original 20180325 */
	private List<InteractionVo> convolution(List<InteractionVo> list, int startPt, int endPt ) throws Exception{
		List<InteractionVo> resultList = new ArrayList<InteractionVo>();

		double[] mat2 = new double[ (endPt - startPt)/1000 ];

		int idx = 0;
		int bin2add = 0;

		for(int i=0; i<mat2.length; i++) {
			for(int j=0; j<5; j++) {
				
				InteractionVo vo1 = new InteractionVo();

				vo1.setBin1(list.get(1).getBin1());
				vo1.setBin2(startPt + bin2add);
				vo1.setChr(list.get(1).getChr());
				vo1.setBin2Len(1000);
				resultList.add(vo1);
				
				bin2add += 1000;
			}
		}

		for(int i=0; i<list.size(); i++){
			idx = (list.get(i).getBin2() - startPt ) / 1000;
			for(int j=0; j<5; j++){
				if(idx >= mat2.length) continue;
				if(list.get(i).getCount()==-285){
					System.out.println("error");
				}
				mat2[idx] = list.get(i).getCount();
				resultList.get(idx).setFoldChange(list.get(i).getFoldChange());
				idx++;
			}
		}

		for(int i=0; i<mat2.length; i++) {
			double sum = 0;
			int idx2 = 0;
			for(int j=i-5; j<=i+5; j++) {
				if( j < 0 ) 		continue;
				if( j > mat2.length - 1 ) continue;
				sum += mat2[j] * HiCService.filter[idx2];
				idx2++;
			}
			double colvolvedValue = sum;
			resultList.get(i).setCount(colvolvedValue);

		}
		
		return resultList;
		
	}
	
	/* Heatmap TAD 정보 */
	public List<H1EscTadVo> getTadInfo(String chr, int start, int end, int heatmapWindowSize, String tableName){
		
		Map<String, String> paramMap = new HashMap<String, String>();
		
		paramMap.put("chr", chr);
		paramMap.put("start", Integer.toString(start));
		paramMap.put("end", Integer.toString(end));
		paramMap.put("heatmapWindowSize", Integer.toString(heatmapWindowSize));
		paramMap.put("tableName", tableName);
		
		return this.hicMapper.getTadInfo(paramMap);	
	};


	/* Enhancer 정보 */
	public List<SuperEnhancerVo> getEnhancerInfo (String chr, int start, int end, SampleVo sampleVo){

			Map<String, String> paramMap = new HashMap<String, String>();
			
			paramMap.put("chr", chr);
			paramMap.put("start", Integer.toString(start));
			paramMap.put("end", Integer.toString(end));
			
//			String originTableNm = "Data_"+ sampleName;
//			
//			
//			System.out.println("============>" + sampleName + "<===================");

//			String check = hicMapper.getExistTable(originTableNm);
			String check = sampleVo.getSuper_enhancer();
			
			if(check != null && check.equals("Y") ) {
//				if(sampleName.equals("GMdH") || sampleName.equals("GMdN") || sampleName.equals("GMiD") || sampleName.equals("GMiM") || sampleName.equals("GMiN") ){
//					sampleName = "GMiM";
//				}
//				else if( sampleName.equals("HECO") || sampleName.equals("HECT") || sampleName.equals("HEHR") || sampleName.equals("HETE") ){
//					sampleName = "HEK2";
//				}
//				else if( sampleName.equals("M07N") || sampleName.equals("M07R") || sampleName.equals("MC07") ){
//					sampleName = "MCF7";
//				}
				
//				String tableName = "SuperEnhancer_" + sampleName;
				String tableName = sampleVo.getSuper_enhancer_table();
				
				paramMap.put("tableName", tableName);
				
				return this.hicMapper.getEnhancerInfo(paramMap);
			}
			else return null;
	}
	
	private List<SuperEnhancerVo> getPairwiseEnhancerInfo (String chr, int start, int end, SampleVo sampleVo1, SampleVo sampleVo2){
			Map<String, String> paramMap = new HashMap<String, String>();
			
			paramMap.put("chr", chr);
			paramMap.put("start", Integer.toString(start));
			paramMap.put("end", Integer.toString(end));
			
			String check1 = sampleVo1.getSuper_enhancer();
			String check2 = sampleVo2.getSuper_enhancer();

			String tableName1 = null;
			String tableName2 = null;

			if(check1 != null && check1.equals("Y")) {tableName1 = sampleVo1.getSuper_enhancer_table(); paramMap.put("tableName1", tableName1);}
			if(check2 != null && check2.equals("Y")) {tableName2 = sampleVo2.getSuper_enhancer_table(); paramMap.put("tableName2", tableName2);}

			if( tableName1 != null || tableName2 != null )
				return this.hicMapper.getPairwiseEnhancerInfo(paramMap);	
			
			return null;
	}
	
	
	public void getPairwiseData (Map<String, Object> retMap, String loci1, String loci2, String windowSize, String windowSize2, String boundaryRange, int startPt, int endPt , int heatmap_windowsize) throws Exception{
		
		String[] data1 = loci1.split(";");
		String dataOrder1 = data1[0];
		String sampleId1 = data1[1];
//		String sampleName1 = data1[2];
		String locus1 = data1[3];
		
		String[] params1 = locus1.split(":");

		String chr1 = params1[0];

//		String tableName1 = this.getTableName( sampleId1 );
		
		String[] data2 = loci2.split(";");
		String dataOrder2 = data2[0];
		String sampleId2 = data2[1];
//		String sampleName2 = data2[2];
		String locus2 = data2[3];
		
		String[] params2 = locus2.split(":");

		String chr2 = params2[0];
		
		SampleVo sampleVo1 = this.hicMapper.getOnlyOneSample(sampleId1);
		SampleVo sampleVo2 = this.hicMapper.getOnlyOneSample(sampleId2);

//		String tableName2 = this.getTableName( sampleId2 );
		
		this.getDiffHeatMapLast(retMap, chr1, chr2, sampleVo1, sampleVo2, startPt, endPt, heatmap_windowsize);
		this.getDiffGraph(retMap, chr1, locus1, locus2, windowSize, windowSize2, boundaryRange, startPt, endPt, dataOrder1, dataOrder2, sampleId1, sampleId2);
	}
	
	/* pairwise HeatMap Data  */	
	public void getDiffHeatMapLast(Map<String, Object> retMap, String chr1, String chr2, SampleVo sampleVo1, SampleVo sampleVo2, int startPt, int endPt , int heatmap_windowsize){	
		if(startPt < 0) startPt = 1;
		JsonObject obj = new JsonObject();
		JsonArray node_arr = new JsonArray();
		JsonObject node_obj = new JsonObject();
		JsonArray data_arr = new JsonArray();
		JsonObject data_obj = new JsonObject();

		for(int i=startPt; i<=endPt; i+=heatmap_windowsize){
			node_obj = new JsonObject();
			node_obj.addProperty("name",i);
			node_arr.add(node_obj);

			obj.add("nodes", node_arr);
		}

		String type = "pairwise";
		List<HeatMapVo> fvoList =  this.getHeatMapList(chr1, sampleVo1.getTable_name(), startPt, endPt, heatmap_windowsize, type);		
		List<HeatMapVo> svoList =  this.getHeatMapList(chr2, sampleVo2.getTable_name(), startPt, endPt, heatmap_windowsize, type);
		
		List<HeatMapVo> diffCollections = new ArrayList<HeatMapVo>(HiCService.getDifferCollections(fvoList, svoList));

		double DiffmaxCount = 0;
		double DiffminCount = 0;

		for(HeatMapVo vo : diffCollections){
			data_obj = new JsonObject();
			data_obj.addProperty("source", vo.getBin());
			data_obj.addProperty("target", vo.getInteractionPair());
			data_obj.addProperty("value", vo.getCount());
			data_arr.add(data_obj);
			
			if( vo.getCount() > DiffmaxCount ) DiffmaxCount = vo.getCount();
			
			if( vo.getCount() < DiffminCount ) DiffminCount = vo.getCount();
			
			obj.add("links", data_arr);
		}

		obj.addProperty("max", DiffmaxCount);
		obj.addProperty("min", DiffminCount);
		obj.addProperty("boundary", (endPt - startPt)/2 );

		retMap.put("diffHeatMap", obj);
	}
	
	/* pairwise Graph */	
	private void getDiffGraph(Map<String, Object> retMap, String chr1, String locus1, String locus2, String windowSize, String windowSize2, String boundaryRange, int startPt, int endPt, String dataOrder1, String dataOrder2, String sampleId1, String sampleId2) throws Exception{	
		SampleVo sampleVo1 = this.hicMapper.getOnlyOneSample( sampleId1 );
		SampleVo sampleVo2 = this.hicMapper.getOnlyOneSample( sampleId2 );
		
		Map<Object, Object> map = this.getInteractionsLast(locus1, windowSize, windowSize2, startPt, endPt, boundaryRange, sampleVo1, dataOrder1);
		Map<Object, Object> map2 = this.getInteractionsLast(locus2, windowSize, windowSize2, startPt, endPt, boundaryRange, sampleVo2, dataOrder2);
	
		Map<Object, Object> graphMap = new HashMap<Object, Object>();
		
		graphMap.put(dataOrder1, map);
		graphMap.put(dataOrder2, map2);
		
		retMap.put("data", graphMap);
		
//		String sampleNm1[] = sampleVo1.getTable_name().split("Data_");
//		String sampleNm2[] = sampleVo2.getTable_name().split("Data_");

		List<SuperEnhancerVo> result = this.getPairwiseEnhancerInfo(chr1, startPt, endPt, sampleVo1, sampleVo2 );
		
		retMap.put("enhancer", result);
	}
	
	
	/* Triangle Heatmap return type List<HeatMapVo> (Pairwise) */
	private List<HeatMapVo> getHeatMapList( String chr, String tableName, int startPt, int endPt, int heatmapWindowSize, String type ){
		
		Map<String,String> paramMap = new HashMap<String, String>();
		
		paramMap.put("chrom", chr);
		paramMap.put("startPt", Integer.toString(startPt));
		paramMap.put("endPt", Integer.toString(endPt));
		paramMap.put("tableName", tableName);
		paramMap.put("heatmapWindowSize", Integer.toString(heatmapWindowSize));
		paramMap.put("type", type);
		
		List<HeatMapVo> heatmapDataList = this.hicMapper.getHeatMapData(paramMap);
		
		return heatmapDataList;
	}
	
	/* pairwise heatmap resolution refresh */
	public String getOnlyDiffHeatMapData (Map<String, Object> retMap, String loci1, String loci2, String windowSize, String windowSize2, int startPt, int endPt , int heatmap_windowsize){
		
		String[] data1 = loci1.split(";");
		String sampleId1 = data1[1];
		String locus1 = data1[3];
		
		String[] params1 = locus1.split(":");

		String chr1 = params1[0];

//		String tableName1 = this.getTableName( sampleId1 );
		
		SampleVo sampleVo1 = this.getOnlyOneSample(sampleId1);

		String[] data2 = loci2.split(";");
		String sampleId2 = data2[1];
		String locus2 = data2[3];
		
		String[] params2 = locus2.split(":");

		String chr2 = params2[0];

		SampleVo sampleVo2 = this.getOnlyOneSample(sampleId2);
//		String tableName2 = this.getTableName( sampleId2 );

		this.getDiffHeatMapLast(retMap, chr1, chr2, sampleVo1, sampleVo2, startPt, endPt, heatmap_windowsize);
		
		return retMap.get("diffHeatMap").toString();
	}
	

	public static int getHeatmapDefaultResolution(int boundaryRange){
		int heatmap_resolution;
		
		if(boundaryRange < 1000000) heatmap_resolution = 5000;
		else if(boundaryRange < 2000000) heatmap_resolution = 10000;
		else if(boundaryRange < 3000000) heatmap_resolution = 20000;
		else if(boundaryRange < 4000000) heatmap_resolution = 30000;
		else heatmap_resolution = 40000;
		
		return heatmap_resolution;
	}

	
	public static String getFileName () {
		String filename = "3div_setting";

		String filePath = filename + "_" + System.currentTimeMillis() + ".json";
		
		return filePath;
	}
	
	public static String getSettingDownload(JSONObject jobj, String filePath) throws Exception {
		
        // 파일 객체 생성
		File file = new File(filePath);
		FileWriter fw = null;
		BufferedWriter bw = null;

		try {
				fw = new FileWriter(file, false);
				bw = new BufferedWriter(fw);
				
				bw.write(jobj.toJSONString());
		} finally{
			// BufferedWriter FileWriter를 닫아준다.
			if(bw != null) try{bw.close();}catch(IOException e){}
			if(fw != null) try{fw.close();}catch(IOException e){}
		}
	
		return filePath;
	}

	public void download(HttpServletRequest request, HttpServletResponse response) throws Exception{
		int BUFFER_SIZE = 4096;
		
		String filePath = request.getParameter("name");
		System.out.println("filePath = " + filePath);

		ServletContext context = request.getSession().getServletContext();
		File downloadFile = new File(filePath);
		FileInputStream inputStream = new FileInputStream(downloadFile);
		
		String mimeType = context.getMimeType(filePath);
		if (mimeType == null) {
			mimeType = "application/octet-stream";
		}
		System.out.println("MIME type: " + mimeType);

		response.setContentType(mimeType);
		response.setContentLength((int) downloadFile.length());

		String headerKey = "Content-Disposition";

		response.setHeader(headerKey, "attachment; filename=" + URLEncoder.encode(downloadFile.getName(), "utf-8") + ";");

		OutputStream outStream = response.getOutputStream();

		byte[] buffer = new byte[BUFFER_SIZE];
		int bytesRead = -1;
		
		while ((bytesRead = inputStream.read(buffer)) != -1) {
			outStream.write(buffer, 0, bytesRead);
		}

		inputStream.close();
		outStream.close();
	}

	public Map<String,Object> getEpigenomics( String loci, String boundaryRange, int startPt, int endPt) throws Exception{
		String[] samples = loci.split("&");
		
		List<EpigenomicsVo> result = new ArrayList<EpigenomicsVo>();
		
		for(String sample : samples ) {
			String[] data = sample.split(";");
			String sampleId = data[1];
			String locus = data[3];

			String[] params = locus.split(":");
			
			if(boundaryRange.equals("1")){
				boundaryRange = String.valueOf(( endPt - startPt ) / 2 ); 
			}
			else{
				startPt = Integer.valueOf(params[1]) - Integer.valueOf(boundaryRange);
				endPt = Integer.valueOf(params[1]) + Integer.valueOf(boundaryRange);
			}
			
			String chr = params[0];
			String pos = params[1];

			SampleVo sampleVo = this.hicMapper.getOnlyOneSample(sampleId);
			
			String check = sampleVo.getEpigenomic_annotation();
			
			if( check != null && check.equals("Y") ){
				List<EpigenomicsVo> vo = this.getEpigenomicsData(sampleVo, chr, pos, Integer.toString(endPt), Integer.toString(startPt), "Y");
				
				result.addAll(vo);
			}
			
		}

		if(result.size() != 0){
			double max = Double.parseDouble(result.get(0).getSignificance());
			for(int i=0; i<result.size(); i++){
				if( max < Double.parseDouble(result.get(i).getSignificance()) ) max = Double.parseDouble(result.get(i).getSignificance());
			}
			Map<String, Object> resultMap = new HashMap<String, Object>();
			resultMap.put("max", max);
			resultMap.put("data", result);

			return resultMap;
		}
		else{
			Map<String, Object> resultMap = new HashMap<String, Object>();
			return resultMap;
		}
	}
	
	private List<EpigenomicsVo> getEpigenomicsData( SampleVo sampleVo, String chr, String pos, String endPt, String startPt, String existChk){
		Map<String, String > map = new HashMap<String,String>();
		
		map.put("tableName", sampleVo.getTable_name());
		map.put("epiTableName", sampleVo.getEpigenome_table());
		map.put("chr", chr);
		map.put("pos", pos);
		map.put("endPt", endPt);
		map.put("startPt", startPt);
		map.put("sampleId", sampleVo.getId());
		map.put("existChk", existChk);

		System.out.println(endPt +"," + startPt);

		return this.hicMapper.getEpigenomics(map);
	};

	public Map<String, Object> get_data_4_comparison(String loci1, String loci2, String windowSize, String windowSize2, String boundaryRange, String heatmap_windowsize) throws Exception {
		String[] params = loci1.split(":");
		int startPt = Integer.valueOf(params[1]) - Integer.valueOf(boundaryRange);
		int endPt = Integer.valueOf(params[1]) + Integer.valueOf(boundaryRange);

		Map<String, Object> retMap = new LinkedHashMap<String, Object>();
		
		retMap.put("bait", params[0] + ":" + startPt + "-" + endPt);
		retMap.put("windowSize", windowSize);
		retMap.put("windowSize2", windowSize2);
		retMap.put("startPt", startPt);
		retMap.put("endPt", endPt);
		retMap.put("boundaryRange", boundaryRange);
		
		this.getPairwiseData(retMap, loci1, loci2, windowSize, windowSize2, boundaryRange, Integer.valueOf( startPt ), Integer.valueOf( endPt ), Integer.valueOf( heatmap_windowsize ));
		
		Map<String, Map<Integer, List<Map<String, Object>>>> geneMap = this.getGene(loci1, boundaryRange, startPt, endPt);
		retMap.put("gene", geneMap);

		return retMap;
	}

	public Map<String, Object> get_data_4_position_comparison(String loci1, String loci2, String windowSize, String windowSize2, String boundaryRange, String heatmap_windowsize, String startPt, String endPt) throws Exception {
		String[] params = loci1.split(":");

		Map<String, Object> retMap = new LinkedHashMap<String, Object>();
		
		retMap.put("bait", params[0] + ":" + startPt + "-" + endPt);
		retMap.put("windowSize", windowSize);
		retMap.put("windowSize2", windowSize2);
		retMap.put("startPt", startPt);
		retMap.put("endPt", endPt);
		retMap.put("boundaryRange", boundaryRange);
		
		int boundaryStart =  Integer.parseInt(startPt);
		int boundaryEnd =  Integer.parseInt(endPt);
		
		
		this.getPairwiseData(retMap, loci1, loci2, windowSize, windowSize2, boundaryRange, boundaryStart, boundaryEnd, Integer.valueOf( heatmap_windowsize ));
		
		Map<String, Map<Integer, List<Map<String, Object>>>> geneMap = this.getGene(loci1, boundaryRange, boundaryStart, boundaryEnd);
		retMap.put("gene", geneMap);

		return retMap;
	}
	
	public Map<String, Map<Object, Object>> get_data(String loci, String windowSize, String windowSize2, String boundaryRange) {
		Map<String, Map<Object, Object>> retMap = new LinkedHashMap<String, Map<Object, Object>>();
		try {	
			String[] samples = loci.split("&");
			for(String sample : samples ) {
				String[] data = sample.split(";");
				String locus = data[3];
				String dataOrder = data[0];
				
				String[] params = locus.split(":");
				int startPt = Integer.valueOf(params[1]) - Integer.valueOf(boundaryRange);
				int endPt = Integer.valueOf(params[1]) + Integer.valueOf(boundaryRange);
				
				int heatmap_resolution = HiCService.getHeatmapDefaultResolution(Integer.valueOf(boundaryRange));

				Map<Object, Object> map = this.getDataProcessingBySingleSample(sample, windowSize, windowSize2, boundaryRange, startPt, endPt, heatmap_resolution);
	
				retMap.put(dataOrder, map);
			}
		}catch(Exception e) {
		}

		return retMap;
	}

	public Map<String, Map<Object, Object>> get_data_position(String loci, String windowSize, String windowSize2, String boundaryRange, String startPt, String endPt) {
		Map<String, Map<Object, Object>> retMap = new LinkedHashMap<String, Map<Object, Object>>();
		try {	
			String[] samples = loci.split("&");
			for(String sample : samples ) {
				String[] data = sample.split(";");
				String dataOrder = data[0];
				
				
				int heatmap_resolution = HiCService.getHeatmapDefaultResolution(Integer.valueOf(boundaryRange));
				
				int boundaryStart =  Integer.parseInt(startPt);
				int boundaryEnd =  Integer.parseInt(endPt);
				
				Map<Object, Object> map = this.getDataProcessingBySingleSample(sample, windowSize, windowSize2, boundaryRange, boundaryStart, boundaryEnd, heatmap_resolution);
	
				retMap.put(dataOrder, map);
			}
		}catch(Exception e) {
		}

		return retMap;
	}
	
	
	public List<GeneVo> getPrometerList2DisplyTable( String chrom, String startPt, String endPt, Map<String, Object> paramMap ) {
		List<String> nameList = this.hicMapper.getGenePromoter(paramMap);
		List<String> unitNameList = new ArrayList<String>();
		for(int i=0; i<nameList.size(); i++) {
			if(nameList.get(i).contains(",")){
				String[] geneNames = nameList.get(i).split(",");
				
				for(int k=0; k<geneNames.length; k++) {
					unitNameList.add(geneNames[k]);
				}
			} else {
				unitNameList.add(nameList.get(i));
			}
		}

		Map<String, List<GeneVo>> map = new HashMap<String, List<GeneVo>>();
		
		for(int i=0; i<unitNameList.size(); i++) {
			String geneName = unitNameList.get(i);
			
			List<GeneVo> voList = this.hicMapper.getGeneName(geneName);
			
			if(voList.isEmpty()){
				continue;
			}
			
			String getName = voList.get(0).getName();
			if(!map.containsKey(getName))
				map.put(getName, voList);
		}
		
		List<GeneVo> promoterList = new ArrayList<GeneVo>();
		
		if(map.isEmpty()) {
			GeneVo vo = new GeneVo();
			
			vo.setNum("1");
			vo.setChrom(chrom);
			vo.setTxStart(Integer.valueOf(startPt));
			vo.setTxEnd(Integer.valueOf(endPt));
			vo.setName("");
			vo.setLocus("");
			
			promoterList.add(vo);
		}
		
		for(Iterator<String> iter=map.keySet().iterator(); iter.hasNext();) {
			String name = iter.next();
			
			for(GeneVo vo : map.get(name)) {
				promoterList.add(vo);
			}
		}
		
		return promoterList;
	}
	
	public List<GeneVo> getPrometerList2DisplyTableHG19( String chrom, String startPt, String endPt, Map<String, Object> paramMap ) {
		List<String> nameList = this.hicMapper.getGenePromoterHG19(paramMap);
		List<String> unitNameList = new ArrayList<String>();
		for(int i=0; i<nameList.size(); i++) {
			if(nameList.get(i).contains(",")){
				String[] geneNames = nameList.get(i).split(",");
				
				for(int k=0; k<geneNames.length; k++) {
					unitNameList.add(geneNames[k]);
				}
			} else {
				unitNameList.add(nameList.get(i));
			}
		}

		Map<String, List<GeneVo>> map = new HashMap<String, List<GeneVo>>();
		
		for(int i=0; i<unitNameList.size(); i++) {
			String geneName = unitNameList.get(i);
			
			List<GeneVo> voList = this.hicMapper.getGeneNameHG19(geneName);
			
			if(voList.isEmpty()){
				continue;
			}
			
			String getName = voList.get(0).getName();
			if(!map.containsKey(getName))
				map.put(getName, voList);
		}
		
		List<GeneVo> promoterList = new ArrayList<GeneVo>();
		
		if(map.isEmpty()) {
			GeneVo vo = new GeneVo();
			
			vo.setNum("1");
			vo.setChrom(chrom);
			vo.setTxStart(Integer.valueOf(startPt));
			vo.setTxEnd(Integer.valueOf(endPt));
			vo.setName("");
			vo.setLocus("");
			
			promoterList.add(vo);
		}
		
		for(Iterator<String> iter=map.keySet().iterator(); iter.hasNext();) {
			String name = iter.next();
			
			for(GeneVo vo : map.get(name)) {
				promoterList.add(vo);
			}
		}
		
		return promoterList;
	}
	
	public List<Map<String, String>> getCharacteristicInit( String type, String name, String property, String colName ){
//		Map<String, Object> retMap = new LinkedHashMap<String, Object>();
//		
//		List<Map<String, Object>> list = this.hicMapper.getCharacteristicTypeInit();
//		
//		List<String> typeInfo = new ArrayList<String>(); 
//		List<String> nameInfo = new ArrayList<String>();
//		
//		Map<String, Object> typeNameInfo = new LinkedHashMap<String, Object>();
//		
//		for( Map<String, Object> map : list ) {
//			
//			if( !typeInfo.contains( map.get("type") ) )
//				typeInfo.add( map.get("type").toString() );
//		
//			Map<String, String> name_info = new LinkedHashMap<String, String>();
//			name_info.put("type", map.get("type").toString());
//			name_info.put("name", map.get("name").toString());
//			name_info.put("cnt", map.get("cnt").toString());
//			
//			if( !nameInfo.contains( map.get("name") ) )
//				nameInfo.add( map.get("name").toString() );
//			
//			typeNameInfo.put( map.get("type") +"||" + map.get("name") , name_info );
//			
//		}
//		
//		retMap.put("type", typeInfo);
//		retMap.put("name", nameInfo);
//		retMap.put("typeNameInfo", typeNameInfo);
//
//		return retMap;
		
		Map<String, String> param = new LinkedHashMap<String, String>();
		param.put("type", type);
		param.put("name", name);
		param.put("property", property);
		param.put("colName", colName);
		
		List<Map<String, String>> list = this.hicMapper.getCharacteristicNameInit(param);
		
		return list;
		
	}
	
	public String getExistTad(String sample_name){
		return this.hicMapper.getExistTad(sample_name);
	}

	public SampleVo getOnlyOneSample( String sampleId ) {
		return this.hicMapper.getOnlyOneSample(sampleId);
	}
	
	public List<String> getAutocompleteHicSamples( String keyword ){
		return this.hicMapper.getAutocompleteHicSamples( keyword );
	}
	
	public Map<String, Object> getCharacteristicProperty( String name ){
		Map<String, Object> retMap = new LinkedHashMap<String, Object>();

		Map<String, Object> typePropertyInfo = new LinkedHashMap<String, Object>(); 
		List<Map<String, Object>> propertyList = this.hicMapper.getCharacteristicProperty(name);
		
		List<String> propertyInfo = new ArrayList<String>();
		for( Map<String, Object> map : propertyList ) {
			Map<String, String> info = new LinkedHashMap<String, String>();
			info.put("type", map.get("type").toString());
			info.put("name", map.get("name").toString());
			info.put("property", map.get("property").toString());
			info.put("cnt", map.get("cnt").toString());
	
			typePropertyInfo.put(map.get("type") +"||" + map.get("property"), info);
			
			if( !propertyInfo.contains( map.get("property") ) )
				propertyInfo.add( map.get("property").toString() );
		}
		
		retMap.put("property", propertyInfo);
		retMap.put("typePropertyInfo", typePropertyInfo);
		
		return retMap;
	}
	
	public List<Map<String, String>> getCharacteristicSampleList( String type, String name, String property){
		Map<String, String> param = new LinkedHashMap<String, String>();
		param.put("type", type);
		param.put("name", name);
		param.put("property", property);
		
		return this.hicMapper.getCharacteristicSampleList( param );
	}
}
