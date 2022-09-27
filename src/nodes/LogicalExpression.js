const { Node } = require('./Node');

/**
 * LogicalExpression
 *  example: a > b; a >= b; a < b; a <= b; a == b;
 * LogicalExpression
 *  operator: >, >=, <, <=, ==,
 *  left: BinaryExpression
 *  right: BinaryExpression
 */
class LogicalExpression extends Node {
  type = 'LogicalExpression';

  constructor(operator, left, right) {
    super();
    this.operator = operator;
    this.left = left;
    this.right = right;
  }
}

module.exports = {
  LogicalExpression,
};
