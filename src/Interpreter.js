const { Identifier } = require('./nodes/Identifier');
const { Literal } = require('./nodes/Literal');
const { UnaryExpression } = require('./nodes/UnaryExpression');
const { Parser } = require('./Parser');
const { Function, BuiltinFunction } = require('./scope/Function');
const { Scope } = require('./scope/Scope');
const { Symbol } = require('./scope/Symbol');

// Interpreter

class Interpreter {
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
    globalScope._builtin_();
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
      const result = this.visit(Statement);
      if (Statement.type === 'ReturnStatement') {
        this.scope = scope.parent;
        return result;
      }
    }
    this.scope = scope.parent;
  }

  visitCallExpression(node) {
    const { callee, arguments: args } = node;
    const caller = this.visit(callee);
    // lookup real params
    const realParams = args.map(item => {
      const name = this.visit(item);
      if (item.type === 'Identifier') {
        return this.getSymbol(name).value;
      }
      return name;
    });
    const func = this.getSymbol(caller).value;
    if (!(func instanceof Function)) {
      throw new SyntaxError(`Bad function '${caller}'`)
    }

    if (func instanceof BuiltinFunction) {
      return func.body(...realParams);
    }

    if (func.parameters.length !== args.length) {
      throw new SyntaxError(`Dad number of parameters of '${caller}'`);
    }
    // create new function level scope
    const scope = new Scope('Function', this.scope.level + 1, this.scope);
    this.scope = scope;
    const { body, parameters } = func;
    parameters.forEach((param, index) => {
      const name = this.visit(param);
      this.setSymbol(name, realParams[index]);
    });
    // copy input parameter into scope
    const result = this.visit(body);
    this.scope = scope.parent;
    return result;
  }

  visitAssignmentExpression(node) {
    const { operator, left, right } = node;
    switch (operator) {
      case '=':
      case '+=':
      case '-=':
      case '*=':
      case '/=':
        return this.updateSymbolWithOperator(left, operator, right);
    }
  }

  visitExpressionStatement(node) {
    const { expression } = node;
    this.visit(expression);
  }

  visitForStatement(node) {
    const { init, test, update, body } = node;
    this.visit(init);
    while (this.visit(test)) {
      this.visit(body);
      this.visit(update);
    }
  }

  /**
   * while
   * @param {*} node
   */
  visitWhileStatement(node) {
    const { test, body } = node;
    while(this.visit(test)) {
      this.visit(body);
    }
  }

  /**
   * do-while
   */
  visitDoWhileStatement(node) {
    const {body, test} = node;
    this.visit(body);
    while(this.visit(test)) {
      this.visit(body);
    }
  }

  /**
   * if
   * @param {*} node
   */
  visitIfStatement(node) {
    const {test, consequent, alternate} = node;
    const condition = this.visit(test);
    if (condition) {
      this.visit(consequent)
    } else {
      alternate && this.visit(alternate);
    }
  }

  /**
   * LogicalExpression
   * || &&
   * @param {*} node
   */
  visitLogicalExpression(node) {
    const { operator, left, right } = node;
    let lhs = this.visit(left);
    if (left instanceof Identifier) {
      lhs = this.getSymbol(lhs).value;
    }
    let rhs = this.visit(right);
    if (right instanceof Identifier) {
      rhs = this.getSymbol(rhs).value;
    }
    switch(operator) {
      case '||':
        return lhs || rhs;
      case '&&':
        return lhs && rhs;
    }

  }

  /**
   * UnaryExpression
   * @param {*} node
   * @return Identifier
   */
  visitUnaryExpression(node) {
    let {operator, argument} = node;
    const illegalOperators = [
      '++',
      '--',
    ]
    if (argument instanceof Literal && illegalOperators.includes(operator)) {
      throw new SyntaxError('Invalid left-hand side expression in prefix operation');
    }
    if (argument instanceof UnaryExpression) {
      argument = this.visit(argument);
    }
    if (argument instanceof Literal) {
      const rhsValue = this.visit(argument);
      switch(operator) {
        case '-':
          return -rhsValue;
        case '+':
            return rhsValue;
        case '!':
          return !rhsValue;
      }
    }
    if (argument instanceof Identifier) {
      let rhs = this.visit(argument);
      let rhsValue = this.getSymbol(rhs).value;
      switch(operator) {
        case '-':
          rhsValue = -rhsValue;
          this.updateSymbol(rhs, rhsValue);
          return argument;
        case '++':
          rhsValue += 1;
          this.updateSymbol(rhs, rhsValue);
          return argument;
        case '--':
          rhsValue -= 1;
          this.updateSymbol(rhs, rhsValue);
          return argument;
        case '!':
          rhsValue = !rhsValue;
          this.updateSymbol(rhs, rhsValue);
          return argument;
      }
    }
  }

  visitVariableStatement(node) {
    const { declarations } = node;
    for (const declaration of declarations) {
      this.visit(declaration);
    }
  }

  visitVariableDeclaration(node) {
    const { id, init } = node;
    const name = this.visit(id);
    let value = this.visit(init);
    if (init.type === 'Identifier') { // 处理变量拷贝
      value = this.getSymbol(value).value; // 从最近的
    }
    // const value = this.getRightValue(this.visit(init));
    this.setSymbol(name, value);
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
    let leftValue = this.visit(left);
    let rightValue = this.visit(right);
    if (left.type === 'Identifier') {
      leftValue = this.getSymbol(leftValue).value;
    }
    if (right.type === 'Identifier') {
      rightValue = this.getSymbol(rightValue).value;
    }
    switch (operator) {
      case '+':
        return leftValue + rightValue;
      case '-':
        return leftValue - rightValue;
      case '*':
        return leftValue * rightValue;
      case '/':
        return leftValue / rightValue;
      case '>':
        return leftValue > rightValue;
      case '<':
        return leftValue < rightValue;
      case '>=':
        return leftValue >= rightValue;
      case '<=':
        return leftValue <= rightValue;
      case '==':
        return leftValue == rightValue;
      case '!=':
        return leftValue != rightValue;
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

  /**
   * store function declaration in scope
   *
   * @param {Node} node
   */
  visitFunctionDeclaration(node) {
    const { id, params, body } = node;
    const name = this.visit(id);
    this.setSymbol(name, new Function(params, body));
  }

  /**
   * visitReturnStatement
   * @param {Node} node
   */
  visitReturnStatement(node) {
    const { argument } = node;
    return this.visit(argument);
  }

  /**
   * get stored symbol in scope
   * @param {string} name // the name of symbol stored in scope
   */
  getSymbol(name) {
    return this.scope.lookup(name);
  }
  /**
   * assignment expression
   *
   * @param {*} left
   * @param {*} operator
   * @param {*} right
   */
  updateSymbolWithOperator(left, operator, right) {
    let lhs = this.visit(left);
    let rhs = this.visit(right);
    if (right.type === 'Identifier') {
      rhs = this.getSymbol(rhs).value;
    }
    const lhsValue = this.getSymbol(lhs).value;
    let rhsValue = lhsValue;
    switch (operator) {
      case "=":
        rhsValue = rhs;
        break;
      case "+=":
        rhsValue += rhs;
        break;
      case "-=":
        rhsValue -= rhs;
        break;
      case "*=":
        rhsValue *= rhs;
        break;
      case "/=":
        rhsValue /= rhs;
        break;
    }
    this.updateSymbol(lhs, rhsValue);
  }

  /**
   * store a named symbol into scope
   * @param {string} name
   * @param {string | number | null | boolean | Function} value
   */
  setSymbol(name, value) {
    this.scope.insert(new Symbol(name, value));
  }

  updateSymbol(name, value) {
    this.scope.update(new Symbol(name, value));
  }
}

module.exports = {
  Interpreter,
}
