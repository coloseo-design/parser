const { Node } = require('./Node');

/**
 * 函数调用
 * example
 *  : test(a, b); a.b(x, y);
 */
class CallExpression extends Node {
  type = 'CallExpression';
  constructor(callee, argumentList) {
    super();
    this.callee = callee;
    this.arguments = argumentList;
  }
}

module.exports = { CallExpression };
