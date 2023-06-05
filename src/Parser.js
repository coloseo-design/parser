/**
 * parser: recursive descent implementation;
 */
const { AssignmentExpression } = require("./nodes/AssignmentExpression");
const { BinaryExpression } = require("./nodes/BinaryExpression");
const { BlockStatement } = require("./nodes/BlockStatement");
const { CallExpression } = require("./nodes/CallExpression");
const { DoWhileStatement } = require("./nodes/DoWhileStatement");
const { EmptyStatement } = require("./nodes/EmptyStatement");
const { ExpressionStatement } = require("./nodes/ExpressionStatement");
const { ForStatement } = require("./nodes/ForStatement");
const { FunctionDeclaration } = require("./nodes/FunctionDeclaration");
const { Identifier } = require("./nodes/Identifier");
const { IfStatement } = require("./nodes/IfStatement");
const { Literal } = require("./nodes/Literal");
const { LogicalExpression } = require("./nodes/LogicalExpression");
const { MemberExpression } = require("./nodes/MemberExpression");
const { ReturnStatement } = require("./nodes/ReturnStatement");
const { SequenceExpression } = require("./nodes/SequenceExpression");
const { UnaryExpression } = require("./nodes/UnaryExpression");
const { VariableDeclaration } = require("./nodes/VariableDeclaration");
const { VariableStatement } = require("./nodes/VariableStatement");
const { WhileStatement } = require("./nodes/WhileStatement");
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
    // token which is our lookahead. the lookahead
    // used fo predictive parsing.
    this._lookahead = this._tokenizer.getNextToken();

    return this.Program();
  }

  /**
   * Main entry point
   * program:
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
   *  : ExpressionStatement
   *  | BlockStatement
   *  | EmptyStatement
   *  | VariableStatement
   *  | IfStatement
   *  | IterationStatement
   *  | ReturnStatement
   *  | FunctionDeclaration
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
        return this.VariableStatement();
      case "do":
      case "while":
      case "for":
        return this.IterationStatement();
      case "return":
        return this.ReturnStatement();
      case "function":
        return this.FunctionDeclaration();
      default:
        return this.ExpressionStatement();
    }
  }

  /**
   * FunctionDeclaration
   * : 'function' Identifier '(' FunctionParamList ')' BlockStatement
   * ;
   */
  FunctionDeclaration() {
    this.consume('function');
    const id = this.Identifier();
    const params = this.FunctionParamList();
    const body = this.BlockStatement();
    return new FunctionDeclaration(id, params, body);
  }

  /**
   * FunctionParamList
   * : FunctionParamList ',' Identifier
   * ;
   */
  FunctionParamList() {
    const params = [];
    this.consume('(');

    if (this._lookahead.type !== ')') {
      do {
        params.push(this.Identifier());
      } while (this._lookahead.type === ',' && this.consume(','))
    }
    this.consume(')')
    return params;
  }

  /**
   * ReturnStatement:
   * : 'return' [Expression];
   * ;
   */
  ReturnStatement() {
    this.consume('return');
    const argument = this._lookahead.type === ';' ? null : this.Expression(); // return; | return x;
    this.consume(';');
    return new ReturnStatement(argument);
  }

  /**
   * IterationStatement
   *  : WhileStatement
   *  | DoWhileStatement
   *  | ForStatement
   */
  IterationStatement() {
    const tokenType = this._lookahead.type;
    if (tokenType === 'while') {
      return this.WhileStatement();
    }
    if (tokenType === 'do') {
      return this.DoWhileStatement();
    }
    if (tokenType === 'for') {
      return this.ForStatement();
    }
  }

  /**
   * WhileStatement
   * : 'while' '(' Expression ')' Statement
   * ;
   */
  WhileStatement() {
    this.consume('while');
    this.consume('(')
    const test = this.Expression();
    this.consume(')')
    const body = this.Statement();
    return new WhileStatement(test, body);
  }
  /**
   * DoWhileStatement
   *  : 'do' Statement 'while' '(' Expression ')'
   *  ;
   */
   DoWhileStatement() {
    this.consume('do');
    const body = this.Statement();
    this.consume('while');
    this.consume('(');
    const test = this.Expression();
    this.consume(')')
    return new DoWhileStatement(test, body);
   }

  /**
   * ForStatement:
   *  : 'for' '(' OptionalInitExpression ';' OptionalTest ';' OptionalUpdate  ')' Statement
   *  ;
   */
  ForStatement() {
    this.consume('for');
    this.consume('(')
    const init = this._lookahead.type === ';' ? null : this.ForStatementInit();
    this.consume(';')
    const test = this._lookahead.type === ';' ? null : this.Expression();
    this.consume(';');
    const update = this._lookahead.type === ';' ? null : this.Expression();
    this.consume(')');

    const body = this.Statement();
    return new ForStatement(init, test, update, body);
  }
  /**
   * ForStatementInit
   *  : VariableDeclaration
   *  | Expression
   *  ;
   */
  ForStatementInit() {
    if (this._lookahead.type === 'let') {
      return this._VariableStatement();
    }
    return this.Expression();
  }

  /**
   * IfStatement
   *  : 'if' '(' Expression ')' Statement
   *  | 'if' '(' Expression ')' Statement 'else' Statement
   *  ;
   */
  IfStatement() {
    this.consume('if');
    this.consume('(');
    const test = this.Expression();
    this.consume(')');
    const consequent = this.Statement();
    const alternate = (this._lookahead && this._lookahead.type === 'else') ? (this.consume('else') && this.Statement()) : null;
    return new IfStatement(test, consequent, alternate);
  }

  _VariableStatement() {
    this.consume('let'); // 消费掉let，tokenizer继续
    const declarations = this.VariableDeclarationList();
    return new VariableStatement(declarations);
  }

  /**
   * VariableStatement
   * : 'let' VariableDeclarationList ';'
   * ;
   * @returns
   */
  VariableStatement() {
    const variableStatement = this._VariableStatement();
    this.consume(';')
    return variableStatement;
  }
  /**
   * VariableDeclarationList
   * : VariableDeclaration | VariableDeclarationList ',' VariableDeclaration
   * ;
   */
  VariableDeclarationList() {
    const declarations = [];
    do {
      declarations.push(this.VariableDeclaration());
    } while(this._lookahead.type === ',' && this.consume(','));
    return declarations;
  }

  /**
   * VariableDeclaration
   * : Identifier OptionalVariableInitializer
   * ;
   */
  VariableDeclaration() {
    const id = this.Identifier();
    const init = this._lookahead.type === 'ASSIGNMENT'
      ? this.VariableInitializer()
      : null;
    return new VariableDeclaration(id, init);
  }
  /**
   * VariableInitializer
   * : 'ASSIGNMENT'
   */
  VariableInitializer() {
    this.consume('ASSIGNMENT');
    const expression = this.AssignmentExpression();
    // this.consume(';')
    return expression;
  }

  /**
   * EmptyStatement
   *  : ';'
   *  ;
   */
  EmptyStatement() {
    this.consume(";");
    return new EmptyStatement();
  }

  /**
   * BlockStatement
   *  : '{' Statement '}'
   *  ;
   */
  BlockStatement() {
    this.consume("{");
    const body = this._lookahead.type !== "}" ? this.StatementList() : [];
    this.consume("}");
    return new BlockStatement(body);
  }

  /**
   * ExpressionStatement
   *  : Expression ';'
   *  ;
   */
  ExpressionStatement() {
    const expression = this.Expression();
    this.consume(";"); // 消费掉分号
    return new ExpressionStatement(expression);
  }

  /**
   * Expression
   *   : AssignmentExpression
   *   | AssignmentExpression ',' AssignmentExpression
   *   ;
   */
  Expression() {
    const expressions = [];
    do {
      const item = this.AssignmentExpression();
      expressions.push(item);
    } while (this._lookahead.type === ',' && this.consume(','))
    if (expressions.length > 1) {
      return new SequenceExpression(expressions);
    }
    return expressions.shift();
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
    const operator = this.AssignmentOperator().value;
    return new AssignmentExpression(operator, this._isAssignmentTargetValid(left), this.AssignmentExpression());
  }

  /**
   * UnaryExpression
   *  : LeftHandSideExpression
   *  | ADDITIVE_OPERATOR UnaryExpression
   *  | MULTIPLICATIVE_OPERATOR UnaryExpression
   *  | LOGICAL_NOT UnaryExpression
   *  ;
   */

  UnaryExpression() {
    // const unaryTokenTypes = ['ADDITIVE_OPERATOR', 'MULTIPLICATIVE_OPERATOR', 'LOGICAL_NOT'];
    const unaryTokenTypes = ['SELF_ADDITIVE_OPERATOR', 'ADDITIVE_OPERATOR', 'LOGICAL_NOT'];
    if (unaryTokenTypes.includes(this._lookahead.type)) {
      const operator = this.consume(this._lookahead.type).value;
      return new UnaryExpression(operator, this.UnaryExpression());
    }
    return this.LeftHandSideExpression();
  }

  /**
   * LeftHandExpression
   *  : MemberExpression
   *  ;
   */
  LeftHandSideExpression() {
    return this._CallExpression();
  }

  /**
   *  CallExpression
   *  : MemberExpression
   *  | CallExpression
   *  ;
   */
  _CallExpression() {
    const member = this.MemberExpression();
    if (this._lookahead.type === '(') {
      return this.CallExpression(member);
    }
    return member;
  }

  /**
   *  CallExpression
   *
   */
  CallExpression(callee) {
    let expression = new CallExpression(callee, this.Arguments());
    // let expression = {
    //   type: 'CallExpression',
    //   callee,
    //   arguments: this.Arguments(),
    // };
    // a()();
    if (this._lookahead.type === '(') {
      expression = this.CallExpression(expression);
    }
    return expression;
  }
  /**
   * Arguments
   * : '(' [ArgumentList] ')'
   * ;
   */
  Arguments() {
    this.consume('(');
    const args = this._lookahead.type === ')' ? [] : this.ArgumentList();
    this.consume(')');
    return args;
  }

  /**
   * ArgumentList
   * : ArgumentList ',' AssignmentExpression
   * ;
   */
  ArgumentList() {
    const args = [];
    do {
      args.push(this.AssignmentExpression());
    } while (this._lookahead.type === ',' && this.consume(','))
    return args;
  }

  /**
   * x.y ｜ x.y.x | x.y[a.b]
   *
   * MemberExpression
   *  : PrimaryExpression
   *  | MemberExpression '.' Identifier
   *  | MemberExpression '[' Expression ']'
   *  ;
   */
  MemberExpression() {
    let object = this.PrimaryExpression();
    const objectAccessTokenType = ['.', '['];
    while (objectAccessTokenType.includes(this._lookahead.type)) {
      if (this._lookahead.type === '.') {
        this.consume('.');
        object = new MemberExpression(object, this.Identifier());
      }

      if (this._lookahead.type === '[') {
        this.consume('[');
        object = new MemberExpression(object, this.Expression());
        this.consume(']');
      }

    }
    return object;
  }

  /**
   * Identifier
   * @returns
   */
  Identifier() {
    const identifier = this.consume('IDENTIFIER');
    return new Identifier(identifier.value);
  }

  _isAssignmentTargetValid(node) {
    if (node.type === 'Identifier' || node.type === 'MemberExpression') {
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
      return this.consume('ASSIGNMENT');
    }
    return this.consume('COMPLEX_ASSIGNMENT');
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
   *  ;
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
      const operator = this.consume(tokenType).value;
      const right = this[builderName]();
      left = new LogicalExpression(operator, left, right);
    }
    return left;
  }

  _BinaryExpression(builderName, tokenType) {
    let left = this[builderName]();
    while (this._lookahead.type === tokenType) {
      const operator = this.consume(tokenType).value;
      const right = this[builderName]();
      left = new BinaryExpression(operator, left, right);
    }
    return left;
  }

  /**
   * PrimaryExpression
   *  : Literal
   *  | ParenthesizedExpression
   *  | Identifier
   *  ;
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
    return null;
    // return this.LeftHandSideExpression();
  }

  /**
   * ParenthesizedExpression
   *  : '(' Expression ')
   *  ;
   */
  ParenthesizedExpression() {
    this.consume("(");
    let expression = this.Expression();
    this.consume(")");
    return expression;
  }
  /**
   * Literal
   *  : NumericLiteral
   *  | StringLiteral
   *  | BooleanLiteral
   *  | NullLiteral
   *  ;
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
    throw new SyntaxError(`Literal: unexpected literal product`);
  }
  /**
   * StringLiteral
   *  : STRING
   *  ;
   */
  StringLiteral() {
    const token = this.consume("STRING");
    const value = token.value.slice(1, -1); // "string" -> string
    return new Literal('String', value);
  }

  /**
   * NumericLiteral
   *  : NUMBER
   *  ;
   */
  NumericLiteral() {
    const token = this.consume("NUMBER");
    return new Literal('Numeric', Number(token.value));
  }

  /**
   * BooleanLiteral
   *  : true
   *  | false
   *  ;
   */
  BooleanLiteral(value) {
    this.consume(value ? 'true' : 'false');
    return new Literal('Boolean', value);
  }
  /**
   * NullLiteral
   *  : null
   *  ;
   */
  NullLiteral() {
    this.consume('null');
    return new Literal('Null', null);
  }
  /**
   * Expects a token of given type
   */
  consume(tokenType) {
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
