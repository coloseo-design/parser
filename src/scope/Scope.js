const assert = require('assert');
const { Symbol } = require('./Symbol');
const { BuiltinFunction } = require("./Function");

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

  /**
   * _builtin_
   * load builtin function and variables
   */
  _builtin_() {
    this.insert(new Symbol('print', new BuiltinFunction(console.log)));
    this.insert(new Symbol('deepEqual', new BuiltinFunction(assert.deepEqual)));
  }


  /**
   * add symbol into runtime scope
   * @param {*} symbol
   */
  insert(symbol) {
    const { name } = symbol;
    this._symbols[name] = symbol;
  }

  /**
   * update stored variable symbol and function symbol
   *
   * @param {*} symbol
   */
  update(symbol) {
    const { name, value } = symbol;
    const found = this.lookup(name);
    Object.assign(found, {
      value,
    })
  }

  // 查找变量
  lookup(name) {
    // 先从当前作用域查找
    if (this._symbols[name]) {
      return this._symbols[name];
    }
    if (this.parent) {
      return this.parent.lookup(name);
    }
    throw new ReferenceError(`Can't find variable "${name}"`);
  }
}

exports.Scope = Scope;
