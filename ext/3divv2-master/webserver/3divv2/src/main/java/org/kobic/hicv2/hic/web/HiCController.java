package org.kobic.hicv2.hic.web;


import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.kobic.hicv2.hic.service.HiCService;
import org.kobic.hicv2.hic.vo.SampleVo;
import org.kobic.hicv2.util.LZString;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;
import org.xerial.snappy.Snappy;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

@Controller
public class HiCController {
	
	@Resource(name = "hicService")
	private HiCService hicService;
	
	@RequestMapping(value = "hicView", method = RequestMethod.GET)
	public String hicView(Locale locale, Model model) {
		
		return "hic/hicView";
	}
	
	@RequestMapping(value = "hic", method = {RequestMethod.POST, RequestMethod.GET})
	public ModelAndView hic(Locale locale) {
		ModelAndView model = new ModelAndView("hic/hic");
		
		List<SampleVo> list = this.hicService.getSampleList();
		
		model.addObject( "sampleList", list );
		
		return model;
	}
	
	
	@RequestMapping(value = "uploadSetting", method = RequestMethod.POST, produces = "text/plain;charset=UTF-8")
	@ResponseBody
	public String uploadSetting(HttpServletRequest request, @RequestParam("jsonFile") MultipartFile jsonFile) throws Exception {
		String savePath = request.getSession().getServletContext().getRealPath("uploadFolder");
		
		String fileName = "//" + jsonFile.getOriginalFilename().split(".json")[0] + "_" + System.currentTimeMillis() + ".json";
		String filePath = savePath + fileName;
		
		File file = new File(filePath);
		jsonFile.transferTo(file);
		
		JSONParser parser = new JSONParser();
		
		Gson gson = new Gson();
		String line = null;
		
		try {
			Object obj = parser.parse(new FileReader(filePath));
			
			JSONObject jobj = (JSONObject) obj;
			
			String tab = (String) jobj.get("tab");
			
			String windowSize = (String) jobj.get("windowSize");
			String windowSize2 = (String) jobj.get("windowSize2");
			String boundaryRange = (String) jobj.get("boundaryRange");	
			String boundary_start = (String) jobj.get("rangeStart");	
			String boundary_end = (String) jobj.get("rangeEnd");
			
			Map<Integer, Map<String, String>> itemsMap = new HashMap<Integer, Map<String, String>>();
			
			Map<String, Object> retMap = new HashMap<String, Object>();
			if(tab.equals("multiple_samples")) {
				String loci = (String) jobj.get("loci");
				
				String[] items = loci.split("&");
				
				for(int i=0; i< items.length; i++) {
					Map<String, String> itemMap = new HashMap<String, String>();
					
					String no = items[i].split(";")[1];
					String sample = items[i].split(";")[2];
					String bait = items[i].split(";")[3];
					String tad = items[i].split(";")[4];
					
					itemMap.put("no", no);
					itemMap.put("sample", sample);
					itemMap.put("bait", bait);
					itemMap.put("tad", tad);
					
					itemsMap.put(i, itemMap);
				}
				
				Map<String, Map<Object, Object>> map = new HashMap<String, Map<Object,Object>>();
				
				if(boundaryRange == null){
					boundaryRange = String.valueOf((Integer.parseInt(boundary_end) - Integer.parseInt(boundary_start)) / 2) ; 
					map = this.hicService.get_data_position(loci, windowSize, windowSize2, boundaryRange, boundary_start, boundary_end);
				} else {
					map = this.hicService.get_data(loci, windowSize, windowSize2, boundaryRange);
				}
				
				retMap.put("items", itemsMap);
				retMap.put("data", map);
				retMap.put("tab", tab);
			} else if(tab.equals("search_samples")) {
				String loci = (String) jobj.get("loci");
				
				String[] items = loci.split("&");
				
				for(int i=0; i< items.length; i++) {
					Map<String, String> itemMap = new HashMap<String, String>();
					
					String no = items[i].split(";")[1];
					String sample = items[i].split(";")[2];
					String bait = items[i].split(";")[3];
					
					itemMap.put("no", no);
					itemMap.put("sample", sample);
					itemMap.put("bait", bait);
					
					itemsMap.put(i, itemMap);
				}

				Map<String, Object> map = new HashMap<String, Object>();

				if( boundaryRange == null ) boundaryRange = "0";
				if( boundary_start == null ) boundary_start = "0";
				if( boundary_end == null ) boundary_end = "0";
				map = this.hicService.getEpigenomics(loci, boundaryRange, Integer.parseInt(boundary_start), Integer.parseInt(boundary_end));

				
				retMap.put("items", itemsMap);
				retMap.put("data", map);
				retMap.put("tab", tab);

			} else {
				String loci1 = (String) jobj.get("loci1");
				String loci2 = (String) jobj.get("loci2");
				String heatmap_windowsize = (String) jobj.get("heatmap_windowsize");
				
				Map<String, String> itemMap = new HashMap<String, String>();
				
				String no = loci1.split(";")[1];
				String sample = loci1.split(";")[2];
				String bait = loci1.split(";")[3];
				
				itemMap.put("no", no);
				itemMap.put("sample", sample);
				itemMap.put("bait", bait);
				
				itemsMap.put(0, itemMap);
				
				itemMap = new HashMap<String, String>();
				
				no = loci2.split(";")[1];
				sample = loci2.split(";")[2];
				bait = loci2.split(";")[3];
				
				itemMap.put("no", no);
				itemMap.put("sample", sample);
				itemMap.put("bait", bait);
				
				itemsMap.put(1, itemMap);
				
				retMap.put("items", itemsMap);
				
				if(boundaryRange == null){boundaryRange = String.valueOf((Integer.parseInt(boundary_end) - Integer.parseInt(boundary_start)) / 2) ;
					retMap.put("data", this.hicService.get_data_4_position_comparison(loci1, loci2, windowSize, windowSize2, boundaryRange, heatmap_windowsize, boundary_start, boundary_end)); }
				else {retMap.put("data", this.hicService.get_data_4_comparison(loci1, loci2, windowSize, windowSize2, boundaryRange, heatmap_windowsize));}
				retMap.put("tab", tab);
			}

			line = gson.toJson( retMap );

		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return line;
	}
	
	@RequestMapping(value = "/downloads", method = RequestMethod.GET)
	public void doDownload(HttpServletRequest request, HttpServletResponse response) throws Exception {
		hicService.download(request, response);
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "saveSetting", method = RequestMethod.POST, produces = "text/plain;charset=UTF-8")
	@ResponseBody
	public String saveSetting(HttpServletRequest request) {
		Gson gson = new Gson();

		String tab = request.getParameter("tab");
		
		
		String windowSize = request.getParameter("window_size");
		String windowSize2 = request.getParameter("window_size2");
		String boundaryRange = request.getParameter("boundary_range");
		String startPt = request.getParameter("startPt");
		String endPt = request.getParameter("endPt");

		JSONObject jobj = new JSONObject();
		
		jobj.put("windowSize", windowSize);
		jobj.put("windowSize2", windowSize2);
		if(boundaryRange.equals("1")){
			jobj.put("rangeStart", startPt);
			jobj.put("rangeEnd", endPt);
		}
		else jobj.put("boundaryRange", boundaryRange);
		jobj.put("tab", tab);
		

		if(tab.equals("multiple_samples")) {
			String loci = request.getParameter("loci");
			
			jobj.put("loci", loci);
		} else if(tab.equals("search_samples")) {
			String loci = request.getParameter("loci");
			
			jobj.put("loci", loci);
		} else {
			String loci1 = request.getParameter("loci1");
			String loci2 = request.getParameter("loci2");
			String heatmap_windowsize = request.getParameter("heatmap_windowsize");
			
			jobj.put("loci1", loci1);
			jobj.put("loci2", loci2);
			jobj.put("heatmap_windowsize", heatmap_windowsize);
		}

		
		ServletContext context = request.getSession().getServletContext();
		String appPath = context.getRealPath("");
		
		String filePath = appPath + File.separator + "downloadFolder" + File.separator + HiCService.getFileName( );
		
		try {
			HiCService.getSettingDownload(jobj, filePath);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return gson.toJson( filePath );
	}

	/**
	 *  Interaction rage 옵션이 50K, 2M 등 인 경우 수행됨 In Interaction visualization Tab
	 * @throws IOException 
	 */
	@RequestMapping(value = "get_data", method = RequestMethod.POST, produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
	@ResponseBody
	public String get_data(HttpServletRequest request) throws IOException {
		Gson gson = new Gson();

		String loci = request.getParameter("loci");
		String windowSize = request.getParameter("window_size");
		String windowSize2 = request.getParameter("window_size2");
		String boundaryRange = request.getParameter("boundary_range");

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

				Map<Object, Object> map = this.hicService.getDataProcessingBySingleSample(sample, windowSize, windowSize2, boundaryRange, startPt, endPt, heatmap_resolution);

				retMap.put(dataOrder, map);
			}
		}catch(Exception e) {
		}

		String line = gson.toJson( retMap );
//		String compress = LZString.compressToBase64(line);
		
		byte[] compressed2 = Snappy.compress( line );
//		
		String encoded222 = Base64.getEncoder().encodeToString(compressed2);
		
		String aa = new String(Snappy.uncompress( Base64.getDecoder().decode( encoded222 ) ));
		
		System.out.println( "==============> " + (aa.equals(line) + " <=================") );

//		return encoded2222;
		return encoded222;
//		return compress;
	}

	/**
	 *  Interaction rage 옵션이 Genomic position인 경우 수행됨 In Interaction visualization Tab
	 * @throws IOException 
	 */
	@RequestMapping(value = "get_data_position", method = RequestMethod.POST, produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
	@ResponseBody
	public String get_data_position(HttpServletRequest request) throws IOException {
		Gson gson = new Gson();

		String loci = request.getParameter("loci");
		String windowSize = request.getParameter("window_size");
		String windowSize2 = request.getParameter("window_size2");
		String boundaryRange = request.getParameter("boundary_range");
		String startPt = request.getParameter("boundary_start");
		String endPt = request.getParameter("boundary_end");

		Map<String, Map<Object, Object>> retMap = new LinkedHashMap<String, Map<Object, Object>>();
		try {			
			String[] samples = loci.split("&");
			for(String sample : samples ) {
				String[] data = sample.split(";");
				String dataOrder = data[0];

				int heatmap_resolution = HiCService.getHeatmapDefaultResolution(Integer.valueOf(boundaryRange));
	
				Map<Object, Object> map = this.hicService.getDataProcessingBySingleSample(sample, windowSize, windowSize2, boundaryRange, Integer.parseInt(startPt), Integer.parseInt(endPt), heatmap_resolution);
	
				retMap.put(dataOrder, map);
			}
		}catch(Exception e) {
//			logger.error( e.getMessage() );
		}

		String line = gson.toJson( retMap );

//		String compress = LZString.compressToBase64(line);
//
//		return compress;
		byte[] compressed2 = Snappy.compress( line );
//		
		String encoded222 = Base64.getEncoder().encodeToString(compressed2);
		
		String aa = new String(Snappy.uncompress( Base64.getDecoder().decode( encoded222 ) ));
		
		System.out.println( "==============> " + (aa.equals(line) + " <=================") );

//		return encoded2222;
		return encoded222;
	}

	@RequestMapping(value = "get_data_4_comparison", method = RequestMethod.POST, produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
	@ResponseBody
	public String get_data_4_comparison(HttpServletRequest request) throws Exception {
		Gson gson = new Gson();

		String loci1 = request.getParameter("loci1");
		String loci2 = request.getParameter("loci2");
		String windowSize = request.getParameter("window_size");
		String windowSize2 = request.getParameter("window_size2");
		String boundaryRange = request.getParameter("boundary_range");
		String heatmap_windowsize = request.getParameter("heatmap_windowsize");
		String threshold = request.getParameter("threshold");

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
		retMap.put("threshold", threshold);
		
		this.hicService.getPairwiseData(retMap, loci1, loci2, windowSize, windowSize2, boundaryRange, Integer.valueOf( startPt ), Integer.valueOf( endPt ), Integer.valueOf( heatmap_windowsize ));
		
		Map<String, Map<Integer, List<Map<String, Object>>>> geneMap = this.hicService.getGene(loci1, boundaryRange, startPt, endPt);
		retMap.put("gene", geneMap);
		
		Map<String, Map<Integer, List<Map<String, Object>>>> gencodeMap = this.hicService.getGencode(loci1, boundaryRange, startPt, endPt);
		retMap.put("gencode", gencodeMap);
		
		String line = gson.toJson( retMap );

//		return line;
//		String compress = LZString.compressToBase64(line);
//
//		return compress;
		
		byte[] compressed2 = Snappy.compress( line );
//		
		String encoded222 = Base64.getEncoder().encodeToString(compressed2);
		
		String aa = new String(Snappy.uncompress( Base64.getDecoder().decode( encoded222 ) ));
		
		System.out.println( "==============> " + (aa.equals(line) + " <=================") );

//		return encoded2222;
		return encoded222;
	}
	
	@RequestMapping(value = "get_data_position_4_comparison", method = RequestMethod.POST, produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
	@ResponseBody
	public String get_data_position_4_comparison(HttpServletRequest request) throws Exception {
		Gson gson = new Gson();

		String loci1 = request.getParameter("loci1");
		String loci2 = request.getParameter("loci2");
		String windowSize = request.getParameter("window_size");
		String windowSize2 = request.getParameter("window_size2");
		String boundaryRange = request.getParameter("boundary_range");
		String startPt = request.getParameter("boundary_start");
		String endPt = request.getParameter("boundary_end");
		String heatmap_windowsize = request.getParameter("heatmap_windowsize");

		String[] params = loci1.split(":");

		Map<String, Object> retMap = new LinkedHashMap<String, Object>();
		
		retMap.put("bait", params[0] + ":" + startPt + "-" + endPt);
		retMap.put("windowSize", windowSize);
		retMap.put("windowSize2", windowSize2);
		retMap.put("startPt", startPt);
		retMap.put("endPt", endPt);
		retMap.put("boundaryRange", boundaryRange);

		this.hicService.getPairwiseData(retMap, loci1, loci2, windowSize, windowSize2, boundaryRange, Integer.valueOf( startPt ), Integer.valueOf( endPt ), Integer.valueOf( heatmap_windowsize ));

		Map<String, Map<Integer, List<Map<String, Object>>>> geneMap = this.hicService.getGene(loci1, boundaryRange, Integer.parseInt(startPt), Integer.parseInt(endPt));
		retMap.put("gene", geneMap);
		
		Map<String, Map<Integer, List<Map<String, Object>>>> gencodeMap = this.hicService.getGencode(loci1, boundaryRange, Integer.parseInt(startPt), Integer.parseInt(endPt));
		retMap.put("gencode", gencodeMap);
		
		String line = gson.toJson( retMap );

//		return line;
//		String compress = LZString.compressToBase64(line);
//
//		return compress;
		
		byte[] compressed2 = Snappy.compress( line );
//		
		String encoded222 = Base64.getEncoder().encodeToString(compressed2);
		
		String aa = new String(Snappy.uncompress( Base64.getDecoder().decode( encoded222 ) ));
		
		System.out.println( "==============> " + (aa.equals(line) + " <=================") );

//		return encoded2222;
		return encoded222;
	}

	@RequestMapping(value = "get_single_data", method = RequestMethod.POST, produces = "text/plain;charset=UTF-8")
	@ResponseBody
	public String get_single_data(HttpServletRequest request) {
		Gson gson = new Gson();

		String loci = request.getParameter("loci");
		String windowSize = request.getParameter("window_size");
		String windowSize2 = request.getParameter("window_size2");
		String boundaryRange = request.getParameter("boundary_range");
		String heatmap_windowSize = request.getParameter("heatmap_window_size");


		String[] param = loci.split(";");
		String[] params = param[3].split(":");
		int startPt = Integer.valueOf(params[1]) - Integer.valueOf(boundaryRange);
		int endPt = Integer.valueOf(params[1]) + Integer.valueOf(boundaryRange);
		
		String sampleNumber = param[1];

		String line = "";
		try {
			Map<Object, Object> retMap = null;
			if( !sampleNumber.equals("-1") )
				retMap = this.hicService.getDataProcessingBySingleSample(loci, windowSize, windowSize2, boundaryRange, startPt, endPt, Integer.valueOf( heatmap_windowSize ) );

			line = gson.toJson( retMap );

		}catch(Exception e) {
//			logger.error( e.getMessage() );
		}
		return line;
	}
	
	@RequestMapping(value = "get_change_range", method = RequestMethod.POST, produces = "text/plain;charset=UTF-8")
	@ResponseBody
	public String getChangeRange(HttpServletRequest request) {
		Gson gson = new Gson();

		String loci = request.getParameter("loci");
		String bothPt = request.getParameter("startEndPt");
		String windowSize = request.getParameter("window_size");
		String windowSize2 = request.getParameter("window_size2");
		String boundaryRange = request.getParameter("boundary_range");
		String heatmap_windowSize = request.getParameter("heatmap_window_size");
		String threshold = request.getParameter("threshold");
		
		String[] params = bothPt.split(",");
		int startPt = Integer.valueOf(params[0]);
		int endPt = Integer.valueOf(params[1]);
		
		String[] splitLoci = loci.split(";");
		String sampleNumber = splitLoci[1];

		String line = "";
		try {
			Map<Object, Object> retMap = null;
			if(!sampleNumber.equals("-1"))
				retMap = this.hicService.getDataProcessingBySingleSample(loci, windowSize, windowSize2, boundaryRange, startPt, endPt, Integer.valueOf( heatmap_windowSize ) );
			
			retMap.put("threshold", threshold);

			line = gson.toJson( retMap );
		}catch(Exception e) {
			e.printStackTrace();
//			logger.equals( e.getMessage() );
		}

		return line;
	}

	@RequestMapping(value = "get_change_range_4_comparison", method = RequestMethod.POST, produces = "text/plain;charset=UTF-8")
	@ResponseBody
	public String getChangeRange4Comparison(HttpServletRequest request) throws Exception {
		Gson gson = new Gson();

		String loci1 = request.getParameter("loci1");
		String loci2 = request.getParameter("loci2");
		String bothPt = request.getParameter("startEndPt");
		String windowSize = request.getParameter("window_size");
		String windowSize2 = request.getParameter("window_size2");
		String boundaryRange = request.getParameter("boundary_range");
		String heatmap_window_size = request.getParameter("heatmap_window_size");
		String threshold = request.getParameter("threshold");

		String[] params = loci1.split(":");

		String[] posParams = bothPt.split(",");
		int startPt = Integer.valueOf(posParams[0]);
		int endPt = Integer.valueOf(posParams[1]);
		
		Map<String, Object> retMap = new LinkedHashMap<String, Object>();
		
		retMap.put("bait", params[0] + ":" + startPt + "-" + endPt);
		retMap.put("windowSize", windowSize);
		retMap.put("windowSize2", windowSize2);
		retMap.put("startPt", startPt);
		retMap.put("endPt", endPt);
		retMap.put("boundaryRange", boundaryRange);
		retMap.put("threshold", threshold);
		
		this.hicService.getPairwiseData(retMap, loci1, loci2, windowSize, windowSize2, boundaryRange, Integer.valueOf( startPt ), Integer.valueOf( endPt ), Integer.valueOf( heatmap_window_size ));
		
		Map<String, Map<Integer, List<Map<String, Object>>>> geneMap = this.hicService.getGene(loci1, boundaryRange, startPt, endPt);
		retMap.put("gene", geneMap);

		String line = gson.toJson( retMap );
		
		return line;
	} 

	
	/**************************************************************************************************************
	 * Bait 정보를 입력할 때 Gene symbol을 넣을 경우
	 * 유전자 정보를 조회해 TSS 정보를 읽어와 리턴해주는 메소드
	 * 
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "get_gene_symbols", method = RequestMethod.POST, produces = "text/plain;charset=UTF-8")
	@ResponseBody
	public String getGeneSymbolData(HttpServletRequest request) {
		Gson gson = new Gson();
		
		String param = request.getParameter("symbol");

		String line = gson.toJson( this.hicService.getLociOfTssInSpecificGene(param) );
		
		return line;
	}
	
	@RequestMapping(value = "get_gene", method = RequestMethod.POST, produces = "text/plain;charset=UTF-8")
	@ResponseBody
	public String getGene(HttpServletRequest request) {
		Gson gson = new Gson();
		
		String chrom = request.getParameter("chrom");
		String startPt = request.getParameter("startPt");
		String endPt = request.getParameter("endPt");

		Map<String,Object> paramMap = new HashMap<String, Object>();
		paramMap.put("chrom", chrom);
		paramMap.put("startPt", startPt);
		paramMap.put("endPt", endPt);

		String line = gson.toJson( this.hicService.getPrometerList2DisplyTable(chrom, startPt, endPt, paramMap) );

		return line;
	}
	
	@RequestMapping(value = "get_gene_hg19", method = RequestMethod.POST, produces = "text/plain;charset=UTF-8")
	@ResponseBody
	public String getGeneHg19(HttpServletRequest request) {
		Gson gson = new Gson();
		
		String chrom = request.getParameter("chrom");
		String startPt = request.getParameter("startPt");
		String endPt = request.getParameter("endPt");

		Map<String,Object> paramMap = new HashMap<String, Object>();
		paramMap.put("chrom", chrom);
		paramMap.put("startPt", startPt);
		paramMap.put("endPt", endPt);

		String line = gson.toJson( this.hicService.getPrometerList2DisplyTableHG19(chrom, startPt, endPt, paramMap) );

		return line;
	}

	/* multiple heatmap resolution refresh */
	@RequestMapping(value = "get_heatmap", method = RequestMethod.GET, produces = "text/plain;charset=UTF-8")
	@ResponseBody
	public String getHeatMap(HttpServletRequest request) throws Exception{
		String loci = request.getParameter("loci");
		String sampleId = request.getParameter("sampleId");
		int heatmapWindowSize = Integer.parseInt(request.getParameter("heatmapWindowSize"));
		int startPt = Integer.parseInt(request.getParameter("startPt"));
		int endPt = Integer.parseInt(request.getParameter("endPt"));
//		String sampleName = request.getParameter("sampleName");
		String tad = request.getParameter("tad");
		
		String[] params = loci.split(":");
		String chr = params[0];

		JsonObject heatmapJson = null;

		if(!sampleId.equals("-1")) {
			SampleVo sampleVo = this.hicService.getOnlyOneSample(sampleId);
			
			heatmapJson = this.hicService.getHeatMapLast(chr, sampleVo, startPt, endPt, heatmapWindowSize, tad);
		}

		String line = heatmapJson.toString();

		return line;
	}
	
	@RequestMapping(value = "autocomplete", method = RequestMethod.POST, produces = "text/plain;charset=UTF-8")
	@ResponseBody
	public String autocomplete(HttpServletRequest request) {
		Gson gson = new Gson();
		
		String keyword = request.getParameter("value");

		String line = gson.toJson( this.hicService.getAutoCompleteGeneSymbol(keyword) );
		
		return line;
	}
	
	@RequestMapping(value = "/pairwise", method = {RequestMethod.POST, RequestMethod.GET})
	public ModelAndView pairwise(Locale locale) {
		ModelAndView model = new ModelAndView("hic/pairwise");
		model.addObject( "sampleList", this.hicService.getSampleList() );
		
		return model;
	}
	
	/* pairwise heatmap resolution refresh */
	@RequestMapping(value = "get_pairwise_heatmap", method = RequestMethod.POST, produces = "text/plain;charset=UTF-8")
	@ResponseBody
	public String get_compare_heatmap(HttpServletRequest request) {
		String loci1 = request.getParameter("loci1");
		String loci2 = request.getParameter("loci2");
		String windowSize = request.getParameter("windowSize");
		String windowSize2 = request.getParameter("windowSize2");
		int heatmapWindowSize = Integer.parseInt(request.getParameter("heatmapWindowSize"));
		int startPt = Integer.parseInt(request.getParameter("startPt"));
		int endPt = Integer.parseInt(request.getParameter("endPt"));
		
		Map<String, Object> retMap = new LinkedHashMap<String, Object>();

		String line = this.hicService.getOnlyDiffHeatMapData(retMap, loci1, loci2, windowSize, windowSize2, startPt, endPt, heatmapWindowSize);

		return line;
	}
	@RequestMapping(value = "get_epigenomics", method = RequestMethod.POST, produces = "text/plain;charset=UTF-8")
	@ResponseBody
	public String get_epigenomics(HttpServletRequest request) {
		Gson gson = new Gson();

		String loci = request.getParameter("loci");
		String boundaryRange = request.getParameter("boundary_range");
		String startPt = request.getParameter("startPt");
		String endPt = request.getParameter("endPt");
		
		Map<String, Object> map = new HashMap<String, Object>();
		
		if(startPt == null) startPt = "0";
		if(endPt == null) endPt = "0";
		
		try {	
			map = this.hicService.getEpigenomics(loci, boundaryRange, Integer.parseInt(startPt), Integer.parseInt(endPt));
			
		}catch(Exception e) {
//			logger.error( e.getMessage() );
		}
		String line = gson.toJson(map);

		return line;
	}
	
	@RequestMapping(value = "get_characteristic", method = RequestMethod.POST, produces = "text/plain;charset=UTF-8")
	@ResponseBody
	public String getCharacteristic(HttpServletRequest request) {
		Gson gson = new Gson();
		
		String type = request.getParameter("type");
		String name = request.getParameter("name");
		String property = request.getParameter("property");
		String colName = request.getParameter("colName");
		
		return gson.toJson(this.hicService.getCharacteristicInit( type, name, property, colName ));
	}
	
	@RequestMapping(value = "get_autocomplete_hic_samples", method = RequestMethod.POST, produces = "text/plain;charset=UTF-8")
	@ResponseBody
	public String getAutocompleteHicSamples(HttpServletRequest request) {
		Gson gson = new Gson();

		String keyword = request.getParameter("keyword");
		
		Map<String, Object> map = new HashMap<String, Object>();
		
		return gson.toJson(this.hicService.getAutocompleteHicSamples( keyword ));
	}
	
	@RequestMapping(value = "get_characteristic_property", method = RequestMethod.POST, produces = "text/plain;charset=UTF-8")
	@ResponseBody
	public String getCharacteristicProperty(HttpServletRequest request) {
		Gson gson = new Gson();

		String name = request.getParameter("name");
		
		return gson.toJson(this.hicService.getCharacteristicProperty( name ));
	}
	
	@RequestMapping(value = "get_characteristic_sample_list", method = RequestMethod.POST, produces = "text/plain;charset=UTF-8")
	@ResponseBody
	public String getCharacteristicSampleList(HttpServletRequest request) {
		Gson gson = new Gson();

		String type = request.getParameter("type");
		String name = request.getParameter("name");
		String property = request.getParameter("property");
		
		return gson.toJson(this.hicService.getCharacteristicSampleList( type, name, property ));
	}
	
	
}