import {
	PrimaryExpr,
	ParenthesizeExpr,
	UnaryExpr,
	MultiplicativeExpr,
	AdditiveExpr,
	BitwiseShiftExpr,
	RelationalExpr,
	EqualityExpr,
	BitwiseAndExpr,
	BitwiseXorExpr,
	BitwiseOrExpr,
	LogicalAndExpr,
	LogicalOrExpr,
	Expr,
	ASTVisitor
} from "./ast"
import { Token } from "./lexer"

function adaptToNum(obj: any) {
	if (typeof obj === "number") {
		return obj
	} else if (typeof obj === "boolean") {
		return obj ? 1 : 0
	} else {
		return 0
	}
}

function adaptToBool(obj: any): boolean {
	if (typeof obj === "boolean") {
		return obj
	} else if (typeof obj === "number") {
		return obj > 0
	} else {
		return obj == null ? false : true
	}
}

function numBinaryExpr(left: any, operator: Token, right: any): number | boolean {
	left = adaptToNum(left)
	let op = operator.lexeme
	right = adaptToNum(right)
	switch (op) {
		case "*":
			return left * right
		case "/":
			return left / right
		case "%":
			return left % right
		case "+":
			return left + right
		case "-":
			return left - right
		case ">>":
			return left >> right
		case "<<":
			return left << right
		case ">>>":
			return left >>> right
		case "<":
			return left < right
		case ">":
			return left > right
		case "<=":
			return left <= right
		case ">=":
			return left >= right
		case "==":
			return left == right
		case "!=":
			return left != right
		case "&":
			return left & right
		case "^":
			return left ^ right
		case "|":
			return left | right
		default:
			throw new Error("Unsupported number operator :\"" + operator.lexeme + "\" at " + operator.getLocation())
	}
}

export class EvaluatorVisitor extends ASTVisitor {

	visitPrimaryExpr(node: PrimaryExpr) {
		return node.primary.lexval
	}
	visitParenthesizeExpr(node: ParenthesizeExpr) {
		return this.visit(node.expr)
	}
	visitUnaryExpr(node: UnaryExpr) {
		let operator = node.children[0] as Token
		let operand = this.visit(node.operand)

		switch (operator.proto) {
			case "!":
				return !adaptToBool(operand)
			case "~":
				return ~adaptToNum(operand)
			case "+":
				return +adaptToNum(operand)
			case "-":
				return -adaptToNum(operand)
		}
		throw new Error("Unexpected symbol " + operator + " at " + operator.getLocation())
	}
	visitMultiplicativeExpr(node: MultiplicativeExpr) {
		return numBinaryExpr(this.visit(node.left), node.operator, this.visit(node.right))
	}
	visitAdditiveExpr(node: AdditiveExpr) {
		return numBinaryExpr(this.visit(node.left), node.operator, this.visit(node.right))
	}
	visitBitwiseShiftExpr(node: BitwiseShiftExpr) {
		return numBinaryExpr(this.visit(node.left), node.operator, this.visit(node.right))
	}
	visitRelationalExpr(node: RelationalExpr) {
		return numBinaryExpr(this.visit(node.left), node.operator, this.visit(node.right))
	}
	visitEqualityExpr(node: EqualityExpr) {
		let left = this.visit(node.left)
		let operator = node.operator
		let right = this.visit(node.right)
		switch (operator.lexval) {
			case "==":
				return left === right
			case "!=":
				return left !== right
			default:
				throw new Error("Unexpected symbol " + operator + " at " + operator.getLocation())
		}
	}
	visitBitwiseAndExpr(node: BitwiseAndExpr) {
		return numBinaryExpr(this.visit(node.left), node.operator, this.visit(node.right))
	}
	visitBitwiseXorExpr(node: BitwiseXorExpr) {
		return numBinaryExpr(this.visit(node.left), node.operator, this.visit(node.right))
	}
	visitBitwiseOrExpr(node: BitwiseOrExpr) {
		return numBinaryExpr(this.visit(node.left), node.operator, this.visit(node.right))
	}
	visitLogicalAndExpr(node: LogicalAndExpr) {
		if (adaptToBool(this.visit(node.left)) === true) {
			return adaptToBool(this.visit(node.right))
		} else {
			return false
		}
	}
	visitLogicalOrExpr(node: LogicalOrExpr) {
		return adaptToBool(this.visit(node.left) ? true : adaptToBool(this.visit(node.right)))
	}
	visitExpr(node: Expr) {
		return this.visit(node.expr)
	}

}
