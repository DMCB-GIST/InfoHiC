package org.kobic.hicv2.parser.booleanPostfixParser;

import java.util.ArrayList;
import java.util.EmptyStackException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Stack;

import org.kobic.hicv2.cancerhic.service.CancerHiCService;
import org.kobic.hicv2.cancerhic.vo.SampleInfoVo;
import org.kobic.hicv2.parser.BooleanParserBase;
import org.kobic.hicv2.parser.ParserException;

public class BooleanParserPostfixStack extends BooleanParserBase {
	private CancerHiCService service;
	
	public BooleanParserPostfixStack( CancerHiCService service ) {
		this.service = service;
	}

	private Map<String, String> evaluatePostfixBooleanStep1(String s){
		int strpos = 0;
		char c;

		Map<String, String> queryMap = new LinkedHashMap<String, String>();

		while (strpos < s.length()){
			c = s.charAt(strpos);
			if( c != '&' && c != '|' && c != '!' && c != '(' && c != ')' && c != ':' ){ 
				String sub = s.substring(strpos);
				int i;
				boolean isSkip = false;
				for (i = 0; i < sub.length(); i++) {
					if( sub.charAt(i) == '[')		isSkip = true;
					else if( sub.charAt(i) == ']')	isSkip = false;
					else if (sub.charAt(i) == ' ' && isSkip == false )
						sub = sub.substring(0, i);
				}

				String term = sub.trim();

				if( !term.trim().equals("") )	queryMap.put( term, null );

				strpos += i-1;
			}
			strpos++;
		}

		return queryMap;
	}
	
	private List<SampleInfoVo> evaluatePostfixBoolean(String s, Map<String, String> queryMap, String type, String study_id) throws ParserException, EmptyStackException{
		Stack<String> stack = new Stack<String>();
		Stack<List<SampleInfoVo>> cl = new Stack<List<SampleInfoVo>>();

		int strpos = 0;
		char c;

		while (strpos < s.length()){
			c = s.charAt(strpos);
			if (c == '&'){
				String op1 = stack.pop().toString();
				String op2 = stack.pop().toString();
				
				List<SampleInfoVo> l1 = cl.pop();
				List<SampleInfoVo> l2 = cl.pop();

				List<SampleInfoVo> nLst = new ArrayList<SampleInfoVo>();

				for(SampleInfoVo clNm1 : l1 ) {
					for(SampleInfoVo clNm2 : l2 ) {
						if( clNm1.getSample_id() == clNm2.getSample_id() ) {
							System.out.println( clNm1.getDesc() + " " + clNm2.getDesc() );
							nLst.add( clNm1 );
						}
					}
				}
				cl.push( nLst );
				
				System.out.println( "and size : " + nLst.size() );

				stack.push( op1 + " AND " + op2 );
			}else if (c == '|'){
				String op1 = stack.pop().toString();
				String op2 = stack.pop().toString();

				List<SampleInfoVo> l1 = cl.pop();
				List<SampleInfoVo> l2 = cl.pop();
					
				List<SampleInfoVo> nLst = new ArrayList<SampleInfoVo>( l1 );
				for(SampleInfoVo clNm : l2 ) {
					boolean exist = false;
					for(SampleInfoVo prevObj : nLst) {
						if( clNm.getSample_id() == prevObj.getSample_id() ){
							exist = true;
							break;
						}
					}
					if( exist == false ) {
						nLst.add( clNm );
					}
				}
				cl.push( nLst );

				stack.push( op1 + " OR " + op2 );
			}else if (c == '!'){
				String op1 = stack.pop().toString();

				List<SampleInfoVo> nLst = new ArrayList<SampleInfoVo>();

				List<SampleInfoVo> l1 = cl.pop();
				List<SampleInfoVo> lst = this.service.getSampleList( null, type, study_id );
				for(SampleInfoVo vo1 : lst) {
					boolean exist = false;
					for(SampleInfoVo prevVo : l1) {
						if( vo1.getSample_id() == prevVo.getSample_id() ){
							exist = true;
							break;
						}
					}
					if( exist == false ) {
						nLst.add( vo1 );
					}
				}
				
				cl.push( nLst );

				stack.push( " NOT " + op1 );
			}else if( c != '&' && c != '|' && c != '!' && c != '(' && c != ')' && c != ':' ){ 
				String sub = s.substring(strpos);
				int i;
				boolean isSkip = false;
				for (i = 0; i < sub.length(); i++)
					if( sub.charAt(i) == '[')		isSkip = true;
					else if( sub.charAt(i) == ']')	isSkip = false;
					else if (sub.charAt(i) == ' ' && isSkip == false )
						sub = sub.substring(0, i);

				String term = sub.trim();

				if( !term.trim().equals("") ) {
					stack.push( term );

					List<SampleInfoVo> lst = this.service.getSampleList( term, type, study_id );

					cl.push( lst );
				}
				strpos += i-1;
			}
			strpos++;
		}

		List<SampleInfoVo> result = cl.pop();
		System.out.println( "Stack size : " + stack.size() + " " + stack.pop() + " " + result.size() );

		return result;
	}

	@Override
	public List<SampleInfoVo> evaluate(String s, String type, String study_id) throws ParserException, EmptyStackException {
		StringBuffer sBuf = new StringBuffer(s);
		sBuf = this.deleteSpaces(sBuf);

		String tmpstr = this.createPostfixBoolean(sBuf.toString());

		Map<String, String> queryMap = this.evaluatePostfixBooleanStep1( tmpstr );

		return this.evaluatePostfixBoolean(tmpstr, queryMap, type, study_id);
	}
}