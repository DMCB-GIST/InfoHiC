package org.kobic.hicv2.search.web;

import javax.annotation.Resource;

import org.kobic.hicv2.search.service.SearchService;
import org.springframework.stereotype.Controller;

@Controller
public class SearchController {
	
	@Resource(name = "searchService")
	private SearchService searchService;
}