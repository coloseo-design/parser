const { Node } = require('./Node');
/**
 * WhileStatement
 *  test Expression
 *  body Statement
 * ;
 */
class WhileStatement extends Node {
  type = 'WhileStatement';
  constructor(test, body) {
    super();
    this.test = test;
    this.body = body;
  }
}

exports.WhileStatement = WhileStatement;
