
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
      console.log('tokenType', tokenType, {
        type: tokenType,
        value: tokenValue,
      }, tokenValue);
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
     *                   / numbner \
     * 有限状态机: 原始输入             end
     *                   \ string  /
     */
    // number
    if (!Number.isNaN(Number(string[0]))) {
      let number = '';
      while (!Number.isNaN(Number(string[this._cursor]))) {
        console.log("cursour", this._cursor, string);
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
