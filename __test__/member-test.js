module.exports = test => {
  test(`x.y;`, {
    type: 'Program',
    body: [
      {
        type: 'ExpressionStatement',
        expression: {
          type: 'MemberExpression',
          compute: false,
          object: {
            type: 'Identifier',
            name: 'x',
          },
          property: {
            type: 'Identifier',
            name: 'y',
          },
        },
      }
    ],
  });
  test(`x.y[z];`, {
    type: 'Program',
    body: [
      {
        type: 'ExpressionStatement',
        expression: {
          type: 'MemberExpression',
          object: {
            type: 'MemberExpression',
            compute: false,
            object: {
              type: 'Identifier',
              name: 'x',
            },
            property: {
              type: 'Identifier',
              name: 'y'
            }
          },
          compute: false,
          property: {
            type: 'Identifier',
            name: 'z'
          }
        },
      }
    ],
  });

  test(`x.y = 12;`, {
    type: 'Program',
    body: [
      {
        type: 'ExpressionStatement',
        expression: {
          type: 'AssignmentExpression',
          operator: '=',
          left: {
            type: 'MemberExpression',
            compute: false,
            object: {
              type: 'Identifier',
              name: 'x',
            },
            property: {
              type: 'Identifier',
              name: 'y',
            },
          },
          right: {
            type: 'NumericLiteral',
            value: 12,
          },
        },
      }
    ],
  });


  test(`x[y] = 12;`, {
    type: 'Program',
    body: [
      {
        type: 'ExpressionStatement',
        expression: {
          type: 'AssignmentExpression',
          operator: '=',
          left: {
            type: 'MemberExpression',
            compute: false,
            object: {
              type: 'Identifier',
              name: 'x',
            },
            property: {
              type: 'Identifier',
              name: 'y',
            },
          },
          right: {
            type: 'NumericLiteral',
            value: 12,
          },
        },
      }
    ],
  });

  test(`x['y'] = 12;`, {
    type: 'Program',
    body: [
      {
        type: 'ExpressionStatement',
        expression: {
          type: 'AssignmentExpression',
          operator: '=',
          left: {
            type: 'MemberExpression',
            compute: false,
            object: {
              type: 'Identifier',
              name: 'x',
            },
            property: {
              type: 'StringLiteral',
              value: 'y',
            },
          },
          right: {
            type: 'NumericLiteral',
            value: 12,
          },
        },
      }
    ],
  });
};
