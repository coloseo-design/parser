const path = require('path');
const { Interpreter } = require('../src/Interpreter');
const fs = require('fs');

// 代码执行测试
const tests = [
  path.resolve(__dirname, './visitors/variable.gjs'),
];

const interpreter = new Interpreter();
tests.forEach(url => {
  const code = fs.readFileSync(url);
  interpreter.interpret(code);
});

