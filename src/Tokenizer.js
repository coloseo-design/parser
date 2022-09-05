const { baseTypeStrictlyMatches } = require("@babel/traverse/lib/path/inference");

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
   * Obtain next token
   */
  getNextToken() {
    if (!this.hasMoreTokens()) {
      return null
    }
    const string = this._string.slice(this._cursor);
    // number
    console.log('string', string, Number.isNaN(Number(string[0])));
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
