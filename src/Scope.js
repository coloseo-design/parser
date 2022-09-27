/**
 * 变量作用域
 * name 作用域名称
 * level 作用域级别
 */
class Scope {
  name = 'Global';
  level = 1;
  _symbols = {};

  constructor(name, level, parent = null) {
    this.name = name;
    this.level = level;
    this.parent = parent;
  }

  // 增加内置变量
  _buildin_() {
    // this.inert('print', undefined);
  }

  // 作用域中添加变量
  inert(symbol) {
    const { name, value } = symbol;
    this._symbols[name] = value;
  }

  // 查找变量
  lookup(name) {
    // 先从当前作用域查找
    if (this._symbols[name]) {
      return this._symbols[name];
    }
    if (this.parentScope) {
      return this.parentScope.lookup(name);
    }
    throw new ReferenceError(`variable "name" not defined`);
  }
}

exports.Scope = Scope;
