const { Node } = require('./Node');

class BinaryExpression extends Node {
  type = 'BinaryExpression';

  constructor(operator, left, right) {
    super();
    this.operator = operator;
    this.left = left;
    this.right = right;
  }
}

module.exports = {
  BinaryExpression
}
