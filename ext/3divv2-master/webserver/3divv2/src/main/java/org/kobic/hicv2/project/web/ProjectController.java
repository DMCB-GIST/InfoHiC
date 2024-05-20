package org.kobic.hicv2.project.web;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.kobic.hicv2.project.service.ProjectService;
import org.kobic.hicv2.project.vo.DownloadFileVo;
import org.kobic.hicv2.project.vo.GeneLocusVo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.google.gson.Gson;

@Controller
public class ProjectController {
	
	private static final Logger logger = LoggerFactory.getLogger(ProjectController.class);
	
	@Resource(name = "projectService")
	private ProjectService projectService;
	
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String home(Locale locale, Model model) {
		return "index";
	}
	
	@RequestMapping(value = "download", method = RequestMethod.GET)
	public ModelAndView download(Locale locale, Model model) {
		
		ModelAndView mv = new ModelAndView();
		List<DownloadFileVo> list = projectService.getDownloadFileList(null);
		
		mv.setViewName("menu/download");
		mv.addObject("list", list);
		
		return mv;
	}
	
	@RequestMapping(value = "tutorial", method = RequestMethod.GET)
	public String tutorial(Locale locale, Model model) {
				
		return "menu/tutorial";
	}
	
	@RequestMapping(value = "contact", method = RequestMethod.GET)
	public String contact(Locale locale, Model model) {
				
		return "menu/contact";
	}
	
	@RequestMapping(value = "statistics", method = RequestMethod.GET)
	public String statistics(Locale locale, Model model) {
				
		return "menu/statistics";
	}
	
	@RequestMapping(value = "getAutocompleteGenes", method = {RequestMethod.POST, RequestMethod.GET})
	@ResponseBody
	public String getAutocompleteGenes(HttpServletRequest request) {
		String query = request.getParameter("q");
		Gson gson = new Gson();
		
		if( query.isEmpty() ) query = null;
		
		List<GeneLocusVo> lst = this.projectService.getGeneLocus4AutoComplete( query );
		return gson.toJson( lst );
	}
	
	@RequestMapping(value = "getOptionGeneAutoComplete", method = {RequestMethod.POST, RequestMethod.GET})
	@ResponseBody
	public String getOptionGeneAutoComplete(HttpServletRequest request) {
		String query = request.getParameter("q");
		
		Gson gson = new Gson();
		
		String[] dbArray = gson.fromJson( request.getParameter("dbArray"), String[].class);
		
		if( query.isEmpty() ) query = null;
		
		List<GeneLocusVo> lst = this.projectService.getOptionGeneAutoComplete( query, dbArray );
		return gson.toJson( lst );
	}
	
	@RequestMapping(value = "getOptionGene", method = {RequestMethod.POST, RequestMethod.GET})
	@ResponseBody
	public String getOptionGene(HttpServletRequest request) {
		Gson gson = new Gson();
		
		String[] array = gson.fromJson( request.getParameter("array"), String[].class);
		
		List<GeneLocusVo> lst = this.projectService.getOptionGene( array );
		
		return gson.toJson( lst );
	}
	
	@RequestMapping(value = "search_download_list", method = {RequestMethod.POST, RequestMethod.GET}, produces = "text/plain;charset=UTF-8")
	@ResponseBody
	public String search_download_list(HttpServletRequest request) {
		Gson gson = new Gson();

		String keyword = request.getParameter("keyword");
		
		if(keyword.equals("")) keyword = null;
		
		List<DownloadFileVo> list = projectService.getDownloadFileList(keyword);

		String line = gson.toJson( list );

		return line;
	}
}
