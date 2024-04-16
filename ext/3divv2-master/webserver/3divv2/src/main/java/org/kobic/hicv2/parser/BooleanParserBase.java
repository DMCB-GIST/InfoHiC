
package org.kobic.hicv2.parser;

import java.util.EmptyStackException;
import java.util.List;
import java.util.Stack;

import org.apache.commons.lang.StringUtils;
import org.kobic.hicv2.cancerhic.vo.SampleInfoVo;

public abstract class BooleanParserBase {
	public abstract List<SampleInfoVo> evaluate(String s, String type, String study_id) throws ParserException, EmptyStackException;

	public StringBuffer deleteSpaces(StringBuffer sbuf){
		boolean isSkip = false;
		for (int i = 0; i < sbuf.length(); i++){
			if (sbuf.charAt(i) == ' ' && isSkip == false ){
				sbuf.deleteCharAt(i);
				i--;
			}else if( sbuf.charAt(i) == '\"') {
				if( isSkip == false )	isSkip = true;
				else					isSkip = false;
			}else if( sbuf.charAt(i) == '\'' && isSkip == false ) {
				if( isSkip == false )	isSkip = true;
				else					isSkip = false;
			}
		}
		return sbuf;
	}
    
	public String createPostfixBoolean(String s) throws ParserException{
		Stack<Character> stack = new Stack<Character>();
		StringBuffer retStr = new StringBuffer();
		
		int diff1 = StringUtils.countMatches(s, "\"");
		int diff2 = StringUtils.countMatches(s, "\'");
		
		if( diff1 % 2 != 0 ) throw new ParserException("\" is missing");
		if( diff2 % 2 != 0 ) throw new ParserException("' is missing");

		int diff = StringUtils.countMatches(s, "(") - StringUtils.countMatches(s, ")");
		if( diff < 0 )		throw new ParserException("( is msssing");
		else if( diff > 0 )	throw new ParserException(") is missing");

		char c;
		int strpos = 0;
		while (strpos < s.length()) {
			// get the current character
			c = s.charAt(strpos);
			if (c == ')'){
				//resStr.append(stack.pop());
				while (!stack.empty() && !stack.peek().equals('(')){
					retStr.append(stack.pop());
				}
				if (!stack.empty())
					stack.pop();
			}else if (c == '&'){
				if (!stack.empty() && (stack.peek().equals('&') || stack.peek().equals('|') || stack.peek().equals('!') )){
					retStr.append(stack.pop());
				}
				stack.push(c);
			}else if (c == '|'){
				if (!stack.empty() && (stack.peek().equals('&') || stack.peek().equals('|') || stack.peek().equals('!') )){
					retStr.append(stack.pop());
				}
				stack.push(c);
			}else if (c == '!'){
				if (!stack.empty() && (stack.peek().equals('&') || stack.peek().equals('|') || stack.peek().equals('!') )){
					retStr.append(stack.pop());
				}
				stack.push(c);
			}else if (c == '('){
				// just skip open bracket
				stack.push(c);
			}else{
				StringBuffer sf = new StringBuffer();
				while ( c != '&' && c != '|' && c != '!' && c != '(' && c != ')' && strpos < s.length() ){
					sf.append(c);
					if (strpos+1 < s.length())
						c = s.charAt(++strpos);
					else{
						// abort while loop if we reach end of string
						c = 0;
						strpos = s.length();
					}
				}

				retStr.append( sf );
				// inside while loop strpos is incremented one time too often
				strpos--;
			}
			// make a right step inside the string
			strpos++;
			// insert a space to differ between consecutive numbers
			retStr.append(" ");
		}
	
		while (!stack.empty()){
			retStr.append(stack.pop());
			retStr.append(" ");
		}
		// delete the space character at the end of the string wrongly
		// added in above while-loop
		retStr.deleteCharAt(retStr.length()-1);
	
		// this has nothing to do with the infix creation but just eliminates
		// the needless spaces inserted during the infix creation.
		for (int i = 0; i < retStr.length() - 1; i++){
			if (retStr.charAt(i) == ' ' && retStr.charAt(i+1) == ' '){
				retStr.deleteCharAt(i+1);
				i--;
			}
		}
	
		return retStr.toString();
	}
}
