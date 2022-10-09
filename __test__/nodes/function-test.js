module.exports = test => {
  test(`return 3+2;`, {
    type: 'Program',
    body: [
      {
        type: 'ReturnStatement',
        argument: {
          type: 'BinaryExpression',
          left: { type: 'NumericLiteral', value: 3 },
          operator: '+',
          right: { type: 'NumericLiteral', value: 2 },
        }
      }
    ]
  });

  test(`return x, y;`, {
    type: 'Program',
    body: [
      {
        type: 'ReturnStatement',
        argument: {
          type: 'SequenceExpression',
          expressions: [{
            type: 'Identifier',
            name: 'x',
          }, {
            type: 'Identifier',
            name: 'y',
          }],
        }
      }
    ],
  });

  test(`
    function square(x) {
      return x * x;
    }
  `, {
    type: 'Program',
    body: [
      {
        type: 'FunctionDeclaration',
        id: {
          type: 'Identifier',
          name: 'square',
        },
        params: [
          {
            type: 'Identifier',
            name: 'x',
          }
        ],
        body: {
          type: 'BlockStatement',
          body: [
            {
              type: 'ReturnStatement',
              argument: {
                type: 'BinaryExpression',
                operator: '*',
                left: {
                  type: 'Identifier',
                  name: 'x',
                },
                right: {
                  type: 'Identifier',
                  name: 'x',
                },
              },
            }
          ],
        }
      }
    ],
  });

  test(`
    function square() {
    }
  `, {
    type: 'Program',
    body: [
      {
        type: 'FunctionDeclaration',
        id: {
          type: 'Identifier',
          name: 'square',
        },
        params: [],
        body: {
          type: 'BlockStatement',
          body: [],
        }
      }
    ]
  });

  test(`
    function square() {
      return;
    }
  `, {
    type: 'Program',
    body: [
      {
        type: 'FunctionDeclaration',
        id: {
          type: 'Identifier',
          name: 'square',
        },
        params: [],
        body: {
          type: 'BlockStatement',
          body: [
            {
              type: 'ReturnStatement',
              argument: null,
            }
          ],
        }
      }
    ]
  })
};
