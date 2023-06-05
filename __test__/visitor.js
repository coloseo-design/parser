const path = require('path');
const { Interpreter } = require('../src/Interpreter');
const fs = require('fs');

// 代码执行测试
const tests = [
  path.resolve(__dirname, './visitors/assign.gjs'),
  path.resolve(__dirname, './visitors/block.gjs'),
  path.resolve(__dirname, './visitors/call.gjs'),
  path.resolve(__dirname, './visitors/do-while.gjs'),
  path.resolve(__dirname, './visitors/equality.gjs'),
  path.resolve(__dirname, './visitors/for.gjs'),
  path.resolve(__dirname, './visitors/function.gjs'),
  path.resolve(__dirname, './visitors/if.gjs'),
  path.resolve(__dirname, './visitors/unary.gjs'),
  path.resolve(__dirname, './visitors/variable.gjs'),
  path.resolve(__dirname, './visitors/while.gjs'),
];

const interpreter = new Interpreter();
tests.forEach(url => {
  const code = fs.readFileSync(url, {
    encoding: 'utf-8',
  });
  interpreter.interpret(code);
});

