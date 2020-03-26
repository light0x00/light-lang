import { ASTElement } from "@parser-generator/definition"
import { Token } from "./lexer"

export abstract class ASTVisitor {

	visit(node: ASTNode) {
		let type = node.constructor
		switch (type) {
			case PrimaryExpr:
				return this.visitPrimaryExpr(<PrimaryExpr>node)
			case ParenthesizeExpr:
				return this.visitParenthesizeExpr(<ParenthesizeExpr>node)
			case UnaryExpr:
				return this.visitUnaryExpr(<UnaryExpr>node)
			case MultiplicativeExpr:
				return this.visitMultiplicativeExpr(<MultiplicativeExpr>node)
			case AdditiveExpr:
				return this.visitAdditiveExpr(<AdditiveExpr>node)
			case BitwiseShiftExpr:
				return this.visitBitwiseShiftExpr(<BitwiseShiftExpr>node)
			case RelationalExpr:
				return this.visitRelationalExpr(<RelationalExpr>node)
			case EqualityExpr:
				return this.visitEqualityExpr(<EqualityExpr>node)
			case BitwiseAndExpr:
				return this.visitBitwiseAndExpr(<BitwiseAndExpr>node)
			case BitwiseXorExpr:
				return this.visitBitwiseXorExpr(<BitwiseXorExpr>node)
			case BitwiseOrExpr:
				return this.visitBitwiseOrExpr(<BitwiseOrExpr>node)
			case LogicalAndExpr:
				return this.visitLogicalAndExpr(<LogicalAndExpr>node)
			case LogicalOrExpr:
				return this.visitLogicalOrExpr(<LogicalOrExpr>node)
			case ObjectLiteral:
				return this.visitObjectLiteral(<ObjectLiteral>node)
			case FieldList:
				return this.visitFieldList(<FieldList>node)
			case LiteralField:
				return this.visitLiteralField(<LiteralField>node)
			case ArrayLiteral:
				return this.visitArrayLiteral(<ArrayLiteral>node)
			case ElementList:
				return this.visitElementList(<ElementList>node)
			case ArrayMemberExpr:
				return this.visitArrayMemberExpr(<ArrayMemberExpr>node)
			case ObjectMemberExpr:
				return this.visitObjectMemberExpr(<ObjectMemberExpr>node)
			case NewExpr:
				return this.visitNewExpr(<NewExpr>node)
			case CallExpr:
				return this.visitCallExpr(<CallExpr>node)
			case Arguments:
				return this.visitArguments(<Arguments>node)
			case ArgumentList:
				return this.visitArgumentList(<ArgumentList>node)
			case ConditionalExpr:
				return this.visitConditionalExpr(<ConditionalExpr>node)
			case LeftSideExpr:
				return this.visitLeftSideExpr(<LeftSideExpr>node)
			case Exprs:
				return this.visitExprs(<Exprs>node)
			default:
				throw new Error("Unsupported ASTNode \"" + type.name + "\"")
		}
	}

	abstract visitPrimaryExpr(node: PrimaryExpr): any

	abstract visitParenthesizeExpr(node: ParenthesizeExpr): any

	abstract visitUnaryExpr(node: UnaryExpr): any

	abstract visitMultiplicativeExpr(node: MultiplicativeExpr): any

	abstract visitAdditiveExpr(node: AdditiveExpr): any

	abstract visitBitwiseShiftExpr(node: BitwiseShiftExpr): any

	abstract visitRelationalExpr(node: RelationalExpr): any

	abstract visitEqualityExpr(node: EqualityExpr): any

	abstract visitBitwiseAndExpr(node: BitwiseAndExpr): any

	abstract visitBitwiseXorExpr(node: BitwiseXorExpr): any

	abstract visitBitwiseOrExpr(node: BitwiseOrExpr): any

	abstract visitLogicalAndExpr(node: LogicalAndExpr): any

	abstract visitLogicalOrExpr(node: LogicalOrExpr): any
	//
	abstract visitObjectLiteral(node: ObjectLiteral): any

	abstract visitFieldList(node: FieldList): any

	abstract visitLiteralField(node: LiteralField): any

	abstract visitArrayLiteral(node: ArrayLiteral): any

	abstract visitElementList(node: ElementList): any

	abstract visitLiteralElement(node: LiteralElement): any

	abstract visitArrayMemberExpr(node: ArrayMemberExpr): any

	abstract visitObjectMemberExpr(node: ObjectMemberExpr): any

	abstract visitNewExpr(node: NewExpr): any

	abstract visitCallExpr(node: CallExpr): any

	abstract visitArguments(node: Arguments): any

	abstract visitArgumentList(node: ArgumentList): any

	abstract visitConditionalExpr(node: ConditionalExpr): any

	abstract visitLeftSideExpr(node: LeftSideExpr): any

	abstract visitExprs(node: Exprs): any
}

export abstract class ASTNode {
	protected readonly _children: ASTElement[]
	constructor(eles: ASTElement[]) {
		this._children = eles
	}
	get children() {
		return this._children
	}

	toString() {
		return this._children.length == 1 ? this._children[0].toString() : "(" + this._children.map(i => i.toString()).join("") + ")"
	}

	// abstract accept(visitor: ASTVisitor): void
}

export class PrimaryExpr extends ASTNode {
	accept(visitor: ASTVisitor): void {
		visitor.visitPrimaryExpr(this)
	}

	get primary(): Token {
		return this._children[0] as Token
	}
}

export class ParenthesizeExpr extends ASTNode {
	accept(visitor: ASTVisitor): void {
		visitor.visitParenthesizeExpr(this)
	}
	get expr() {
		return this.children[1] as Exprs
	}
}

export class UnaryExpr extends ASTNode {
	accept(visitor: ASTVisitor): void {
		visitor.visitUnaryExpr(this)
	}
	get operator(): Token {
		return this._children[0] as Token
	}
	get operand(): UnaryExpr {
		return this._children[1] as UnaryExpr
	}
}

export class MultiplicativeExpr extends ASTNode {
	accept(visitor: ASTVisitor): void {
		visitor.visitMultiplicativeExpr(this)
	}
	get left() {
		return this._children[0] as MultiplicativeExpr
	}
	get operator() {
		return this._children[1] as Token
	}
	get right() {
		return this._children[2] as UnaryExpr
	}
}

export class AdditiveExpr extends ASTNode {
	accept(visitor: ASTVisitor): void {
		visitor.visitAdditiveExpr(this)
	}
	get left() {
		return this._children[0] as AdditiveExpr
	}
	get operator() {
		return this._children[1] as Token
	}
	get right() {
		return this._children[2] as MultiplicativeExpr
	}
}

export class BitwiseShiftExpr extends ASTNode {
	accept(visitor: ASTVisitor): void {
		visitor.visitBitwiseShiftExpr(this)
	}
	get left() {
		return this._children[0] as BitwiseShiftExpr
	}
	get operator() {
		return this._children[1] as Token
	}
	get right() {
		return this._children[2] as AdditiveExpr
	}
}

export class RelationalExpr extends ASTNode {
	accept(visitor: ASTVisitor): void {
		visitor.visitRelationalExpr(this)
	}
	get left() {
		return this._children[0] as RelationalExpr
	}
	get operator() {
		return this._children[1] as Token
	}
	get right() {
		return this._children[2] as BitwiseShiftExpr
	}
}

export class EqualityExpr extends ASTNode {
	accept(visitor: ASTVisitor): void {
		visitor.visitEqualityExpr(this)
	}
	get left() {
		return this._children[0] as EqualityExpr
	}
	get operator() {
		return this._children[1] as Token
	}
	get right() {
		return this._children[2] as RelationalExpr
	}
}

export class BitwiseAndExpr extends ASTNode {
	accept(visitor: ASTVisitor): void {
		visitor.visitBitwiseAndExpr(this)
	}
	get left() {
		return this._children[0] as BitwiseAndExpr
	}
	get operator() {
		return this._children[1] as Token
	}
	get right() {
		return this._children[2] as EqualityExpr
	}
}

export class BitwiseXorExpr extends ASTNode {
	accept(visitor: ASTVisitor): void {
		visitor.visitBitwiseXorExpr(this)
	}
	get left() {
		return this._children[0] as BitwiseXorExpr
	}
	get operator() {
		return this._children[1] as Token
	}
	get right() {
		return this._children[2] as BitwiseAndExpr
	}
}

export class BitwiseOrExpr extends ASTNode {
	accept(visitor: ASTVisitor): void {
		visitor.visitBitwiseOrExpr(this)
	}
	get left() {
		return this._children[0] as BitwiseOrExpr
	}
	get operator() {
		return this._children[1] as Token
	}
	get right() {
		return this._children[2] as BitwiseXorExpr
	}
}

export class LogicalAndExpr extends ASTNode {
	accept(visitor: ASTVisitor): void {
		visitor.visitLogicalAndExpr(this)
	}
	get left() {
		return this._children[0] as LogicalAndExpr
	}
	get operator() {
		return this._children[1] as Token
	}
	get right() {
		return this._children[2] as BitwiseOrExpr
	}
}

export class LogicalOrExpr extends ASTNode {
	accept(visitor: ASTVisitor): void {
		visitor.visitLogicalOrExpr(this)
	}
	get left() {
		return this._children[0] as LogicalOrExpr
	}
	get operator() {
		return this._children[1] as Token
	}
	get right() {
		return this._children[2] as LogicalAndExpr
	}
}
//
export class ObjectLiteral extends ASTNode {
	get fieldList(): FieldList | undefined {
		return this._children.length == 2 ? undefined : this._children[1] as FieldList
	}
}

export class FieldList extends ASTNode {

}

export class LiteralField extends ASTNode {
	get identifier() {
		return this._children[0] as Token
	}
	get expr() {
		return this._children[2] as ASTNode
	}
}

export class ArrayLiteral extends ASTNode {

}

export class ElementList extends ASTNode {

}

export class LiteralElement extends ASTNode {

}

export class ArrayMemberExpr extends ASTNode {
	get indexNode(){
		return this._children[2] as ASTNode
	}
	get arrayNode(){
		return this._children[0] as ASTNode
	}
}

export class ObjectMemberExpr extends ASTNode {

}

export class NewExpr extends ASTNode {

}

export class CallExpr extends ASTNode {

}

export class Arguments extends ASTNode {

}

export class ArgumentList extends ASTNode {

}

export class ConditionalExpr extends ASTNode {

}

export class LeftSideExpr extends ASTNode {

}

export class Exprs extends ASTNode {
	accept(visitor: ASTVisitor): void {
		visitor.visitExprs(this)
	}
	get expr() {
		return this.children[0] as Exprs
	}
	get nextExpr() {
		return this._children[2] as ASTNode | undefined
	}
}