module.exports = test => {
  test(`x > 0 && y < 1;`, {
    type: 'Program',
    body: [
      {
        type: 'ExpressionStatement',
        expression: {
          operator: '&&',
          type: 'LogicalExpression',
          left: {
            type: 'BinaryExpression',
            operator: '>',
            left: {
              type: 'Identifier',
              name: 'x',
            },
            right: {
              type: 'NumericLiteral',
              value: 0,
            }
          },
          right: {
            type: 'BinaryExpression',
            operator: '<',
            left: {
              type: 'Identifier',
              name: 'y',
            },
            right: {
              type: 'NumericLiteral',
              value: 1,
            }
          },
        },
      }
    ],
  });

  test(`x > 0 || y < 1;`, {
    type: 'Program',
    body: [
      {
        type: 'ExpressionStatement',
        expression: {
          operator: '||',
          type: 'LogicalExpression',
          left: {
            type: 'BinaryExpression',
            operator: '>',
            left: {
              type: 'Identifier',
              name: 'x',
            },
            right: {
              type: 'NumericLiteral',
              value: 0,
            }
          },
          right: {
            type: 'BinaryExpression',
            operator: '<',
            left: {
              type: 'Identifier',
              name: 'y',
            },
            right: {
              type: 'NumericLiteral',
              value: 1,
            }
          },
        },
      }
    ],
  });

  test(`x > 0 && x < 5 || y < 1;`, {
    type: 'Program',
    body: [
      {
        type: 'ExpressionStatement',
        expression: {
          type: 'LogicalExpression',
          operator: '||',
          left: {
            type: 'LogicalExpression',
            operator: '&&',
            left: {
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
            right: {
              type: 'BinaryExpression',
              operator: '<',
              left: {
                type: 'Identifier',
                name: 'x',
              },
              right: {
                type: 'NumericLiteral',
                value: 5,
              },
            }
          },
          right: {
            type: 'BinaryExpression',
            operator: '<',
            left: {
              type: 'Identifier',
              name: 'y',
            },
            right: {
              type: 'NumericLiteral',
              value: 1,
            },
          },
        },
      },
    ]
  });

  test(`x > 0 && x < 5 && y < 1;`, {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'LogicalExpression',
            operator: '&&',
            left: {
              type: 'LogicalExpression',
              operator: '&&',
              left: {
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
              right: {
                type: 'BinaryExpression',
                operator: '<',
                left: {
                  type: 'Identifier',
                  name: 'x',
                },
                right: {
                  type: 'NumericLiteral',
                  value: 5,
                },
              }
            },
            right: {
              type: 'BinaryExpression',
              operator: '<',
              left: {
                type: 'Identifier',
                name: 'y',
              },
              right: {
                type: 'NumericLiteral',
                value: 1,
              },
            },
          },
        },
      ]
  });

  test(`x > 0 || x < 5 || y < 1;`, {
    type: 'Program',
    body: [
      {
        type: 'ExpressionStatement',
        expression: {
          type: 'LogicalExpression',
          operator: '||',
          left: {
            type: 'LogicalExpression',
            operator: '||',
            left: {
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
            right: {
              type: 'BinaryExpression',
              operator: '<',
              left: {
                type: 'Identifier',
                name: 'x',
              },
              right: {
                type: 'NumericLiteral',
                value: 5,
              },
            }
          },
          right: {
            type: 'BinaryExpression',
            operator: '<',
            left: {
              type: 'Identifier',
              name: 'y',
            },
            right: {
              type: 'NumericLiteral',
              value: 1,
            },
          },
        },
      },
    ]
});
};
