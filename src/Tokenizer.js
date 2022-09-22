
const Spec = [
  /** 匹配多行注释 */
  [/^\/\*[\s\S]*?\*\//, null],
  /** 匹配单行注释 // */
  [/^\/\/.*/, null],
  /* 匹配空格，如果空格开头，则忽略  */
  [/^\s+/,  null],
  /* 匹配数字 */
  [/^\d+/, "NUMBER"],
  /* 匹配双引号字符串  */
  [/^"[^"]*"/, "STRING"],
  /** 匹配单引号字符串  */
  [/^'[^']*'/, "STRING"],

  /***** 符号处理 ****/

  /** 分号 */
  [/^;/, ";"],

  /** block大括号 */
  [/^\{/, '{'],
  [/^\}/, '}'],

  /** 括号优先级 */
  [/^\(/, '('],
  [/^\)/, ')'],
  [/^,/, ','],

  /** 定义关键字： 关键字的匹配优先级高于IDENTIFIER，必须放在IDENTIFIER前 */
  [/^\blet\b/, 'let'], // \b关键字\b,让独立的关键字被识别
  [/^\bdo\b/, 'do'], // do-while循环申明
  [/^\bwhile\b/, 'while'], // while循环申明
  [/^\bfor\b/, 'for'], // while循环申明

  /** if-else  */
  [/^\bif\b/, 'if'],
  [/^\belse\b/, 'else'],

  /** 布尔值 */
  [/^\btrue\b/, 'true'],
  [/^\bfalse\b/, 'false'],

  /** 变量名称 */
  [/^\w+/, 'IDENTIFIER'], // 与Number语句重合，必须放在NUMBE之后

  /** 等值计算 必须放在赋值语句上面: ==, != */
  [/^[=!]=/, 'EQUALITY_OPERATOR'],

  /** 赋值语句 =, +=, -=, *=, /= */
  [/^=/, 'ASSIGNMENT'],
  [/^[\+\-\*\/]=/, 'COMPLEX_ASSIGNMENT'],

  /** 关系运算符 >, <, >=, <= */
  [/^[><]=?/, 'RELATIONAL_OPERATOR'],

  /** 逻辑运算符 */
  [/^&&/, 'LOGICAL_AND'], // and
  [/^\|\|/, 'LOGICAL_OR'], // or
  [/^!/, 'LOGICAL_NOT'], // not

  /** 二元操作符号 必须在赋值之后 */
  [/^[+\-]/, 'ADDITIVE_OPERATOR'], // +-
  [/^[*\/]/, 'MULTIPLICATIVE_OPERATOR'], // */
];

/**
 * Tokenizer class.
 * Lazily pull a token from a stream
 */
class Tokenizer {
  /**
   * Initializes the string
   */
  init(string) {
    this._string = string;
    this._cursor = 0;
  }
  // 是否读取到文件末尾
  isEOF() {
    return this._cursor === this._string.length;
  }

  hasMoreTokens() {
    return this._cursor < this._string.length;
  }

  /**
   * 利用正则表达式去分词
   */
  getNextToken() {
    if (!this.hasMoreTokens()) {
      return null
    }

    const string = this._string.slice(this._cursor);
    for (const [regexp, tokenType] of Spec) {
      const tokenValue = this._match(regexp, string);
      if (!tokenValue) {
        continue;
      }
      /**
       * 如果是空格 跳过
       * 注意顺序，必须匹配一次，让游标移动
       */
      if (!tokenType) {
        return this.getNextToken();
      }
      return {
        type: tokenType,
        value: tokenValue,
      };
    }
    throw new SyntaxError(`Unexpected token: "${string[0]}"`);
  }

  _match(regexp, string) {
    const matched = regexp.exec(string);
    if (matched) {
      this._cursor += matched[0].length;
      return matched[0];
    }
    return null;
  }


  /**
   * Obtain next token
   */
  _getNextToken() {
    if (!this.hasMoreTokens()) {
      return null
    }
    const string = this._string.slice(this._cursor); // abc123
    /**
     *                   / number \
     * 有限状态机: 原始输入             end
     *                   \ string /
     */
    // number
    if (!Number.isNaN(Number(string[0]))) {
      let number = '';
      while (!Number.isNaN(Number(string[this._cursor]))) {
        number += string[this._cursor++];
      }
      return {
        type: 'NUMBER',
        value: number,
      }
    }
    // string
    if (string[0] === '"') {
      let s = ""
      this._cursor ++;
      do {
        s += string[this._cursor++];
      } while(string[this._cursor] !== '"' && !this.isEOF())
      return {
        type: "STRING",
        value: s,
      }
    }
  }
}

module.exports = {
  Tokenizer,
}
