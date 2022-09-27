
const assert = require('assert');
const { Interpreter } = require('../src/Interpreter');
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
  require('./call-test'),
];

// ast测试
const parser = new Parser();
function test(program, expected) {
  const ast = parser.parse(program);
  assert.deepEqual(expected, ast);
}

tests.forEach(testRun => testRun(test));

// 代码执行测试
const interpreter = new Interpreter();

console.log(interpreter.interpret(`
  let a = 3 + 2;
  {
    a = 3;
    print("inner a", a);
  }
  print('out a', a);
`));

console.log('All assertions passed.');


