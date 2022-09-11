/**
 * parser: recurisve descent implementation;
 */
const { Tokenizer } = require("./Tokenizer");

const stopLookahead = "}";

class Parser {
  /**
   * Initializes the parser
   * @param {*} string
   * @returns
   */
  constructor() {
    this._string = "";
    this._tokenizer = new Tokenizer();
  }

  parse(string) {
    // parse code into an ast
    this._string = string;
    this._tokenizer.init(this._string);
    // prime the tokenizer to obtain the first
    // token which is our lookhead. the lookhead
    // used fo predictive parsing.
    this._lookahead = this._tokenizer.getNextToken();

    return this.Program();
  }

  /**
   * Main entry point
   * progrma:
   *  :StatementList
   */
  Program() {
    return {
      type: "Program",
      body: this.StatementList(),
    };
  }

  /**
   * 准备知识
   *
   * 左递归
   * 产生式 expr = expr + term
   * StatementList = StatementList + Statement
   *
   * 代码实现
   * StatementList
   *  : Statement
   *  | StatementList Statement -> StatementList Statement Statement
   *                            -> StatementList Statement Statement Statement
   *                            -> StatementList Statement Statement Statement Statement
   *
   */
  StatementList() {
    const statementList = [this.Statement()];
    // 读取}之前的作为语句;
    while (this._lookahead != null && this._lookahead.type !== stopLookahead) {
      statementList.push(this.Statement());
    }
    return statementList;
  }

  /**
   * Statement
   *  :ExpressionStatement ｜ BlockStatement | EmptyStatement ｜ VaribleStatenent
   *  ;
   */
  Statement() {
    switch (this._lookahead.type) {
      case "{":
        return this.BlockStatement();
      case ";":
        return this.EmptyStatement();
      case "let":
        return this.VaribleStatement();
      default:
        return this.ExpressionStatement();
    }
  }
  /**
   * VaribleStatement
   * : 'let' VaribleDeclarationList ';'
   * ;
   * @returns
   */
  VaribleStatement() {
    this._eat('let'); // 消费掉let，tokenizer继续
    const declarations = this.VaribleDeclarationList();
    this._eat(';')
    return {
      type: 'VaribleStatement',
      declarations,
    }
  }
  /**
   * VaribleDeclarationList
   * : VaribleDeclaration | VaribleDeclarationList ',' VaribleDeclaration
   * ;
   */
  VaribleDeclarationList() {
    const declarations = [];
    do {
      declarations.push(this.VaribleDeclaration());
    } while(this._lookahead.type === ',' && this._eat(','));
    return declarations;
  }

  /**
   * VaribleDeclaration
   * : Identifier OptionalVaribleInitializer
   * ;
   */
  VaribleDeclaration() {
    const id = this.Identifier();
    const init = this._lookahead.type === 'ASSIGNMENT'
      ? this.VaribleInitializer()
      : null;
    const varible = {
      type: 'VaribleDeclaration',
      id,
      init,
    };
    return varible;
  }
  /**
   * VaribleInitializer
   * : 'ASSIGNMENT'
   */
  VaribleInitializer() {
    this._eat('ASSIGNMENT');
    const expression = this.AssignmentExpression();
    // this._eat(';')
    return expression;
  }

  /**
   * EmptyStatement
   *  : ';'
   *  ;
   */
  EmptyStatement() {
    this._eat(";");
    return {
      type: "EmptyStatement",
    };
  }

  /**
   * BlockStatement
   *  : '{' Statement '}'
   *  ;
   */
  BlockStatement() {
    this._eat("{");
    const body = this._lookahead.type !== "}" ? this.StatementList() : [];
    this._eat("}");
    return {
      type: "BlockStatement",
      body,
    };
  }

  /**
   * ExpressionStatement
   *  : Expression ';'
   *  ;
   */
  ExpressionStatement() {
    const expression = this.Expression();
    this._eat(";"); // 消费掉分号
    return {
      type: "ExpressionStatement",
      expression,
    };
  }

  /**
   * Expression
   *   : AssignmentExpression
   *   ;
   */
  Expression() {
    return this.AssignmentExpression();
  }

  /**
   * AssignmentExpression
   *  : AdditiveExpression
   *  | LeftHandExpression AssignmentOperator AssignmentExpression;  a = 12 或者 a = b = 12;
   *  ;
   */
  AssignmentExpression() {
    let left = this.AdditiveExpression(); // 因为赋值语句的优先级低于+-运算符，所以+-*/运算符下行
    if (!this._isAssignmentOperator(this._lookahead.type)) {
      return left;
    }
    return {
      type: "AssignmentExpression",
      left: this._isAssignmentTargetValid(left),
      operator: this.AssignmentOperator().value,
      right: this.AssignmentExpression(), // 支持a = b = 1
    };
  }

  /**
   * LeftHandExpression
   *  : Identifier
   *  ;
   */
   LeftHandSideExpression() {
    return this.Identifier();
  }

  /**
   * Identifier
   * @returns
   */
  Identifier() {
    const identifer = this._eat('IDENTIFIER');
    return {
      type: 'Identifier',
      name: identifer.value,
    }
  }


  _isAssignmentTargetValid(node) {
    if (node.type === 'Identifier') {
      return node;
    }
    throw new SyntaxError(`Invalid left-hand side in assignment expression`);
  }

  _isAssignmentOperator(tokenType) {
    return ['ASSIGNMENT', 'COMPLEX_ASSIGNMENT'].includes(tokenType);
  }
  /**
   *  AssignmentOperator
   *  : ASSIGNMENT
   *  | COMPLEX_ASSIGNMENT
   *  ;
   */
  AssignmentOperator() {
    if (this._lookahead.type === 'ASSIGNMENT') {
      return this._eat('ASSIGNMENT');
    }
    return this._eat('COMPLEX_ASSIGNMENT');
  }

  /**
   * AdditiveExpression
   *   : Literal
   *   | AdditiveExpression Additive_Operator Literal
   *
   *  需要兼容/*高优先级
   * AdditiveExpression
   *   : MultiplicativeExpression
   *   | AdditiveExpression Additive_Operator MultiplicativeExpression ->  MultiplicativeExpression Additive_Operator MultiplicativeExpression
   */
  AdditiveExpression() {
    let left = this.MultiplicativeExpression(); // 因为*/运算符优先级高于+-，所以下行
    while (this._lookahead.type === "ADDITIVE_OPERATOR") {
      const operator = this._eat("ADDITIVE_OPERATOR").value; // +-
      const right = this.MultiplicativeExpression();
      left = {
        left,
        operator,
        right,
        type: "BinaryExpression",
      };
    }
    return left;
  }

  /**
   * MultiplicativeExpression
   *  : PrimaryExpression
   *  | MultiplicativeExpression MULTIPLICATIVE_OPERATOR PrimaryExpression -> PrimaryExpression MULTIPLICATIVE_OPERATOR PrimaryExpression
   *  ;
   */
  MultiplicativeExpression() {
    let left = this.PrimaryExpression(); // 括号，字面量的优先级高于乘除的优先级，所以继续下行
    while (this._lookahead.type === "MULTIPLICATIVE_OPERATOR") {
      const operator = this._eat("MULTIPLICATIVE_OPERATOR").value;
      let right = this.PrimaryExpression();
      left = {
        left,
        operator,
        right,
        type: "BinaryExpression",
      };
    }
    return left;
  }

  /**
   * PrimaryExpression
   * : Literal | ParenthesizedExpression | LeftHandSideExpression
   * ;
   */
  PrimaryExpression() {
    const tokenType = this._lookahead.type
    if (tokenType === 'STRING' || tokenType === "NUMBER") {
      return this.Literal();
    }

    if (tokenType === "(") {
      return this.ParenthesizedExpression(); // 括号中包含一个Expression
    }

    return this.LeftHandSideExpression(); // 返回Identifier符号=
  }

  /**
   * ParenthesizedExpression
   * : '(' Expression ')
   * ;
   */
  ParenthesizedExpression() {
    this._eat("(");
    let expression = this.Expression();
    this._eat(")");
    return expression;
  }
  /**
   * Literal
   * : NumericLiteral
   * | StringLiteral
   * ;
   */
  Literal() {
    const token = this._lookahead;
    switch (token.type) {
      case "NUMBER":
        return this.NumericLiteral();
      case "STRING":
        return this.StringLiteral();
    }
    console.log('token--', token);
    throw new SyntaxError(`Literal: unexpected literal product`);
  }
  /**
   * StringLiteral
   *  : STRING
   *  ;
   */
  StringLiteral() {
    const token = this._eat("STRING");
    return {
      type: "StringLiteral",
      value: token.value.slice(1, -1),
    };
  }

  /**
   * NumericLiteral
   *  : NUMBER
   *  ;
   */
  NumericLiteral() {
    const token = this._eat("NUMBER");
    return {
      type: "NumericLiteral",
      value: Number(token.value),
    };
  }

  /**
   * Expects a token of given type
   */
  _eat(tokenType) {
    const token = this._lookahead;
    if (token === null) {
      throw new SyntaxError(
        `Unexpected end of input, expected: "${tokenType}"`
      );
    }

    if (token.type !== tokenType) {
      throw new SyntaxError(
        `Unexpected token: "${token.type}", expected: "${tokenType}"`
      );
    }
    // advance to next token.
    this._lookahead = this._tokenizer.getNextToken();
    return token;
  }
}

module.exports = {
  Parser,
};
