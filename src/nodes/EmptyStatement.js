const { Node } = require('./Node');

class EmptyStatement extends Node {
  type = 'EmptyStatement';
}

exports.EmptyStatement = EmptyStatement;
