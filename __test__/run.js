
const assert = require('assert');
const { Parser } = require('../src/Parser');
const tests = [
  require('./literals-test'),
  require('./statement-list-test'),
];

const parser = new Parser();

function test(program, expected) {
  const ast = parser.parse(program);
  assert.deepEqual(expected, ast);
}


tests.forEach(testRun => testRun(test));
console.log('All assertions passed.');

function exec() {
  const program = `
  // hello
  "hello";
  // number
  12;
  `;
  const ast = parser.parse(program);
  console.log(JSON.stringify(ast, null, 2));
}

// exec();


