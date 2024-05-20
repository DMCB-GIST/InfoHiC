package org.kobic.hicv2.cancerhic.obj;

public class QueryObject {
	public static final String AND = "AND";
	public static final String OR = "OR";

	private String operator;
	private String word;

	public String getOperator() {
		return operator;
	}
	public void setOperator(String operator) {
		this.operator = operator;
	}
	public String getWord() {
		return word;
	}
	public void setWord(String word) {
		this.word = word;
	}
}
