const { Node } = require('./Node');

/**
 * DoWhileStatement
 *  test: Expression
 *  body: Statement
 */

class DoWhileStatement extends Node {
  type = 'DoWhileStatement';
  constructor(test, body) {
    super();
    this.body = body;
    this.test = test;
  }
}

exports.DoWhileStatement = DoWhileStatement;
