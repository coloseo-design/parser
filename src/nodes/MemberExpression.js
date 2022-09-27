const { Node } = require('./Node');

/**
 * 成员操作
 * example
 *  : a.b; a.b[c];
 *  ;
 *
 * MemberExpression
 *  object: Literal | Identifier | '(' Expression ')' | null
 *  property: Identifier | Expression
 *  compute: boolean
 *  ;
 */
class MemberExpression extends Node{
  type = 'MemberExpression';

  constructor(object, property = null, compute = false ) {
    super();
    this.object = object;
    this.property = property;
    this.compute = compute;
  }
}

module.exports = {
  MemberExpression,
}
