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
	Exprs,
	ASTVisitor,
	ObjectLiteral,
	FieldList,
	LiteralField,
	ArrayLiteral,
	ElementList,
	ArrayMemberExpr,
	ObjectMemberExpr,
	NewExpr,
	CallExpr,
	Arguments,
	ArgumentList,
	ConditionalExpr,
	LeftSideExpr,
	ASTNode,
	LiteralElement
} from "./ast"
import { Token } from "./lexer"
import { assert } from "@light0x00/shim"

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

// isArray([])

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
// {a:1,b:2,c:3}
/* 
field_list ',' literal_field
field_list ',' literal_field ',' literal_field
field_list ',' literal_field ',' literal_field ',' literal_field
literal_field ',' literal_field  ',' literal_field ',' literal_field
(( literal_field ) ',' literal_field ) ',' literal_field ',' literal_field
*/
// ((a:1),(b:2),)
export class EvaluatorVisitor extends ASTVisitor {

	visitObjectLiteral(node: ObjectLiteral) {
		if (node.fieldList == undefined) {
			return {}
		} else {
			return this.visit(node.fieldList)
		}
	}
	visitFieldList(node: FieldList) {
		if (node.children.length == 1) {
			return this.visit(<ASTNode>node.children[0])
		} else {
			return Object.assign(
				this.visit(<ASTNode>node.children[0]),
				this.visit(<ASTNode>node.children[0]))
		}
	}
	visitLiteralField(node: LiteralField) {
		return { [node.identifier.lexeme]: this.visit(node.expr) }
	}
	visitArrayLiteral(node: ArrayLiteral) {
	}
	visitElementList(node: ElementList) {
		if (node.children.length == 1) {
			[this.visit(<ASTNode>node.children[0])]
		} else {
			return [
				...this.visit(<ASTNode>node.children[0]),
				this.visit(<ASTNode>node.children[2])]
		}
	}
	visitLiteralElement(node: LiteralElement) {
		return this.visit(<ASTNode>node.children[0])
	}
	visitArrayMemberExpr(node: ArrayMemberExpr) {
		return this.visit(node.arrayNode)[this.visit(node.indexNode)]
	}
	visitObjectMemberExpr(node: ObjectMemberExpr) {
		throw new Error("Method not implemented.")
	}
	visitNewExpr(node: NewExpr) {
		throw new Error("Method not implemented.")
	}
	visitCallExpr(node: CallExpr) {
		throw new Error("Method not implemented.")
	}
	visitArguments(node: Arguments) {
		throw new Error("Method not implemented.")
	}
	visitArgumentList(node: ArgumentList) {
		throw new Error("Method not implemented.")
	}

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
	visitConditionalExpr(node: ConditionalExpr) {
		throw new Error("Method not implemented.")
	}
	visitLeftSideExpr(node: LeftSideExpr) {
		throw new Error("Method not implemented.")
	}
	visitExprs(node: Exprs) {
		let result = this.visit(node.expr)
		if (node.nextExpr != undefined)
			result = this.visit(node.nextExpr)
		return result
	}

}
