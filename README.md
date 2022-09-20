# parser
一个简单的编译器


### v1的词法结构
```javascript
  Program:
    Literal:
      StringLiteral
      NumericLiteral
```
实例
```javascript
// 单行注释
/*
 * 多行注释
 */
"hello"
123456
```

### v2的词法结构
```javascript
  Program:
    StatementList:
      [
        Statement:
          ExpressionStatement:
            Literal;
      ]
```
实例
```javascript
// 单行注释
"hello";
/** 多行注释 */
123456;
```

### v3的词法结构
##### 增加语句块的支持block和空的语句
```javascript

  Program:
    StatementList:
      [
        Statement: 
          ExpressionStatement:
            Literal
          BlockStatement:
            StatementList;  // 递归
          EmptyStatement;
      ]
```
示例
```javascript
// block嵌套
{
  // 单行注释
  12;
  "hello";
  {
    "hello";
    123456;
    ; // empty statement
  }
}
```

### v4的词法
##### 增加双目运算符加减乘除
```javascript 
// 在v4中增加了双目运算符号
Program:
  StatementList:
    Statement: <--------------|   
      EmptyStatement          |
      BlockStatement >--------|                // block代码块
      ExpressionStatement   <----------------|
        AdditiveExpression                   |
          MultiplicativeExpression           |
            PrimaryExpression                |
              Literal                        |
              ParenthesizedExpression >------|  // 控制优先级
    ...
```
示例
```javascript
  2 + 3;
  2 + 3 - 4;
  (2 + 3) - 4;
  2 * 3 + 4;
  (2 + 3) * 4;
```

### v5的词法
##### 增加赋值语句
```javascript 
// 在v5中增加了=，+=，-=，*=， /= 等左操作赋值运算
Program:
  StatementList:  <-----------|
    Statement:                |   
      EmptyStatement          |
      BlockStatement >--------|                // block代码块
      ExpressionStatement   <--------------------|
        AssignmentExpression                     |
            AdditiveExpression                   |
              MultiplicativeExpression           |
                PrimaryExpression                |
                  Literal                        |
                  ParenthesizedExpression >------|  // 控制优先级
                  LeftHandSideExpression
                    Identifier                    // 赋值标志符  
                
        
    ...
```
示例
```javascript
a = 12;
a = b = 12;
a += 12;
a = (b + 12);
```

### v6的词法
##### 增加变量申明
```javascript 
// 变量申明，重用了ASSIGNMENT
Program:
  StatementList    <---------|
    Statement                |
      EmptyStatement         |
      BlockStatement --------|
      ExpressionStatement
        Expression                       <----|
          AssignmentExpression                |  <--- |
            AdditiveExpression                |       |
              MultiplicativeExpression        |       |
                PrimaryExpression             |       |
                  Literal                     |       |
                  ParenthesizedExpression  ---|       |
                  LeftHandSideExpression              |
                    Identifier                        |
      VaribleStatement:                               |
        VaribleDeclaration:                           |
          Identifier                                  |
          Initializor                                 |
            AssignmentExpression   -------------------|
```
示例
```javascript
let a = 12;
let a;
let a, b;
let a, b = 2;
let a = 1, b = 2;
let a = b = 1;
```

### v7的词法
##### 增加IF语句
```javascript
if (x) {
  x = 10;
} else {
  x = 10;
}
// 语法结构
Program
  Statement[]       <--------|
    Statement                |   <----|
      EmptyStatement         |        |
      BlockStatement --------|        |
      ExpressionStatement             |
        Expression       <---|        |
      IfStatement            |        |
        Expression  ---------|        |
        Statement   ------------------|

// >,<,==,>=, <=, BinaryExpression
// 示例
x > 10; // BinaryExpression
x + 10 > 20; // 和AdditiveExpression优先级
y = x + 10 > 20; // 和AssignmentExpression优先级
// 优先级：AdditiveExpression > BinaryExpression > AssignmentExpression

// 语法结构
Program
  Statement[]
    Statement
      EmptyStatement
      BlockStatement
      ExpressionStatement
        Expression
          AssignmentExpression
            RelationalExpression
              AdditiveExpression
                MultiplicativeExpression
                  PrimaryExpression
                    Literal
                    ParenthesizedExpression
                    LeftHandSideExpression
                      Identifier
      IfStatement
        Expression
        Statement

```
示例：
```javascript
if (x > 0) {
  x = 10;
} else {
  x = 10;
}

if (x + 1 > 0) {
  x = 10;
} else {
  x = 10;
}

y = x + 1 > 0
```

### v8的词法
##### 增加等值运算语句(==, !=)和boolean符号(true, false),以及Null

语法结构:
Program
  Statement[]
    Statement
      EmptyStatement
      BlockStatement
      ExpressionStatement
        Expression
          AssignmentExpression
            EqualityExpression
              RelationalExpression
                AdditiveExpression
                  MultiplicativeExpression
                    PrimaryExpression
                      Literal
                        NumericLiteral
                        StringLiteral
                        BooleanLiteral
                        NullLiteral
                      ParenthesizedExpression
                      LeftHandSideExpression
                        Identifier
      IfStatement
        Expression
        Statement
示例:
```javascript
  x > 0 == true;
  x > 0 != false;
```

##### 增加逻辑运算符(&&, ||)
语法结构:
Program
  Statement[]
    Statement
      EmptyStatement
      BlockStatement
      ExpressionStatement
        Expression
          AssignmentExpression
            LogicalOrExpression
              LogicalAndExpression
                EqualityExpression
                  RelationalExpression
                    AdditiveExpression
                      MultiplicativeExpression
                        PrimaryExpression
                          Literal
                            NumericLiteral
                            StringLiteral
                            BooleanLiteral
                            NullLiteral
                          ParenthesizedExpression
                          LeftHandSideExpression
                            Identifier
      IfStatement
        Expression
        Statement
示例:
```javascript
  x > 0 && y < 1;
  x > 0 || y < 1;
  x > 0 && x < 5 || y < 1;
```


### 知识点
#### v1的BNF语法:
- Factor = Num | (Expr)
- Num、(Expr) 优先级最高，所以做叶子节点，把他们统称为Factor


#### 左递归
- 产生式分成递归的和非递归的，如果一个产生式用自己来表示自己就会产生递归.
- A=A’b’（'b’表示字符常量b）, 产生式一直朝左侧延伸，无法结束，永远不会结束，所以叫左递归.
- 它永远无法得到第一个叶子节点，因为左侧在无限递归产生新的左叶子节点.
- 子节点和父节点相同叫直接左递归，子节点和非父节点的祖先相同叫间接左递归.
- 递归可以消除是因为左递归和右递归可以互相转化，但是并不是都能互相转化
- 为什么只需要消除左递归？我们需要明确第一个叶子节点的重要含义：第一个节点是语法的起点，所以第一个节点很重要，如果没有第一个叶子节点，那么就永远无法判断此语法是从哪个字符开始的。所以存在左递归的文法，是无法通过程序解析的，这样的程序无法实现.相反地，右递归有第一个叶子节点，没有最后一个叶子节点。有第一个叶子节点就可以判断语法从哪个字符开始，但是不知道语法在何时结束。在实际解析中，因为被解析的文本是有限长的，所以右递归一定会停止。除此之外，因为右递归一定有起始符号，所以在解析文本时，一旦遇到非起始符的字符串，也会停止解析。也就是说，右递归能自动保证语法的正确性，而且不会无穷递归。
