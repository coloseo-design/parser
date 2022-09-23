
const assert = require('assert');
const { Parser } = require('../src/Parser');
const tests = [
  require('./literals-test'),
  require('./statement-list-test'),
  require('./block-test'),
  require('./empty-statement-test'),
  require('./math-test'),
  require('./assignment-test'),
  require('./variable-test'),
  require('./if-test'),
  require('./relational-test'),
  require('./equality-test'),
  require('./logical-test'),
  require('./unary-test'),
  require('./while-test'),
  require('./for-test'),
  require('./function-test'),
  require('./member-test'),
];

const parser = new Parser();

function test(program, expected) {
  const ast = parser.parse(program);
  assert.deepEqual(expected, ast);
}

tests.forEach(testRun => testRun(test));
console.log('All assertions passed.');


