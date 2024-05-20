package org.kobic.hicv2.cancerhic.web;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.EmptyStackException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.zip.DataFormatException;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.kobic.hicv2.cancerhic.obj.ChromBinObj;
import org.kobic.hicv2.cancerhic.obj.SampleParamObj;
import org.kobic.hicv2.cancerhic.service.CancerHiCService;
import org.kobic.hicv2.cancerhic.vo.GeneWithBinVo;
import org.kobic.hicv2.cancerhic.vo.GenomeLengthVo;
import org.kobic.hicv2.cancerhic.vo.PreFoundedSvVo;
import org.kobic.hicv2.cancerhic.vo.SampleInfoVo;
import org.kobic.hicv2.cancerhic.vo.StudyInfoVo;
import org.kobic.hicv2.hic.vo.SuperEnhancerVo;
import org.kobic.hicv2.parser.ParserException;
import org.kobic.hicv2.util.Utils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import org.xerial.snappy.Snappy;

import com.google.gson.Gson;

@Controller
public class CancerHiCController {
	private static final Logger logger = LoggerFactory.getLogger(CancerHiCController.class);
	
	@Resource(name = "cancerHiCService")
	private CancerHiCService cancerHiCService;

	@RequestMapping(value = "getContactMapDataFromBedFormats", method = {RequestMethod.POST, RequestMethod.GET}, produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
	@ResponseBody
	public String getContactMapDataFromBedFormats(HttpServletRequest request) throws IOException, DataFormatException {
		Gson gson = new Gson();

		SampleParamObj[] samplesArray = gson.fromJson( request.getParameter("samples"), SampleParamObj[].class);
		String[] bed_data_params = gson.fromJson( request.getParameter("bed_data"), String[].class);
		double threshold = Utils.null2Zero( request.getParameter("threshold") );
		String getDataType = request.getParameter("get_data_type");
		int resolution = (int) Utils.null2Value( request.getParameter("resolution"), ChromBinObj._500K_ );

		List<SampleParamObj> samplesList = Arrays.asList( samplesArray );

		List<ChromBinObj> chromObjList = new ArrayList<ChromBinObj>();
		for(String bed_data : bed_data_params) {
			String[] div = bed_data.split(":");
			String[] pos = div[1].split("-");

			String chrom = div[0];

			ChromBinObj binObj = new ChromBinObj( chrom, Math.min( Long.parseLong(pos[0]), Long.parseLong(pos[1]) ), Math.max( Long.parseLong(pos[0]), Long.parseLong(pos[1]) ), resolution );
			chromObjList.add( binObj );

			logger.info( chrom + ":" + binObj.getStartBin() + "-" + binObj.getEndBin() );
		}

//		long start1 = System.currentTimeMillis();
		String line = gson.toJson( this.cancerHiCService.getAnyInteractions500kNewTechV3( chromObjList, samplesList, threshold, getDataType, resolution ) );

		byte[] data = line.getBytes("UTF-8");
		
//		long start11 = System.currentTimeMillis();
//		byte[] zlib = ZLib.compress( line );

		long start22 = System.currentTimeMillis();
		byte[] compressed2 = Snappy.compress(data);
		long end22 = System.currentTimeMillis();
		logger.debug( "==========> Snappy compression : " + ((end22-start22) / 1000) + "sec" );
//		logger.debug( "==========> Zlib compression : " + ((start22-start11) / 1000) + "sec" );
		
//		System.out.println( ZLib.decompress( zlib ).equals(line) );
//		
		String encoded222 = Base64.getEncoder().encodeToString(compressed2);
		
//		String encoded2222 = Base64.getEncoder().encodeToString(zlib);

		logger.debug( line.length() + " vs " + encoded222.length() + "(" + compressed2.length + ")" );

//		return encoded2222;
		return encoded222;
	}

	@RequestMapping(value = "cancerhicView", method = {RequestMethod.GET, RequestMethod.POST})
	public ModelAndView cancerhicView(HttpServletRequest request, Model model) {
		ModelAndView mnv = null;

		String whichTab = Utils.null2String(request.getParameter("which_tab"), "1");
		String jsonSamples = request.getParameter("json_samples");
		String jsonRegions = request.getParameter("json_regions");
		String jsonExtraTracks = request.getParameter("json_extra_tracks");
		String jsonOptionGene = request.getParameter("json_option_gene");
		String colorPalette = request.getParameter("color_palette");
		String type = request.getParameter("type");
		String resolution = request.getParameter("resolution");
		String textarea_bed_format = request.getParameter("param_textarea_bed_format");
		String genomeSize = request.getParameter("genomeSize");
		String chosen_sv_type = request.getParameter("chosen_sv_type");
		
		logger.debug( "JSON samples : " + jsonSamples );
		logger.debug( "JSON regions : " + jsonRegions );
		logger.debug( "type : " + type );
		
		logger.debug("================================================================= > whichTab : " + whichTab );

		if( whichTab.equals("1") ) 			mnv = new ModelAndView("cancerhic/cancerhicPrecalledSvViewer");
		else if( whichTab.equals("2") )		mnv = new ModelAndView("cancerhic/cancerhicUserdefiningSvViewer");
		else								mnv = new ModelAndView("cancerhic/cancerhicDynamicRearrangeViewer");

		mnv.addObject("json_samples", jsonSamples);
		mnv.addObject("json_regions", jsonRegions);
		mnv.addObject("json_extra_tracks", jsonExtraTracks);
		mnv.addObject("json_option_gene", jsonOptionGene);
		mnv.addObject("color_palette", colorPalette);
		mnv.addObject("type", type);
		mnv.addObject("resolution", resolution);
		mnv.addObject("textarea_bed_format", textarea_bed_format);
		mnv.addObject("genomeSize", genomeSize);

		if( whichTab.equals("1") ) 			mnv.addObject("chosen_sv_type", chosen_sv_type);
		
		logger.debug("================================================================= > textarea_bed_format : " + textarea_bed_format );

		return mnv;
	}
	
	@RequestMapping(value = "cancer_hic", method = {RequestMethod.GET, RequestMethod.POST})
	public ModelAndView cancerhic(Locale locale, Model model, @RequestParam(value="tab", required = false) String tab) {
		ModelAndView mnv = new ModelAndView("cancerhic/cancerhic");
		
		Gson gson = new Gson();
		
		tab = Utils.null2String(tab, "1");

		Map<String, GenomeLengthVo> map = this.cancerHiCService.getGenomeSizeHg18();
		
		mnv.addObject( "studyList", this.cancerHiCService.getStudyInfo() );
		mnv.addObject( "sampleList", this.cancerHiCService.getSampleList() );
		mnv.addObject( "chromosomeList", this.cancerHiCService.getChromosomeList() );
		mnv.addObject( "genomeSize", gson.toJson( map ) );
		mnv.addObject( "which_tab", tab );

		return mnv;
	}
	
	@RequestMapping(value = "getAutocompleteSamples", method = {RequestMethod.POST, RequestMethod.GET}, produces = "text/plain;charset=UTF-8")
	@ResponseBody
	public String getAutocompleteSamples(HttpServletRequest request) throws EmptyStackException, ParserException {
		String query = request.getParameter("q");
		String type = request.getParameter("type");
		String study_id = request.getParameter("study");
		Gson gson = new Gson();

		if( query.isEmpty() ) 								query		= null;
		if( study_id.isEmpty() || study_id.equals("-1") )	study_id	= null;

		List<SampleInfoVo> lst = null;
		if( query == null )	lst = this.cancerHiCService.getSampleList( query, type, study_id );
		else				lst = this.cancerHiCService.doQueryEvaluate( query, type, study_id );

		return gson.toJson( lst );		
	}
	
	@RequestMapping(value = "getAutocompleteSamplesBak", method = {RequestMethod.POST, RequestMethod.GET}, produces = "text/plain;charset=UTF-8")
	@ResponseBody
	public String getAutocompleteSamplesBak(HttpServletRequest request) {
		String query = request.getParameter("q");
		String type = request.getParameter("type");
		String study_id = request.getParameter("study");
		Gson gson = new Gson();

		if( query.isEmpty() ) 		query = null;
		if( study_id.isEmpty() )	study_id = null;

		if( type.equals("case") && study_id == null ) return null;

		List<SampleInfoVo> lst = this.cancerHiCService.getSampleList( query, type, study_id );

		return gson.toJson( lst );
	}
	
	@RequestMapping(value = "getAutocompleteStudy", method = {RequestMethod.POST, RequestMethod.GET}, produces = "text/plain;charset=UTF-8")
	@ResponseBody
	public String getAutocompleteStudy(HttpServletRequest request) {
		Gson gson = new Gson();
		
		List<StudyInfoVo> lst = this.cancerHiCService.getStudyInfo();
		return gson.toJson( lst );
	}
	
	@RequestMapping(value = "getSampleTableName", method = {RequestMethod.POST, RequestMethod.GET}, produces = "text/plain;charset=UTF-8")
	@ResponseBody
	public String getSampleTableName(HttpServletRequest request) {
		String sample = request.getParameter("sample");
		int resolution = (int) Utils.null2Value( request.getParameter("resolution"), ChromBinObj._500K_ );
		Gson gson = new Gson();

		return gson.toJson( this.cancerHiCService.getSampleTableName(sample, resolution) );
	}
	
	@RequestMapping(value = "getPrefoundedSV", method = {RequestMethod.POST, RequestMethod.GET}, produces = "text/plain;charset=UTF-8")
	@ResponseBody
	public String getPrefoundedSV(HttpServletRequest request) {
		Gson gson = new Gson();
		SampleParamObj[] samplesArray = gson.fromJson( request.getParameter("samples"), SampleParamObj[].class);
		String[] regionsArray = gson.fromJson( request.getParameter("regions"), String[].class);
		int resolution = (int) Utils.null2Value( request.getParameter("resolution"), ChromBinObj._500K_ );
		
		logger.debug( request.getParameter("samples") + " " + request.getParameter("regions"));

		List<ChromBinObj> chromObjList = new ArrayList<ChromBinObj>();
//		int binSize = 500000;
		for(String region : regionsArray) {
			String[] div = region.split(":");
			String[] pos = div[1].split("-");

			String chrom = div[0];

			ChromBinObj binObj = new ChromBinObj( chrom, pos[0], pos[1], resolution );
			chromObjList.add( binObj );

			logger.info( chrom + ":" + binObj.getStartBin() + "-" + binObj.getEndBin() );
		}

		List<SampleParamObj> samplesList = Arrays.asList( samplesArray );
		
		List<PreFoundedSvVo> lst = this.cancerHiCService.getFilteredInPreCalledSV( samplesList, chromObjList );
		
		Map<String, Object> retMap = new LinkedHashMap<String, Object>();
		retMap.put("data", lst);
		retMap.put("recordsTotal", lst.size());

		return gson.toJson( retMap );
	}

	@RequestMapping(value = "getPrefoundedSVByOnlySampleId", method = {RequestMethod.POST, RequestMethod.GET}, produces = "text/plain;charset=UTF-8")
	@ResponseBody
	public String getPrefoundedSVByOnlySampleId(HttpServletRequest request) {
		Gson gson = new Gson();
		
		String[] samplesArray = gson.fromJson( request.getParameter("sampleId"), String[].class);
		
		List<String> samples = Arrays.asList( samplesArray );
		
		List<PreFoundedSvVo> lst = this.cancerHiCService.getPreCalledSVBySampleId( samples );

		Map<String, Object> retMap = new LinkedHashMap<String, Object>();
		retMap.put("data", lst);
		retMap.put("recordsTotal", lst.size());

		return gson.toJson( retMap );
	}
	
	@RequestMapping(value = "getHg38GenomeInfo", method = {RequestMethod.POST, RequestMethod.GET})
	@ResponseBody
	public String getHg38GenomeInfo(HttpServletRequest request) {
		Gson gson = new Gson();

		return gson.toJson( this.cancerHiCService.getGenomeSizeHg18() );
	}

//	@RequestMapping(value = "getSuperEnhancer2", method = {RequestMethod.POST, RequestMethod.GET})
//	@ResponseBody
//	public String getSuperEnhancer2( HttpServletRequest request ) {
//		Gson gson = new Gson();
//
//		String[] bed_data_params = gson.fromJson( request.getParameter("bed_data"), String[].class);
//		double resolution = Utils.null2Value( request.getParameter("resolution"), 500000);
//		
//		Map<String, List<SuperEnhancerVo>> retMap = new LinkedHashMap<String, List<SuperEnhancerVo>>();
//
//		List<ChromBinObj> chromObjList = new ArrayList<ChromBinObj>();
//		int binSize = (int) resolution;
//		for(String bed_data : bed_data_params) {
//			String[] div = bed_data.split(":");
//			String[] pos = div[1].split("-");
//
//			String chrom = div[0];
//
//			ChromBinObj binObj = new ChromBinObj( chrom, pos[0], pos[1], binSize );
//			chromObjList.add( binObj );
//
//			logger.info( chrom + ":" + binObj.getStartBin() + "-" + binObj.getEndBin() );
//			
//			retMap.put( bed_data, this.cancerHiCService.getSuperEnhancer( binObj.getChrom(), binObj.getChromStart(), binObj.getChromEnd(), (int)resolution ) );
//		}
//		
//		String line = gson.toJson( retMap );
//		
//		String compress = LZString.compressToBase64(line);
//
//		return compress;
//	}
	
	@RequestMapping(value = "getSuperEnhancer", method = {RequestMethod.POST, RequestMethod.GET}, produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
	@ResponseBody
	public String getSuperEnhancer( HttpServletRequest request ) throws IOException {
		Gson gson = new Gson();

		SampleParamObj[] samplesArray = gson.fromJson( request.getParameter("samples"), SampleParamObj[].class);
		String[] bed_data_params = gson.fromJson( request.getParameter("bed_data"), String[].class);
		int resolution = (int) Utils.null2Value( request.getParameter("resolution"), ChromBinObj._500K_ );
		
		Map<String, List<SuperEnhancerVo>> retMap = new LinkedHashMap<String, List<SuperEnhancerVo>>();
		
		List<SampleParamObj> samplesList = Arrays.asList( samplesArray );

		int beforeBinSize = 0;
		int idx = 0;
		List<ChromBinObj> chromObjList = new ArrayList<ChromBinObj>();
//		int binSize = (int) resolution;
		for(String bed_data : bed_data_params) {
			String[] div = bed_data.split(":");
			String[] pos = div[1].split("-");

			String chrom = div[0];

			ChromBinObj binObj = new ChromBinObj( chrom, pos[0], pos[1], (int)resolution );
			chromObjList.add( binObj );

			logger.info( chrom + ":" + binObj.getStartBin() + "-" + binObj.getEndBin() );

			List<SuperEnhancerVo> enhancersVo = this.cancerHiCService.getSuperEnhancer( samplesList, binObj.getChrom(), binObj.getChromStart(), binObj.getChromEnd(), (int)resolution, beforeBinSize );

			retMap.put( chrom + "-" + idx, enhancersVo );
			idx++;
			
			beforeBinSize += (binObj.getEndBin() - binObj.getStartBin()) + 1;
		}
		
		String line = gson.toJson( retMap );
		
		logger.debug( line );
		
//		String compress = LZString.compressToBase64(line);

		
		byte[] compressed2 = Snappy.compress( line );
		
		String encoded222 = Base64.getEncoder().encodeToString(compressed2);
		
		return encoded222;
	}
	
	@RequestMapping(value = "getGencodeV34Genes", method = {RequestMethod.POST, RequestMethod.GET}, produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
	@ResponseBody
	public String getGencodeV34Genes( HttpServletRequest request ) throws IOException {
		Gson gson = new Gson();

		String[] bed_data_params = gson.fromJson( request.getParameter("bed_data"), String[].class);
		int resolution = (int) Utils.null2Value( request.getParameter("resolution"), ChromBinObj._500K_ );
		String[] optionGene = gson.fromJson( request.getParameter("optionGene"), String[].class);
		
		Map<String, List<GeneWithBinVo>> retMap = new LinkedHashMap<String, List<GeneWithBinVo>>();

		int beforeBinSize = 0;
		int idx = 0;
		List<ChromBinObj> chromObjList = new ArrayList<ChromBinObj>();
//		int binSize = (int) resolution;
		for(String bed_data : bed_data_params) {
			String[] div = bed_data.split(":");
			String[] pos = div[1].split("-");

			String chrom = div[0];

			ChromBinObj binObj = new ChromBinObj( chrom, pos[0], pos[1], (int)resolution );
			chromObjList.add( binObj );

			logger.info( chrom + ":" + binObj.getStartBin() + "-" + binObj.getEndBin() );
			
			List<GeneWithBinVo> geneListVo = this.cancerHiCService.getGencodeV34Genes( binObj.getChrom(), binObj.getChromStart(), binObj.getChromEnd(), (int)resolution, beforeBinSize, optionGene );
			
			retMap.put( chrom + "-" + idx, geneListVo );
			idx++;
			
			beforeBinSize += (binObj.getEndBin() - binObj.getStartBin()) + 1;
		}
		
		String line = gson.toJson( retMap );
		
//		String compress = LZString.compressToBase64(line);
//
//		return compress;
		
		byte[] compressed2 = Snappy.compress( line );
		
		String encoded222 = Base64.getEncoder().encodeToString(compressed2);
		return encoded222;
	}
	
	@RequestMapping(value = "getRefseqHG38Genes", method = {RequestMethod.POST, RequestMethod.GET}, produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
	@ResponseBody
	public String getRefseqHG38Genes( HttpServletRequest request ) throws IOException {
		Gson gson = new Gson();

		String[] bed_data_params = gson.fromJson( request.getParameter("bed_data"), String[].class);
		int resolution = (int) Utils.null2Value( request.getParameter("resolution"), ChromBinObj._500K_ );
		String[] optionGene = gson.fromJson( request.getParameter("optionGene"), String[].class);
		
		Map<String, List<GeneWithBinVo>> retMap = new LinkedHashMap<String, List<GeneWithBinVo>>();

		int beforeBinSize = 0;
		int idx = 0;
		List<ChromBinObj> chromObjList = new ArrayList<ChromBinObj>();
//		int binSize = (int) resolution;
		for(String bed_data : bed_data_params) {
			String[] div = bed_data.split(":");
			String[] pos = div[1].split("-");

			String chrom = div[0];

			ChromBinObj binObj = new ChromBinObj( chrom, pos[0], pos[1], (int)resolution );
			chromObjList.add( binObj );

			logger.info( chrom + ":" + binObj.getStartBin() + "-" + binObj.getEndBin() );
			
			List<GeneWithBinVo> geneListVo = this.cancerHiCService.getRefseqHG38Genes( binObj.getChrom(), binObj.getChromStart(), binObj.getChromEnd(), (int)resolution, beforeBinSize, optionGene );
			retMap.put( chrom + "-" + idx, geneListVo );
			idx++;
			
			beforeBinSize += (binObj.getEndBin() - binObj.getStartBin()) + 1;
		}
		
		String line = gson.toJson( retMap );
		
//		String compress = LZString.compressToBase64(line);
//
//		return compress;
		
		byte[] compressed2 = Snappy.compress( line );
		
		String encoded222 = Base64.getEncoder().encodeToString(compressed2);
		return encoded222;
	}

	@RequestMapping(value = "getCharacteristicsSample", method = {RequestMethod.POST, RequestMethod.GET}, produces = "text/plain;charset=UTF-8")
	@ResponseBody
	public String getCharacteristicsSample( HttpServletRequest request ) throws IOException {
		Gson gson = new Gson();

		String type = request.getParameter("type");
		String name = request.getParameter("name");
		String property = request.getParameter("property");
		String colName = request.getParameter("colName");
		
		return gson.toJson(this.cancerHiCService.getCharacteristicsSample( type, name, property, colName ));
	}
	
//	private static char[] toBase64 = {
//            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
//            'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
//            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
//            'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
//            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/'
//        };
//	private static int[] fromBase64 = new int[256];
//    {
//        Arrays.fill(fromBase64, -1);
//        for (int i = 0; i < toBase64.length; i++)
//            fromBase64[toBase64[i]] = i;
//        fromBase64['='] = -2;
//    }
//    private static boolean isMIME = false;
//	
//	
//    private int outLength(byte[] src, int sp, int sl) {
//        int[] base64 = fromBase64;
//        int paddings = 0;
//        int len = sl - sp;
//        if (len == 0)
//            return 0;
//        if (len < 2) {
//            if (isMIME && base64[0] == -1)
//                return 0;
//            throw new IllegalArgumentException(
//                "Input byte[] should at least have 2 bytes for base64 bytes");
//        }
//        if (isMIME) {
//            // scan all bytes to fill out all non-alphabet. a performance
//            // trade-off of pre-scan or Arrays.copyOf
//            int n = 0;
//            while (sp < sl) {
//                int b = src[sp++] & 0xff;
//                if (b == '=') {
//                    len -= (sl - sp + 1);
//                    break;
//                }
//                if ((b = base64[b]) == -1)
//                    n++;
//            }
//            len -= n;
//        } else {
//            if (src[sl - 1] == '=') {
//                paddings++;
//                if (src[sl - 2] == '=')
//                    paddings++;
//            }
//        }
//        if (paddings == 0 && (len & 0x3) !=  0)
//            paddings = 4 - (len & 0x3);
//        return 3 * ((len + 3) / 4) - paddings;
//    }
//
//    private int decode0(byte[] src, int sp, int sl, byte[] dst) {
//        int[] base64 = fromBase64;
//        int dp = 0;
//        int bits = 0;
//        int shiftto = 18;       // pos of first byte of 4-byte atom
//        while (sp < sl) {
//            int b = src[sp++] & 0xff;
//            if ((b = base64[b]) < 0) {
//                if (b == -2) {         // padding byte '='
//                    // =     shiftto==18 unnecessary padding
//                    // x=    shiftto==12 a dangling single x
//                    // x     to be handled together with non-padding case
//                    // xx=   shiftto==6&&sp==sl missing last =
//                    // xx=y  shiftto==6 last is not =
//                	byte kk = src[sp];
//                	System.out.println( shiftto + " " + sp + " " + sl + " " + kk );
//                    if (shiftto == 6 && (sp == sl || src[sp++] != '=') || shiftto == 18) {
//                        throw new IllegalArgumentException(
//                            "Input byte array has wrong 4-byte ending unit");
//                    }
//                    break;
//                }
//                if (isMIME)    // skip if for rfc2045
//                    continue;
//                else
//                    throw new IllegalArgumentException(
//                        "Illegal base64 character " +
//                        Integer.toString(src[sp - 1], 16));
//            }
////            System.out.println( b + " " + shiftto + " == " + ( b << shiftto) );
//            bits |= (b << shiftto);
//            shiftto -= 6;
//            if (shiftto < 0) {
////            	System.out.println( bits + " ==> " + (bits >> 16) + " (" + (byte)((bits >> 16)) + ")");
//                dst[dp++] = (byte)(bits >> 16);
//                dst[dp++] = (byte)(bits >>  8);
//                dst[dp++] = (byte)(bits);
//                shiftto = 18;
//                bits = 0;
//            }
//        }
//        // reached end of byte array or hit padding '=' characters.
//        if (shiftto == 6) {
//            dst[dp++] = (byte)(bits >> 16);
//        } else if (shiftto == 0) {
//            dst[dp++] = (byte)(bits >> 16);
//            dst[dp++] = (byte)(bits >>  8);
//        } else if (shiftto == 12) {
//            // dangling single "x", incorrectly encoded.
//            throw new IllegalArgumentException(
//                "Last unit does not have enough valid bits");
//        }
//        // anything left is invalid, if is not MIME.
//        // if MIME, ignore all non-base64 character
//        while (sp < sl) {
//            if (isMIME && base64[src[sp++]] < 0)
//                continue;
//            throw new IllegalArgumentException(
//                "Input byte array has incorrect ending byte at " + sp);
//        }
//        return dp;
//    }
//    
//    public byte[] decode(byte[] src) {
//        byte[] dst = new byte[outLength(src, 0, src.length)];
//        int ret = decode0(src, 0, src.length, dst);
//        if (ret != dst.length) {
//            dst = Arrays.copyOf(dst, ret);
//        }
//        return dst;
//    }
//    
//    public byte[] decode(String src) {
//        return decode(src.getBytes(StandardCharsets.ISO_8859_1));
//    }
}