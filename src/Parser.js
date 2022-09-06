/**
 * parser: recurisve descent implementation;
 */
const {  Tokenizer } = require('./Tokenizer');

class Parser {

  /**
   * Initializes the parser
   * @param {*} string
   * @returns
   */
  constructor() {
    this._string = '';
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
    }
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
    while (this._lookahead != null) {
      statementList.push(this.Statement());
    }
    return statementList;
  }

  /**
   * Statement
   *  :ExpressionStatement
   *  ;
   */
  Statement() {
    return this.ExpressionStatement();
  }

  /**
   * ExpressionStatement
   *  :Expression ';'
   *  ;
   */
   ExpressionStatement() {
    const expression = this.Expression();
    this._eat(';'); // 消费掉分号
    return {
      type: 'ExpressionStatement',
      expression,
    };
   }

   /**
    *
    */
   Expression() {
    return this.Literal();
   }

  /**
   * Literal
   * : NumericLiteral
   * | StringLiteral
   * ;
   */
  Literal() {
    const token = this._lookahead;
    switch(token.type) {
      case "NUMBER":
        return this.NumericLiteral()
      case "STRING":
        return this.StringLiteral();
    }
    throw new SyntaxError(
      `Literal: unexpected literal product`
    );
  }
  /**
   * StringLiteral
   *  : STRING
   *  ;
   */
  StringLiteral() {
    const token = this._eat('STRING');
    return {
      type: 'StringLiteral',
      value: token.value.slice(1, -1),
    }
  }

  /**
   * NumericLiteral
   *  : NUMBER
   *  ;
   */
  NumericLiteral() {
    const token = this._eat('NUMBER');
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
      )
    }

    if (token.type !== tokenType) {
      throw new SyntaxError(
        `Unexpected token: "${token.type}", expected: "${tokenType}"`
      )
    }
    // advance to next token.
    this._lookahead = this._tokenizer.getNextToken();
    return token;
  }
}

module.exports = {
  Parser,
};
