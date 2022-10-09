class Function {
  constructor(parameters, body) {
    this.parameters = parameters;
    this.body = body;
  }
}

/**
 * builtin function without parameters
 */
class BuiltinFunction extends Function {
  type = '__builtin__';
  constructor(body) {
    super([], body);
  }
}

exports.Function = Function;
exports.BuiltinFunction = BuiltinFunction;
