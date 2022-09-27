const { Node } = require('./Node');

/**
 * ReturnStatement
 *  argument: Expression
 *  ;
 */
class ReturnStatement extends Node {
  type = 'ReturnStatement';
  constructor(argument = null) {
    super();
    this.argument = argument;
  }
}

exports.ReturnStatement = ReturnStatement;
