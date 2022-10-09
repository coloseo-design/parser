module.exports = test => {
  test(
    `
      // hello
      "hello";
      // number
      12;
    `,
    {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: { type: 'StringLiteral', value: 'hello' }
        },
        {
          type: 'ExpressionStatement',
          expression: { type: 'NumericLiteral', value: 12 }
        }
      ]
    }
  );
};
