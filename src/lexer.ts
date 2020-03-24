import { TokenPro, IToken, Terminal, EOF } from "@parser-generator/definition"
import Queue from "typescript-collections/dist/lib/Queue"

export class Token implements IToken {

	private _lexeme: string
	private _proto: Terminal
	private _lexval: Object

	private _lineBegin = -1
	private _colBegin = -1
	private _lineEnd = -1
	private _colEnd = -1

	constructor(lexeme: string, proto?: TokenPro, lexval?: Object) {
		this._lexeme = lexeme
		this._proto = proto ?? lexeme
		this._lexval = lexval ?? lexeme
	}

	get lexeme() {
		return this._lexeme
	}
	get lexval(): Object {
		return this._lexval
	}
	get num(): number {
		return this._lexval as number
	}
	get bool(): boolean {
		return this._lexval as boolean
	}
	get proto() {
		return this._proto
	}
	get lineBegin() {
		return this._lineBegin
	}
	get colBegin() {
		return this._colBegin
	}
	get lienEnd() {
		return this._lineEnd
	}
	get colEnd() {
		return this._colEnd
	}
	key(): Terminal {
		return this._proto
	}
	setLocation(lineBegin: number, colBegin: number, lineEnd: number, colEnd: number) {
		this._lineBegin = lineBegin
		this._colBegin = colBegin
		this._lineEnd = lineEnd
		this._colEnd = colEnd
	}
	getLocation() {
		return `(${this._lineBegin},${this._colBegin}) ~ (${this._lineEnd},${this._colEnd})`
	}
	toString() {
		return this._lexeme
	}
}

abstract class AbstractLexer<T>{
	private _buffer = new Queue<T>();
	peek(): T {
		this.fill(0)
		return this._buffer.peek()!
	}
	next(): T {
		this.fill(0)
		return this._buffer.dequeue()!
	}
	private fill(i: number) {
		while (this._buffer.size() <= i) {
			this._buffer.enqueue(this.createToken())
		}
	}
	protected abstract createToken(): T
}

export let NUMBER = new TokenPro("NUMBER")

const P_SPACE = /\s+/y
const P_FLOAT = /([1-9]\d*\.\d+)|(0\.\d+)/y
const P_INT = /(0(?![0-9]))|([1-9]\d*(?!\.))/y
const P_OPERATOR = /((\+\+)|(--)|(>>>)|(>>)|(<<)|(<=)|(>=)|(==)|(!=)|(&&)|(\|\|))/y
const P_SINGLE = /./y

export class Lexer extends AbstractLexer<Token> {

	private _source: string
	private _lastIndex: number = 0
	private _hasMore: boolean = true

	private _line = 0
	private _col = 0

	constructor(source: string) {
		super()
		this._source = source
	}

	private match(regexp: RegExp): RegExpExecArray | null {
		regexp.lastIndex = this._lastIndex
		let result = regexp.exec(this._source)
		if (result != null) {
			this._lastIndex = regexp.lastIndex
			this._hasMore = this._lastIndex < this._source.length
			for (let chr of result[0]) {
				if (chr == "\n") {
					this._line += 1
					this._col = 0
				} else {
					this._col += 1
				}
			}
		}
		return result
	}

	protected createToken(): Token {

		let token: Token | undefined, matchResult: RegExpExecArray | null

		while ((matchResult = this.match(P_SPACE)) != null) {
			//丢弃空格
		}

		let beginLine = this._line, beginCol = this._col

		if ((matchResult = this.match(P_FLOAT)) != null) {
			token = new Token(matchResult[0], NUMBER, parseFloat(matchResult[0]))
		}
		else if ((matchResult = this.match(P_INT)) != null) {
			token = new Token(matchResult[0], NUMBER, parseInt(matchResult[0]))
		}
		else if ((matchResult = this.match(P_OPERATOR)) != null) {
			token = new Token(matchResult[0])
		}
		else if ((matchResult = this.match(P_SINGLE)) != null) {
			token = new Token(matchResult[0])
		}
		else {
			if (!this._hasMore) {
				token = new Token("", EOF)
			} else
				throw new Error("Unexpected input `" + this._source[this._lastIndex] + "`")
		}

		let endLine = this._line, endCol = this._col
		token.setLocation(beginLine, beginCol, endLine, endCol)
		return token
	}

}

