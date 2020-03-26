## 结合性

故事从右递归开始.

```
A ->
	digit |
	digit + A |
	digit - A 
```

如上是一个右递归文法,具有「右结合性质」. 显然, 在当前案例里,它是错误的,因为`+` `-` 是左结合的.

验证这一点,只需做一个简单的推导:

```
句子:	1+2-3+4-5

1 + A
1 + (2 - A)
1 + (2 - (3 + A))
1 + (2 - (3 + (4 - A)))
1 + (2 - (3 + (4 - 5)))
```

显然,在很多时候,我们需要用左递归的文法.(如二元表达式都是左结合)

```
A -> 
	digit |
	A + digit |
	A - digit
```

如上是一个左递归文法, 其中 `A->digit`用来收敛递归,它是递归的出口,当某个 A 被替换为 digit时, 那么分析也就结束了.

这里我们重点关注 `A->A+digit` `A->A-digit` , 理由是我们需要研究「为什么它们可接受任意长度的加减法表达式 」. 为了让分析过程更直观,我们以`1+2-3`作为案例句子.

一开始,我们企图用分析右递归文法的方式去分析它们,

直觉上,我们会选择`A->A+digit` ,因为句子`1+2-3`中`+`在前面

```
A + digit
```

也许现在你已经预感到了错误,选择了`A + digit` 之后, 我下一步要做的是通过代入来替换掉`A`, 但问题是用哪个候选式来代入呢?

- 选择 A->digit 得到: `digit + digit`
- 选择 A->A + digit ,得到 `A + digit + digit`
- 选择 A->A - digit ,得到 `A - digit + digit`

显然,上面3个选择没有一个可以接受句子`1+2-3`. 

你会发现, 需要换一种视角看待左递归. 

我们知道,如果一个非终结符X的产生式体中包含了自身, 那么该处就可以代入X的任意一个候选式. 具体的讲, 在当前例子中,A的每一个左递归候选式都可以与A的所有候选式进行'组合'

```
+─────────────+───────────────────+───────────────────+
|             | A->A+digit        | A->A-digit        |
+─────────────+───────────────────+───────────────────+
| A->digit    | A->digit-digit    | A->digit-digit    |
| A->A+digit  | A->A+digit-digit  | A->A+digit-digit  |
| A->A-digit  | A->A-digit+digit  | A->A-digit-digit  |
+─────────────+───────────────────+───────────────────+
```

你会发现「左递归」表达的含义是集合相乘的笛卡尔积, 我们组合出了6种结果,其中有4个是左递归的

```
+───────────────────+───────────────────+
| A->A+digit-digit  | A->A+digit-digit  |
+───────────────────+───────────────────+
| A->A-digit+digit  | A->A-digit-digit  |
+───────────────────+───────────────────+
```

因此这4个结果仍旧可以和A的另外3个产生式再来一次集合相乘,这次我们组合出了12种结果,其中有8个是具有左递归性质的, 它们在下一轮又可以组合出更多的可能. 体现在语法分析上, 就是我们的文法可以接受任意长度的 以`+` `-` 连接的二元表达式, 形如`1+2-3+4-5...+n`

```
+─────────────+─────────────────────────+─────────────────────────+─────────────────────────+──────────────────────────+
|             | A->A+digit-digit        | A->A+digit-digit        | A->A-digit+digit        | A->A-digit-digit         |
+─────────────+─────────────────────────+─────────────────────────+─────────────────────────+──────────────────────────+
| A->digit    | A->digit+digit-digit    | A->digit+digit-digit    | A->digit-digit+digit    | A->digit-digit-digit     |
+─────────────+─────────────────────────+─────────────────────────+─────────────────────────+──────────────────────────+
| A->A+digit  | A->A+digit+digit-digit  | A->A+digit+digit-digit  | A->A+digit-digit+digit  | A->A+digit-digit-digit   |
+─────────────+─────────────────────────+─────────────────────────+─────────────────────────+──────────────────────────+
| A->A-digit  | A->A-digit-digit+digit  | A->A-digit-digit-digit  | A->A-digit-digit+digit  | A->A-digit-digit-digit   |
+─────────────+─────────────────────────+─────────────────────────+─────────────────────────+──────────────────────────+
```

推演到这里, 可以预测到N轮时,会新增多少种组合,以及其中又会有多少种左递归的推导,m为候选式数量(当前例子中为3),n为左递归候选式数量(当前例子中为2):

```
+───+────────────────────────────────+─────────────────+
|   | total (cartesian product)      | left-recursive  |
+───+────────────────────────────────+─────────────────+
| 1 | m*n                            | m*m             |
+───+────────────────────────────────+─────────────────+
| 2 | m*m*n                          | m*m*m           |
+───+────────────────────────────────+─────────────────+
| 3 | A->m*m*m*n                     | m*m*m*m         |
+───+────────────────────────────────+─────────────────+
| N | (m^N)*n                        | m^(N+1)         |
+───+────────────────────────────────+─────────────────+
```

经历了上面的演绎, 我们可以得出一个结论, **左递归产生式的本质是通过不断的集合相乘去产生无限种组合,而文法接受的句子则可以是其中的任意一种** .



## 优先级

```
S -> A;

A ->
	M |
	A '+' M |
	A '-' M ;

M ->
	F |
	M '*' digit |
	M '/' digit |
	M '%' digit ;

F -> digit ;
```

```

S -> A;

A ->
	M |
	M '+' A |
	M '-' A ;

M ->
	F |
	F '*' M |
	F '/' M |
	F '%' M ;

F -> digit ;

1+2*3-4/5%6

S -> A
A -> M '+' A
A -> F '+' A
A -> 1 '+' A
A -> 1 '+' M '-' A
A -> 1 '+' F '*' M '-' A
A -> 1 '+' 2 '*' M '-' A
A -> 1 '+' 2 '*' F '-' A
A -> 1 '+' 2 '*' 3 '-' A
A -> 1 '+' 2 '*' 3 '-' M
A -> 1 '+' 2 '*' 3 '-' F '/' M
A -> 1 '+' 2 '*' 3 '-' F '/' M

A -> digit '+' digit '*' ·F '-' A
A -> digit '+' digit '*' digit '-' ·A

A -> digit '+' digit '*' digit '-' ·M
A -> digit '+' digit '*' digit '-' ·F
A -> digit '+' digit '*' digit '-' ·digit
```

## 中间递归

`self -> <prefix> <self> <postfix>` 保证了可以无限内嵌自身

`self -> <other>` 保证了嵌套结构最终可以收敛

```
self ->
	<other> |
	<prefix> <self> <postfix>
```

**推导**

```
<prefix> <self> <postfix>
<prefix> <prefix> <self> <postfix> <postfix>
<prefix> ...(n) <prefix> <self>  <postfix> ...(n) <postfix>
<prefix> ...(n) <prefix> <other>  <postfix> ...(n) <postfix>
```

**应用**

JS中支持 `new ...n new Identifier ()...n()` 的结构,如下:

```js
function AA(){
	return function BB(){ return Date} 
}
new new new AA()()()
```

其对应的文法如下:

```
NewExpression ->
	PrimaryExpresion |
	'new' NewExpression Arguments
```

## 后缀重复(左递归)

**用途** 
满足 `<other> <postfix>...n<postfix>`的句子

```
self ->
	<other> |
	<self> <postfix>
```

**推导**

```
self -> <self> <postfix>
self -> <self> <postfix> <postfix>
self -> <self> <postfix> <postfix> <postfix>
self -> <self> <postfix> ...n <postfix>
self -> <other> <postfix> ...n <postfix>
```

**应用**

多维数组或对象属性访问, 例如: `arr[x][y][z]` `obj.x.y.z`

```
MemberExpresion -> 
	PrimaryExpresion |
	MemberExpresion '[' Expression ']' |
	MemberExpresion '.' IDENTIFIER
```

函数调用, 对象、对象属性、数组成员可以是一个函数, 自然的,可以通过 `( arg1...argN )`调用 , 
```
CallExpression ->
	MemberExpression Arguments
```
而函数的返回结果也可以是函数, 那么形如 `fn()...()`的句子也应该被接受,通过重复`Arguments`即可满足

```
CallExpression ->
	CallExpression Arguments
```

函数的返回值也可以是一个数组或对象, 那么形如`fn()[1]...[n]`或`fn().a.b.c...n`的句子应该被接受, 因此需要让成员访问可以连续出出现

```
CallExpression ->
	CallExpression '[' Expression ']' |
	CallExpression '.' Identifier
```


```
PrimaryExpresion ->


LeftSideExpression ->
	CallExpression
	NewExpression
```


## 舍弃的语法

连续表达式作为索引访问数组成员

```
[4,2,1][(a=2),(a=1)]
```

连续new

```
new new (function(){return Date})
```

字符串字面量作为 对象的属性名

```
{"prop":"val"}
```
> 以后考虑支持 {[Identifier]:"val"}