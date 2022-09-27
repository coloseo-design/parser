
const { Node } = require('./Node');

/**
 * Program
 *  body: Statement[]
 *  ;
 */
class Program extends Node {
  type = 'Program';
  constructor(body = null) {
    super();
    this.body = body;
  }
}

exports.Program = Program;
