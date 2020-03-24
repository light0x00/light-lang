import { Lexer } from "~/lexer"
import parser from "~/parser"
import should from "should"
import { EvaluatorVisitor } from "~/interpreter"

let ast =  parser.parse(new Lexer(`1+2*3/4%5>>>6`))
console.log(ast.toString())

function eval2(code: string) :any{
	return new EvaluatorVisitor().visitExpr(parser.parse(new Lexer(code)))
}

describe(`Evaluator Test`,()=>{
	it(`Arithmetic Binary Expression`,()=>{
		should(eval2("1+2-3*4/5%6")).eql(1+2-3*4/5%6)
	})
	it(`Bitwise Binary Expression`,()=>{
		should(eval2("1&2>>3|4>>>5^6<<7")).eql(1&2>>3|4>>>5^6<<7)
	})
	it(`Logical Binary Expression`,()=>{
		should(eval2("1>2")).eql(false)
		should(eval2("1<2&&3<4")).eql(true)
		should(eval2("1>2||3<4")).eql(true)
	})
})
