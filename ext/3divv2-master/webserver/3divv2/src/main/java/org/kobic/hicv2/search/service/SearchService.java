package org.kobic.hicv2.search.service;

import javax.annotation.Resource;

import org.kobic.hicv2.search.mapper.SearchMapper;
import org.springframework.stereotype.Service;

@Service(value = "searchService")
public class SearchService {
	@Resource(name = "searchMapper")
	private SearchMapper searchMapper;
}
