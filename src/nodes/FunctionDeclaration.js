const { Node } = require('./Node');

/**
 * FunctionDeclaration
 *  body: BlockStatement
 *  id: Identifier
 *  params: Identifier[]
 */
class FunctionDeclaration extends Node  {
  type = 'FunctionDeclaration';
  constructor(id, params, body) {
    super();
    this.id = id;
    this.params = params;
    this.body = body;
  }
}

exports.FunctionDeclaration = FunctionDeclaration;
