const { Node } = require('./Node');
/**
 * 变量申明
 *
 * VariableStatement
 *  declarations: VariableDeclaration[]
 */
class VariableStatement extends Node {
  type = 'VariableStatement';
  constructor(declarations) {
    super();
    this.declarations = declarations;
  }
}

exports.VariableStatement = VariableStatement;
