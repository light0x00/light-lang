import { NonTerminal, ParsingTable, ILexer, IToken } from "@parser-generator/definition"
import table from "./parsing-table"
import { isIterable } from "@light0x00/shim"
import Stack from "typescript-collections/dist/lib/Stack"

class MismatchError extends Error {
	constructor(expected: any, actual: any) {
		let expectation = ""
		if (isIterable(expected)) {
			for (let e of expected) {
				expectation += `"${e}" or `
			}
			expectation = expectation.replace(/or\s$/, "")
		}
		else {
			expectation = expected
		}
		let err_msg = `The expected input is ${expectation},but got "${actual}"`
		if (actual.getLocation)
			err_msg += " at " + actual.getLocation()
		super(err_msg)
	}
}

class LRParser {
	private _parsingTable: ParsingTable
	constructor(parsingTable: ParsingTable) {
		this._parsingTable = parsingTable
	}

	parse(lexer: ILexer): any {
		let stateStack = new Stack<number>()
		stateStack.push(0)
		let astStack = new Stack<any>()
		let lookahead: IToken | NonTerminal = lexer.peek()

		while (1) {
			let topSta = stateStack.peek()!
			let op = this._parsingTable.get(topSta, lookahead.key())
			if (op == undefined)
				throw new MismatchError(this._parsingTable.getExpectedTokens(topSta), lookahead)
			if (op.isShift()) {
				astStack.push(lexer.next())
				stateStack.push(op.nextStateId)
				lookahead = lexer.peek()
			}
			else if (op.isGoto()) {
				stateStack.push(op.nextStateId)
				lookahead = lexer.peek()
			}
			else if (op.isReduce()) {
				/* 此次归约产生的AST节点所需的元素 */
				let eles = new Array(op.prod.body.length)
				// 动作: 归约完成后将符号对应的状态弹出
				// 每个状态都由输入一个符号得到 因此每个状态都一个对应的符号  详见:P158
				for (let i = 0; i < op.prod.body.length; i++) {
					stateStack.pop()
					eles[op.prod.body.length - i - 1] = astStack.pop()!  //issue AST元素的顺序问题
				}
				astStack.push(op.prod.postAction(eles, astStack as any))  //issue ASTNode的元素的顺序问题
				lookahead = op.prod.head
			}
			else if (op.isAccept()) {
				break
			}
		}
		return astStack.pop()
	}
}

export default new LRParser(table)
