const { Node } = require('./Node');

/**
 * BlockStatement
 *  body: Statement
 *  ;
 */
class BlockStatement extends Node {
  type = 'BlockStatement';
  constructor(body) {
    super();
    this.body = body;
  }
}

exports.BlockStatement = BlockStatement;
