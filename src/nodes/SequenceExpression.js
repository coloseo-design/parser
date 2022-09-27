const { Node } = require('./Node');

/**
 * SequenceExpression
 *  expressions: AssignmentExpression[]
 *  ;
 */
class SequenceExpression extends Node {
  type = 'SequenceExpression';
  constructor(expressions) {
    super();
    this.expressions = expressions
  }
}

exports.SequenceExpression = SequenceExpression;
