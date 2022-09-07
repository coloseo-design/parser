module.exports = test => {
  test(`
  ;
  123;
  "hello";
  `, {
    type: 'Program',
    body: [
      {
        type: 'EmptyStatement',
      },
      {
        type: 'ExpressionStatement',
        expression: {
          type: 'NumericLiteral',
          value: 123,
        }
      },
      {
        type: 'ExpressionStatement',
        expression: {
          type: 'StringLiteral',
          value: 'hello',
        }
      }
    ],
  });
};
