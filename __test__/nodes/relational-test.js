module.exports = (test) => {
  test('x > 0;', {
    type: 'Program',
    body: [
      {
        type: 'ExpressionStatement',
        expression: {
          type: 'BinaryExpression',
          operator: '>',
          left: {
            type: 'Identifier',
            name: 'x',
          },
          right: {
            type: 'NumericLiteral',
            value: 0,
          },
        },
      },
    ],
  });

  test('x < 0;', {
    type: 'Program',
    body: [
      {
        type: 'ExpressionStatement',
        expression: {
          type: 'BinaryExpression',
          operator: '<',
          left: {
            type: 'Identifier',
            name: 'x',
          },
          right: {
            type: 'NumericLiteral',
            value: 0,
          },
        },
      },
    ],
  });

  test('x >= 0;', {
    type: 'Program',
    body: [
      {
        type: 'ExpressionStatement',
        expression: {
          type: 'BinaryExpression',
          operator: '>=',
          left: {
            type: 'Identifier',
            name: 'x',
          },
          right: {
            type: 'NumericLiteral',
            value: 0,
          },
        },
      },
    ],
  });

  test('x <= 0;', {
    type: 'Program',
    body: [
      {
        type: 'ExpressionStatement',
        expression: {
          type: 'BinaryExpression',
          operator: '<=',
          left: {
            type: 'Identifier',
            name: 'x',
          },
          right: {
            type: 'NumericLiteral',
            value: 0,
          },
        },
      },
    ],
  });

  test('y = x + 10 <= 0;', {
    type: 'Program',
    body: [
      {
        type: 'ExpressionStatement',
        expression: {
          type: 'AssignmentExpression',
          operator: '=',
          left: {
            type: 'Identifier',
            name: 'y',
          },
          right: {
            type: 'BinaryExpression',
            operator: '<=',
            left: {
              type: 'BinaryExpression',
              operator: '+',
              left: {
                type: 'Identifier',
                name: 'x',
              },
              right: {
                type: 'NumericLiteral',
                value: 10,
              },
            },
            right: {
              type: 'NumericLiteral',
              value: 0,
            }
          },
        },
      },
    ],
  });

  test(`x == 12;`, {
    type: 'Program',
    body: [
      {
        type: 'ExpressionStatement',
        expression: {
          type: 'BinaryExpression',
          operator: '==',
          left: {
            type: 'Identifier',
            name: 'x',
          },
          right: {
            type: 'NumericLiteral',
            value: 12,
          },
        },
      },
    ],
  });

  test(`x + 3 == 12;`, {
    type: 'Program',
    body: [
      {
        type: 'ExpressionStatement',
        expression: {
          type: 'BinaryExpression',
          operator: '==',
          left: {
            type: 'BinaryExpression',
            left: {
              type: 'Identifier',
              name: 'x',
            },
            operator: '+',
            right: {
              type: 'NumericLiteral',
              value: 3,
            }
          },
          right: {
            type: 'NumericLiteral',
            value: 12,
          },
        },
      },
    ],
  });
};
