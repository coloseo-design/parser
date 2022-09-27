const { Node } = require('./Node');

/**
 * IfStatement
 *  test: Expression
 *  consequent: Statement
 *  alternate?: Statement
 */
class IfStatement extends Node{
  type = 'IfStatement';
  constructor(test, consequent, alternate = null) {
    super();
    this.test = test;
    this.consequent = consequent;
    this.alternate = alternate;
  }
}

exports.IfStatement = IfStatement;
