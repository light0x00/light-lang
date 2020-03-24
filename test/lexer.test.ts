
import should from "should"
import { Lexer, Token } from "~/lexer"
import { EOF } from "@parser-generator/definition"

describe(`DFA Test`, () => {
	const P_OPERATOR = /((\+\+)|(--)|(>>>)|(>>)|(<<)|(<=)|(>=)|(==)|(!=)|(&&)|(\|\|))/

	it(`Operator Regexp Test 1`, () => {
		should(P_OPERATOR.test("a++")).true()
	})
	it(`Operator Regexp Test 2`, () => {
		should(P_OPERATOR.test("a--")).true()
	})
	it(`Operator Regexp Test 3`, () => {
		should(P_OPERATOR.test("a>>>1")).true()
	})
	it(`Operator Regexp Test 4`, () => {
		should(P_OPERATOR.test("a>>2")).true()
	})
	it(`Operator Regexp Test 5`, () => { 
		should(P_OPERATOR.test("a<<2")).true()
	})
	it(`Operator Regexp Test 6`, () => {
		should(P_OPERATOR.test("a<=2")).true()
	})
	it(`Operator Regexp Test 7`, () => {
		should(P_OPERATOR.test("a>=2")).true()
	})
	it(`Operator Regexp Test 8`, () => {
		should(P_OPERATOR.test("a==2")).true()
	})
	it(`Operator Regexp Test 9`, () => {
		should(P_OPERATOR.test("a!=2")).true()
	})
	it(`Operator Regexp Test 10`, () => {
		should(P_OPERATOR.test("a&&b")).true()
	})
	it(`Operator Regexp Test 11`, () => {
		should(P_OPERATOR.test("a||b")).true()
	})

})

function mapTokens<T>(text: string, fn: (t: Token) => T): T[] {
	let result = []
	let lexer = new Lexer(text)
	for (let t = lexer.next(); t.proto != EOF; t = lexer.next()) {
		result.push(fn(t))
	}
	return result
}

describe(`Lexer Test`, () => {

	it(`Union Operator`, () => {
		let lexemeList = mapTokens(`!a+~b+c-d+ ++e + --f + g++ + h--`, (t) => t.lexeme)
		should(lexemeList).eql([
			"!", "a", "+", "~", "b", "+", "c", "-", "d", "+", "++", "e", "+", "--", "f", "+", "g", "++", "+", "h", "--"
		])
	})

	it(`+ - * / %`, () => {
		let lexemeList = mapTokens(`1+2-3*4/5%6`, (t) => t.lexeme)
		should(lexemeList).eql([
			"1", "+", "2", "-", "3", "*", "4", "/", "5", "%", "6"
		])
	})
	it(`Binary Bitwise Operator`, () => {
		let lexemeList = mapTokens(`1>>2<<3>>>4&5^6|7`, (t) => t.lexeme)
		should(lexemeList).eql([
			"1", ">>", "2", "<<", "3", ">>>", "4","&","5","^","6","|","7"
		])
	})

	it(`Relational Operator`, () => {
		let lexemeList = mapTokens(`a<b;c>d;e<=f;g>=h`, (t) => t.lexeme)
		should(lexemeList).eql([
			"a", "<", "b", ";", "c", ">", "d", ";", "e", "<=", "f", ";", "g", ">=", "h"
		])
	})

	it(`Equality Operator`,()=>{
		let lexemeList = mapTokens(`a==b;c!=d`, (t) => t.lexeme)
		should(lexemeList).eql([
			"a","==","b",";","c","!=","d"
		])
	})

	it(`Logical Operator`,()=>{
		let lexemeList = mapTokens(`a&&b||c`, (t) => t.lexeme)
		should(lexemeList).eql([
			"a","&&","b","||","c"
		])
	})
})

