package org.kobic.hicv2.capturehic.web;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.kobic.hicv2.capturehic.service.CaptureHiCService;
import org.kobic.hicv2.capturehic.vo.BinFragmentVo;
import org.kobic.hicv2.capturehic.vo.CapturedHiCVo;
import org.kobic.hicv2.capturehic.vo.CapturedSampleVo;
import org.kobic.hicv2.capturehic.vo.GeneStructureVo;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;

@Controller
public class CaptureHiCController {
	
	@Resource(name = "captureHiCService")
	private CaptureHiCService captureHiCService;
	
	@RequestMapping(value = "capturehicView", method = RequestMethod.GET)
	public String capturehicView(Locale locale, Model model) {
		
		return "pchic/capturehicView";
	}
	
	@RequestMapping(value = "capture_hic", method = RequestMethod.GET)
	public String capturehic(Locale locale, Model model) {
				
		return "pchic/pchic";
	}
	
	@RequestMapping(value = "getSampleList", method = RequestMethod.POST, produces = "text/plain;charset=UTF-8")
	@ResponseBody
	public String getSampleList(HttpServletRequest request) {
		Gson gson = new Gson();
		
		List<CapturedSampleVo> list = this.captureHiCService.getSampleList();

		return gson.toJson( list );
	}
	
	@RequestMapping(value = "getArcViewerData", method = RequestMethod.POST, produces = "text/plain;charset=UTF-8")
	@ResponseBody
	public String getArcViewerData(HttpServletRequest request) throws Exception {
		Gson gson = new Gson();
		
		String samples = request.getParameter("samples");
		int bait = Integer.parseInt(request.getParameter("bait").split(":")[1]);
		String chrom = request.getParameter("bait").split(":")[0];
		int boundary = Integer.parseInt(request.getParameter("boundary"));
		
		String[] splitSamples = samples.split("[|]");
		List<String> sampleList = new ArrayList<>();
		
		for(int i=0; i<splitSamples.length; i++){
			sampleList.add(splitSamples[i]);
		}

		BinFragmentVo promoterSite = this.captureHiCService.getBinStartPos( chrom, bait );
		
		Map<String, Object> paramMap = new LinkedHashMap<String, Object>();
		paramMap.put("chrom", chrom);
		paramMap.put("bait", promoterSite.getBin_s());
		paramMap.put("promoter_bin_s", promoterSite.getBin_s());
		paramMap.put("promoter_bin_e", promoterSite.getBin_e());
		paramMap.put("boundary", boundary);
		paramMap.put("list", sampleList);
		
		int leftBoundary = bait - (boundary + 5000);
		int rightBoundary = bait + (boundary + 5000);

		List<CapturedHiCVo> list = this.captureHiCService.getCapturedHiCData4Smoothing( paramMap );
//		List<CapturedHiCVo> list = this.capturedService.getCapturedHiCData(paramMap);

		Map<String, List<CapturedHiCVo>> dataMap = new LinkedHashMap<String, List<CapturedHiCVo>>();
		for(String sample : sampleList) {
			List<CapturedHiCVo> lst = new ArrayList<CapturedHiCVo>();
			
			for( CapturedHiCVo vo : list ) {
				if( vo.getType().equals(sample) ) lst.add( vo );
			}
			lst = captureHiCService.convolution(lst);

			dataMap.put(sample, lst);
		}

		Map<String, Object> retMap = new LinkedHashMap<String, Object>();
		retMap.put("bait", bait);
		retMap.put("promoter_start", promoterSite.getBin_s());
		retMap.put("promoter_end", promoterSite.getBin_e());
		retMap.put("chrom", chrom);
		retMap.put("start", leftBoundary<0?1:leftBoundary);
		retMap.put("end", rightBoundary);
		retMap.put("data", dataMap);
		
		return gson.toJson( retMap );
	}

	@RequestMapping(value = "getArcViewerGeneData", method = RequestMethod.POST, produces = "text/plain;charset=UTF-8")
	@ResponseBody
	public String getArcViewerGeneData(HttpServletRequest request) throws Exception {
		int bait = Integer.parseInt(request.getParameter("bait"));
		String chrom = request.getParameter("chrom");
		int boundary = Integer.parseInt(request.getParameter("boundary"));

		int leftBoundary = bait - (boundary + 5000);
		int rightBoundary = bait + (boundary + 5000);

		Map<String, Object> paramMap = new HashMap<String, Object>();
		paramMap.put("chrom", chrom);
		paramMap.put("startPt", leftBoundary);
		paramMap.put("endPt", rightBoundary);
		
		List<GeneStructureVo> list = this.captureHiCService.getGeneData( paramMap );
		
		Gson gson = new Gson();

		return gson.toJson( list );
	}
	
	@RequestMapping(value = "getArcViewerGencodeData", method = RequestMethod.POST, produces = "text/plain;charset=UTF-8")
	@ResponseBody
	public String getArcViewerGencodeData(HttpServletRequest request) throws Exception {
		int bait = Integer.parseInt(request.getParameter("bait"));
		String chrom = request.getParameter("chrom");
		int boundary = Integer.parseInt(request.getParameter("boundary"));

		int leftBoundary = bait - (boundary + 5000);
		int rightBoundary = bait + (boundary + 5000);

		Map<String, Object> paramMap = new HashMap<String, Object>();
		paramMap.put("chrom", chrom);
		paramMap.put("startPt", leftBoundary);
		paramMap.put("endPt", rightBoundary);
		
		List<GeneStructureVo> list = this.captureHiCService.getGencodeData( paramMap );
		
		Gson gson = new Gson();

		return gson.toJson( list );
	}

	@RequestMapping(value = "autocomplete19Genes", method = RequestMethod.POST, produces = "text/plain;charset=UTF-8")
	@ResponseBody
	public String autocomplete19Genes(HttpServletRequest request) {
		Gson gson = new Gson();
		
		String keyword = request.getParameter("value");

		String line = gson.toJson( this.captureHiCService.getAutoCompleteGeneSymbolHg19(keyword) );
		
		return line;
	}
	
	@RequestMapping(value = "get_gene_symbols_hg19", method = RequestMethod.POST, produces = "text/plain;charset=UTF-8")
	@ResponseBody
	public String getGeneSymbolData(HttpServletRequest request) {
		Gson gson = new Gson();
		
		String param = request.getParameter("symbol");

		String line = gson.toJson( this.captureHiCService.getLociOfTssInSpecificGene(param) );
		
		return line;
	}
}