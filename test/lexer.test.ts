
import should from "should"
import { Lexer, Token, IDENTIFIER, STRING, FALSE, NUMBER, NULL, TRUE } from "~/lexer"
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

	const P_WORLD = /^[^0-9\s!"#$%&'()*+,./:;<=>?@^_`{|}~\-\[\]][^\s!"#$%&'()*+,./:;<=>?@^_`{|}~\-\[\]]*$/
	it(`Word Regexp Test 1 ,非特殊符号可以作为变量名`, () => {
		should(P_WORLD.test("甲")).true()
		should(P_WORLD.test("😇")).true()

	})

	it(`Word Regexp Test 2 ,特殊符号不可以作为变量名`, () => {
		should(P_WORLD.test("^")).false()
		should(P_WORLD.test("`")).false()
		should(P_WORLD.test(">")).false()
		should(P_WORLD.test("~")).false()
	})

	it(`Word Regexp Test 3 ,空白字符不可以作为变量名`, () => {
		should(P_WORLD.test(" ")).false()
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
			"1", ">>", "2", "<<", "3", ">>>", "4", "&", "5", "^", "6", "|", "7"
		])
	})

	it(`Relational Operator`, () => {
		let lexemeList = mapTokens(`a<b;c>d;e<=f;g>=h`, (t) => t.lexeme)
		should(lexemeList).eql([
			"a", "<", "b", ";", "c", ">", "d", ";", "e", "<=", "f", ";", "g", ">=", "h"
		])
	})

	it(`Equality Operator`, () => {
		let lexemeList = mapTokens(`a==b;c!=d`, (t) => t.lexeme)
		should(lexemeList).eql([
			"a", "==", "b", ";", "c", "!=", "d"
		])
	})

	it(`Logical Operator`, () => {
		let lexemeList = mapTokens(`a&&b||c`, (t) => t.lexeme)
		should(lexemeList).eql([
			"a", "&&", "b", "||", "c"
		])
	})

	it(`Object/Array/BOOL/NULL Literal`, () => {

		let lexemeList = mapTokens(`{a:"aa"}`, (t) => [t.lexeme, t.proto])
		should(lexemeList).eql([
			["{", "{"],
			["a", IDENTIFIER],
			[":", ":"],
			["aa", STRING],
			["}", "}"]
		])

		should( mapTokens(`{a:false,b:true}`, (t) => [t.lexeme, t.proto])).eql([
			["{", "{"],
			["a", IDENTIFIER],
			[":", ":"],
			["false", FALSE],
			[",",","],
			["b", IDENTIFIER],
			[":", ":"],
			["true", TRUE],
			["}", "}"]
		])

		should( mapTokens(`{a:1.23}`, (t) => [t.lexeme, t.proto])).eql([
			["{", "{"],
			["a", IDENTIFIER],
			[":", ":"],
			["1.23", NUMBER],
			["}", "}"]
		])

		should( mapTokens(`{a:null}`, (t) => [t.lexeme, t.proto])).eql([
			["{", "{"],
			["a", IDENTIFIER],
			[":", ":"],
			["null", NULL],
			["}", "}"]
		])

	})

	it(`Array Literal`, () => {
		should( mapTokens(`[1.23,"abc",foo,false,null]`, (t) => [t.lexeme, t.proto])).eql([
			["[","["],
			["1.23", NUMBER],
			[",",","],
			["abc", STRING],
			[",",","],
			["foo", IDENTIFIER],
			[",",","],
			["false", FALSE],
			[",",","],
			["null", NULL],
			["]", "]"]
		])

		should( mapTokens(`[{a:"aa"}]`, (t) => [t.lexeme, t.proto])).eql([
			["[","["],
			["{", "{"],
			["a", IDENTIFIER],
			[":", ":"],
			["aa", STRING],
			["}", "}"],
			["]", "]"]
		])
	})
})

