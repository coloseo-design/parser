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
   *  :Literal
   */
  Program() {
    return {
      type: "Program",
      body: this.Literal(),
    }
  }

  /**
   * Literal
   * : NumericLiteral
   * | StringLiteral
   * ;
   */
  Literal() {
    const token = this._lookahead;
    console.log('token', token);
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
    console.log('token', token.value);
    return {
      type: 'StringLiteral',
      value: token.value,
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
