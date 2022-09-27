const { Parser } = require('./Parser');
const { Scope } = require('./Scope');
const { Symbol } = require('./Symbol');

// Interpreter

class Interpreter  {
  constructor(parser) {
    this.parser = new Parser();
  }

  /**
   * interpret
   */
  interpret(program) {
    const tree = this.parser.parse(program);
    this.visit(tree);
  }

  visit(node) {
    const { type } = node;
    const visitMethodName = `visit${type}`;
    if (this[visitMethodName]) {
      return this[visitMethodName](node);
    } else {
      throw new EvalError(`no visit method "${visitMethodName}" defined`);
    }
  }
  /**
   * 主入口
   * @param {*} node
   */
  visitProgram(node) {
    const { body } = node;
    // 创建全局作用域
    const globalScope = new Scope('GLOBAL', 1);
    this.scope = globalScope;
    for (const statement of body) {
      this.visit(statement);
    }
    this.scope = globalScope;
  }

  visitBlockStatement(node) {
    const { body } = node;
    const scope = new Scope('BLOCK', this.scope.level + 1, this.scope);
    this.scope = scope;
    for (const Statement of body) {
      this.visit(Statement);
    }
    this.scope = scope.parent;
  }

  visitCallExpression(node) {
    const { callee, arguments: args } = node;
    const a = this.visit(callee);
    // lookup real params
    console.log('scope', this.scope);
    const realParams = args.map(item => {
      const name = this.visit(item);
      if (item.type === 'Identifier') {
        return this.scope.lookup(name);
      }
      return name;
    });
    // TODO: hard code test: print
    if (a === 'print') {
      console.log(...realParams);
    }
  }

  visitAssignmentExpression(node) {
    const { operator, left, right } = node;
    let lhs = this.visit(left);
    let rhs = this.visit(right);
    switch(operator) {
      case '=':
        return this.scope.inert(new Symbol(lhs, rhs));
    }

  }

  visitExpressionStatement(node) {
    const { expression } = node;
    this.visit(expression);
  }

  visitVariableStatement(node) {
    const { declarations } = node;
    for (const declaration of declarations) {
      this.visit(declaration);
    }
  }

  visitVariableDeclaration(node) {
    const {id, init} = node;
    const name = this.visit(id);
    const value = this.visit(init);
    this.scope.inert(new Symbol(name, value));
  }

  visitIdentifier(node) {
    const { name } = node;
    return name;
  }

  /**
   * 访问二元表达式
   *
   * @param {BinaryExpression} node
   * @returns
   */
  visitBinaryExpression(node) {
    const { operator, left, right } = node;
    switch (operator) {
      case '+':
        return this.visit(left) + this.visit(right);
      case '-':
        return this.visit(left) - this.visit(right);
      case '*':
        return this.visit(left) * this.visit(right);
      case '/':
        return this.visit(left) / this.visit(right);
    }
  }

  /**
   * 访问数字元字面量
   */
  visitNumericLiteral(node) {
    const { value } = node;
    return value;
  }
  visitStringLiteral(node) {
    const { value } = node;
    return value;
  }
  visitNullLiteral(node) {
    const { value } = node;
    return value;
  }
  visitBooleanLiteral(node) {
    const { value } = node;
    return value;
  }
}

module.exports = {
  Interpreter,
}
