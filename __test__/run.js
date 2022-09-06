
const assert = require('assert');
const { Parser } = require('../src/Parser');
const tests = [require('./literals-test')];

const parser = new Parser();

function test(program, expected) {
  const ast = parser.parse(program);
  assert.deepEqual(expected, ast);
}


tests.forEach(testRun => testRun(test));
console.log('All assertions passed.');

function exec() {
  const program = `
  /**
   * 文档注释：
   */
  "12"
  12
  `;
  const ast = parser.parse(program);
  console.log(JSON.stringify(ast, null, 2));
}

exec();


