const { Node } = require('./Node');

/**
 * ExpressionStatement
 *  expression: AssignmentExpression
 *  ;
 */
class ExpressionStatement extends Node {
  type = 'ExpressionStatement';
  constructor(expression) {
    super();
    this.expression = expression;
  }
}

exports.ExpressionStatement = ExpressionStatement;
