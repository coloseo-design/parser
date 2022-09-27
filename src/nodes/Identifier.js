const { Node } = require('./Node');

class Identifier extends Node {
  type = 'Identifier';
  constructor(name) {
    super();
    this.name = name;
  }
}

module.exports = {
  Identifier,
};
