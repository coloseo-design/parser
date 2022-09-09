
const assert = require('assert');
const { Parser } = require('../src/Parser');
const tests = [
  require('./literals-test'),
  require('./statement-list-test'),
  require('./block-test'),
  require('./empty-statement-test'),
  require('./math-test'),
  require('./assigment-test'),
];

const parser = new Parser();

function test(program, expected) {
  const ast = parser.parse(program);
  assert.deepEqual(expected, ast);
}

tests.forEach(testRun => testRun(test));
console.log('All assertions passed.');


