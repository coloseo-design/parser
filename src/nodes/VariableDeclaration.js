const { Node } = require('./Node');
/**
 * 变量申明
 *
 * VariableDeclaration
 *  id:Identifier
 *  init:AssignmentExpression
 */
class VariableDeclaration extends Node {
  type = 'VariableDeclaration';
  constructor(id, init = null) {
    super();
    this.id = id;
    this.init = init;
  }
}

exports.VariableDeclaration = VariableDeclaration;
