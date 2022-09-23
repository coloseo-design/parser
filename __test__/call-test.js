module.exports = test => {
  test(`
    test();
  `, {
    type: 'Program',
    body: [{
      type: 'ExpressionStatement',
      expression: {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: 'test',
        },
        arguments: [],
      },
    },
  ],
  })

  test(`
    a.b(x, y);
  `, {
    type: 'Program',
    body: [{
      type: 'ExpressionStatement',
      expression: {
        type: 'CallExpression',
        callee: {
          type: 'MemberExpression',
          compute: false,
          object: {
            type: 'Identifier',
            name: 'a'
          },
          property: {
            type: 'Identifier',
            name: 'b'
          },
        },
        arguments: [
          {
            type: 'Identifier',
            name: 'x'
          },
          {
            type: 'Identifier',
            name: 'y'
          }
        ],
      },
    },
  ],
  })
  test(`
    a.b(x)(y);
  `, {
    type: 'Program',
    body: [{
      type: 'ExpressionStatement',
      expression: {
        type: 'CallExpression',
        callee: {
          type: 'CallExpression',
          callee: {
            type: 'MemberExpression',
            compute: false,
            object: {
              type: 'Identifier',
              name: 'a'
            },
            property: {
              type: 'Identifier',
              name: 'b'
            },
          },
          arguments: [
            {
              type: 'Identifier',
              name: 'x'
            },
          ],
        },
        arguments: [{
          type: 'Identifier',
          name: 'y',
        }]
      },
    },
  ],
  })

  test(`
    a.b(x=10)(y=20);
  `, {
    type: 'Program',
    body: [{
      type: 'ExpressionStatement',
      expression: {
        type: 'CallExpression',
        callee: {
          type: 'CallExpression',
          callee: {
            type: 'MemberExpression',
            compute: false,
            object: {
              type: 'Identifier',
              name: 'a'
            },
            property: {
              type: 'Identifier',
              name: 'b'
            },
          },
          arguments: [
            {
              type: 'AssignmentExpression',
              operator: '=',
              left: {
                type: 'Identifier',
                name: 'x',
              },
              right: {
                type: 'NumericLiteral',
                value: 10,
              },
            },
          ],
        },
        arguments: [{
          type: 'AssignmentExpression',
          operator: '=',
          left: {
            type: 'Identifier',
            name: 'y',
          },
          right: {
            type: 'NumericLiteral',
            value: 20,
          },
        }]
      },
    },
  ],
  })
};
