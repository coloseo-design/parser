const { Node } = require('./Node');
/**
 * 一元操作符
 * example
 *  : ++x, --x, !!x
 * UnaryExpression
 *  operator: ADDITIVE_OPERATOR | MULTIPLICATIVE_OPERATOR | LOGICAL_NOT
 *  argument: MemberExpression
 */
class UnaryExpression extends Node {
  type = 'UnaryExpression';
  constructor(operator, argument) {
    super();
    this.operator = operator;
    this.argument = argument;
  }
}

module.exports = {
  UnaryExpression
}
