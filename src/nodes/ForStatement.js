const { Node } = require('./Node');

class ForStatement extends Node {
  type = 'ForStatement';
  constructor(init, test, update, body) {
    super();
    this.init = init;
    this.test = test;
    this.update = update;
    this.body = body;
  }
}

exports.ForStatement = ForStatement;
