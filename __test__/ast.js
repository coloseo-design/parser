const assert = require('assert');
const { Parser } = require('../src/Parser');

const astTests = [
  require('./nodes/literals-test'),
  require('./nodes/statement-list-test'),
  require('./nodes/block-test'),
  require('./nodes/empty-statement-test'),
  require('./nodes/math-test'),
  require('./nodes/assignment-test'),
  require('./nodes/variable-test'),
  require('./nodes/if-test'),
  require('./nodes/relational-test'),
  require('./nodes/equality-test'),
  require('./nodes/logical-test'),
  require('./nodes/unary-test'),
  require('./nodes/while-test'),
  require('./nodes/for-test'),
  require('./nodes/function-test'),
  require('./nodes/member-test'),
  require('./nodes/call-test'),
];

// ast测试
const parser = new Parser();
function test(program, expected) {
  const ast = parser.parse(program);
  assert.deepEqual(expected, ast);
}

astTests.forEach(testRun => testRun(test));
console.log('All ast assertions passed.');
