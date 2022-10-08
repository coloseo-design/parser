
/**
 * 创建作用于变量标记符号
 *  name 变量名称
 *  value 变量的值
 */
class Symbol {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }

  type() {
    return this.__type__;
  }
}

class StringSymbol extends Symbol {
  __type__ = 'String';
  constructor(name, value) {
    super(name, value);
  }
}

class NumberSymbol extends Symbol {
  __type__ = 'Number';
  constructor(name, value) {
    super(name, value);
  }
}

class NullSymbol extends Symbol {
  __type__ = 'Null';
  constructor(name, value) {
    super(name, value);
  }
}

class BooleanSymbol extends Symbol {
  __type__ = 'Boolean';
  constructor(name, value) {
    super(name, value);
  }
}

class FunctionSymbol extends Symbol {
  __type__ = 'Function';
  constructor(name, value) {
    // TODD: 需要特殊处理
    super(name, value);
  }
}



Object.assign(exports, {
  Symbol,
  NumberSymbol,
  StringSymbol,
  NullSymbol,
  BooleanSymbol,
});

// exports.Symbol = Symbol;
