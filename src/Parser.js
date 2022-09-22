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
   *  :ExpressionStatement ｜ BlockStatement | EmptyStatement ｜ VaribleStatenent | IfStatement
   *  ;
   */
  Statement() {
    switch (this._lookahead.type) {
      case "if":
        return this.IfStatement();
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
   * IfStatement
   *  : 'if' '(' Expression ')' Statement
   *  | 'if' '(' Expression ')' Statement 'else' Statement
   *  ;
   */
  IfStatement() {
    this._eat('if');
    this._eat('(');
    const test = this.Expression();
    this._eat(')');
    const consequent = this.Statement();
    const alternate = (this._lookahead && this._lookahead.type === 'else') ? (this._eat('else') && this.Statement()) : null;
    return {
      type: 'IfStatement',
      test,
      consequent,
      alternate,
    };
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
   *  : LogicalOrExpression
   *  | LeftHandExpression AssignmentOperator AssignmentExpression;  a = 12 或者 a = b = 12;
   *  ;
   */
  AssignmentExpression() {
    let left = this.LogicalOrExpression(); // 因为赋值语句的优先级低于+-运算符，所以+-*/运算符下行
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
   * UnaryExpression
   *  : LeftHandSideExpression
   *  | ADDITIVE_OPERATOR UnaryExpression
   *  | LOGICAL_NOT UnaryExpression
   *  ;
   */

  UnaryExpression() {
    const unaryTokenTypes = ['ADDITIVE_OPERATOR', 'MULTIPLICATIVE_OPERATOR', 'LOGICAL_NOT'];
    if (unaryTokenTypes.includes(this._lookahead.type)) {
      const operator = this._eat(this._lookahead.type).value;
      return {
        type: 'UnaryExpression',
        operator,
        argument: this.UnaryExpression(), // --x; !!x  ++x
      };
    }
    return this.LeftHandSideExpression();
  }

  /**
   * LeftHandExpression
   *  : PrimaryExpression
   *  ;
   */
   LeftHandSideExpression() {
    return this.PrimaryExpression();
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
   * LogicalOperator: ||
   *  x || y
   *
   * LogicalOrExpression
   *  : LogicalAndExpression
   *  | LogicalAndExpression 'LOGICAL_OR' LogicalOrExpression
   */
  LogicalOrExpression() {
    return this._LogicalExpression('LogicalAndExpression', 'LOGICAL_OR');
  }

  /**
   * LogicalOperator: &&
   *  x && y
   *
   * LogicalAndExpression
   *  :EqualityExpression
   *  | EqualityExpression 'LOGICAL_AND' LogicalAndExpression
   */
  LogicalAndExpression() {
    return this._LogicalExpression('EqualityExpression', 'LOGICAL_AND');
  }

  /**
   * EQUALITY_OPERATOR: ==, !=
   *
   * EqualityExpression:
   *  : RelationalExpression
   *  | RelationalExpression EQUALITY_OPERATOR EqualityExpression
   *
   */
  EqualityExpression() {
    return this._BinaryExpression('RelationalExpression', 'EQUALITY_OPERATOR');
  }

  /**
   * RELATIONAL_OPERATOR: >, <, >=, <=
   *
   * RelationalExpression
   *  AdditiveExpression
   *  | AdditiveExpression RELATIONAL_OPERATOR RelationalExpression
   *  ; TODO: 未实现
   */
  RelationalExpression() {
    return this._BinaryExpression('AdditiveExpression', 'RELATIONAL_OPERATOR');
  }

  /**
   * Additive_Operator: +,-
   * a+b, a-b
   *
   * AdditiveExpression
   *   : MultiplicativeExpression
   *   | AdditiveExpression Additive_Operator MultiplicativeExpression
   */
  AdditiveExpression() {
    return this._BinaryExpression('MultiplicativeExpression', 'ADDITIVE_OPERATOR');
  }

  /**
   * MULTIPLICATIVE_OPERATOR: *,/
   * a*b, a/b
   *
   * MultiplicativeExpression
   *  : UnaryExpression
   *  | MultiplicativeExpression MULTIPLICATIVE_OPERATOR UnaryExpression
   *  ;
   */
  MultiplicativeExpression() {
    return this._BinaryExpression('UnaryExpression', 'MULTIPLICATIVE_OPERATOR');
  }


  _LogicalExpression(builderName, tokenType) {
    let left = this[builderName]();
    while (this._lookahead.type === tokenType) {
      const operator = this._eat(tokenType).value;
      const right = this[builderName]();
      left = {
        type: 'LogicalExpression',
        left,
        operator,
        right,
      };
    }
    return left;
  }

  _BinaryExpression(builderName, tokenType) {
    let left = this[builderName]();
    while (this._lookahead.type === tokenType) {
      const operator = this._eat(tokenType).value;
      const right = this[builderName]();
      left = {
        type: 'BinaryExpression',
        left,
        operator,
        right,
      };
    }
    return left;
  }

  /**
   * PrimaryExpression
   * : Literal
   * | ParenthesizedExpression
   * | Identifier
   * ;
   */
  PrimaryExpression() {
    const tokenType = this._lookahead.type;
    // 是否为Literal
    const literalTokenTypes = ['STRING', 'NUMBER', 'true', 'false', 'null'];
    if (literalTokenTypes.includes(tokenType)) {
      return this.Literal();
    }

    if (tokenType === "(") {
      return this.ParenthesizedExpression(); // 括号中包含一个Expression
    }

    if (tokenType === 'IDENTIFIER') {
      return this.Identifier();
    }

    return this.LeftHandSideExpression();
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
   * | BooleanLiteral
   * | NullLiteral
   * ;
   */
  Literal() {
    const token = this._lookahead;
    switch (token.type) {
      case "NUMBER":
        return this.NumericLiteral();
      case "STRING":
        return this.StringLiteral();
      case "true":
        return this.BooleanLiteral(true);
      case "false":
        return this.BooleanLiteral(false);
      case "null":
        return this.NullLiteral();
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
   * BooleanLiteral
   *  : true
   *  | false
   *  ;
   */
  BooleanLiteral(value) {
    this._eat(value ? 'true' : 'false');
    return {
      type: "BooleanLiteral",
      value,
    };
  }
  /**
   * NullLiteral
   *  : null
   *  ;
   */
  NullLiteral() {
    this._eat('null');
    return {
      type: "NullLiteral",
      value: null,
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
      console.log('token', token);
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
