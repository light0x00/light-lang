import should from "should"
import parser from "~/parser"
import { Lexer } from "~/lexer"

function minify(str: string){
	return str.replace(/\s/g,"")
}

describe(`Parser Test`,()=>{
	
	it(`Arithmetic Binary Expression`,()=>{
		should(parser.parse(new Lexer("1+2-3*4/5%6")).toString()).eql(minify(`
		(
			(1+2)
			-
			(
				(
					(3*4)/5
				)
				% 6
			)
		)
		`
		))
	})

	it(`Bitwise Binary Expression`,()=>{
		should(parser.parse(new Lexer("1&2>>3|4>>>5^6<<7")).toString()).eql(minify(`
		(
			( 1 & (2>>3) )
			|
			((4>>>5)
			^
			(6<<7))
		)
		`))
	})

	it(`Logical Binary Expression`,()=>{
		should(parser.parse(new Lexer("1>2&&3<4||5!=6")).toString()).eql(minify(`
		(
			(
				(1>2)
				&&
				(3<4)
			) 
			|| 
			(5!=6)
		)
		`))
	})

})