const { Node } = require('./Node');

class AssignmentExpression extends Node {
  type = 'AssignmentExpression';
  constructor(operator, left, right) {
    super();
    this.operator = operator
    this.left = left;
    this.right = right;
  }
}

module.exports = {
  AssignmentExpression,
}
