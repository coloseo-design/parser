module.exports = test => {
  test(`3 + 2;`, {
    type: 'Program',
    body: [
      {
        type: 'ExpressionStatement',
        expression: {
          type: 'BinaryExpression',
          operator: '+',
          left: {
            type: 'NumericLiteral',
            value: 3,
          },
          right: {
            type: 'NumericLiteral',
            value: 2,
          },
        }
      }
    ],
  });
  test(`3 + 2 + 5;`, {
    type: 'Program',
    body: [
      {
        type: 'ExpressionStatement',
        expression: {
          type: 'BinaryExpression',
          operator: '+',
          left: {
            type: 'BinaryExpression',
            operator: '+',
            left: {
              type: 'NumericLiteral',
              value: 3,
            },
            right: {
              type: 'NumericLiteral',
              value: 2,
            },
          },
          right: {
            type: 'NumericLiteral',
            value: 5,
          },
        }
      }
    ],
  });

  test(`2 + 3 * 4;`, {
    type: 'Program',
    body: [
      {
        type: 'ExpressionStatement',
        expression: {
          type: 'BinaryExpression',
          operator: '+',
          left: {
            type: 'NumericLiteral',
            value: 2,
          },
          right: {
            type: 'BinaryExpression',
            left: {
              type: 'NumericLiteral',
              value: 3,
            },
            operator: '*',
            right: {
              type: 'NumericLiteral',
              value: 4,
            },
          },
        }
      }
    ]
  });

  test(`2 * 3 * 4;`, {
    type: 'Program',
    body: [
      {
        type: 'ExpressionStatement',
        expression: {
          type: 'BinaryExpression',
          operator: '*',

          left: {
            type: 'BinaryExpression',
            left: {
              type: 'NumericLiteral',
              value: 2,
            },
            operator: '*',
            right: {
              type: 'NumericLiteral',
              value: 3,
            },
          },
          right: {
            type: 'NumericLiteral',
            value: 4,
          },
        }
      }
    ]
  });

  test(`(2 + 3) * 4;`, {
    type: 'Program',
    body: [
      {
        type: 'ExpressionStatement',
        expression: {
          type: 'BinaryExpression',
          operator: '*',
          left: {
            type: 'BinaryExpression',
            operator: '+',
            left: {
              type: 'NumericLiteral',
              value: 2,
            },
            right: {
              type: 'NumericLiteral',
              value: 3,
            },
          },
          right: {
            type: 'NumericLiteral',
            value: 4,
          },
        }
      }
    ]
  });

  test(`(2 + 3);`, {
    type: 'Program',
    body: [
      {
        type: 'ExpressionStatement',
        expression: {
          type: 'BinaryExpression',
          operator: '+',
          left: {
            type: 'NumericLiteral',
            value: 2,
          },
          right: {
            type: 'NumericLiteral',
            value: 3,
          }
        },
      }
    ],
  });

  test(`(2);`, {
    type: 'Program',
    body: [
      {
        type: 'ExpressionStatement',
        expression: {
          type: 'NumericLiteral',
          value: 2,
        },
      }
    ],
  });
};
