const { Node } = require('./Node');

class Literal extends Node {
  constructor(type, value) {
    super();
    this.type = `${type}Literal`;
    this.value = value;
  }
}

module.exports = {
  Literal,
}
