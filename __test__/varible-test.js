module.exports = test => {
  test(`let a = 12;`, {
    type: 'Program',
    body: [
      {
        type: 'VaribleStatement',
        declarations: [
          {
            type: 'VaribleDeclaration',
            id: {
              type: 'Identifier',
              name: 'a',
            },
            init: {
              type: 'NumericLiteral',
              value: 12,
            }
          }
        ]
      }
    ],
  });

  test(`let a;`, {
    type: 'Program',
    body: [
      {
        type: 'VaribleStatement',
        declarations: [
          {
            type: 'VaribleDeclaration',
            id: {
              type: 'Identifier',
              name: 'a',
            },
            init: null,
          }
        ]
      }
    ],
  });

  test(`let a, b;`, {
    type: 'Program',
    body: [
      {
        type: 'VaribleStatement',
        declarations: [
          {
            type: 'VaribleDeclaration',
            id: {
              type: 'Identifier',
              name: 'a',
            },
            init: null,
          },
          {
            type: 'VaribleDeclaration',
            id: {
              type: 'Identifier',
              name: 'b',
            },
            init: null,
          }
        ]
      }
    ],
  });

  test(`let a, b = 2;`, {
    type: 'Program',
    body: [
      {
        type: 'VaribleStatement',
        declarations: [
          {
            type: 'VaribleDeclaration',
            id: {
              type: 'Identifier',
              name: 'a',
            },
            init: null,
          },
          {
            type: 'VaribleDeclaration',
            id: {
              type: 'Identifier',
              name: 'b',
            },
            init: {
              type: 'NumericLiteral',
              value: 2,
            },
          }
        ]
      }
    ],
  });

  test(`let a = 1, b = 2;`, {
    type: 'Program',
    body: [
      {
        type: 'VaribleStatement',
        declarations: [
          {
            type: 'VaribleDeclaration',
            id: {
              type: 'Identifier',
              name: 'a',
            },
            init: {
              type: 'NumericLiteral',
              value: 1,
            },
          },
          {
            type: 'VaribleDeclaration',
            id: {
              type: 'Identifier',
              name: 'b',
            },
            init: {
              type: 'NumericLiteral',
              value: 2,
            },
          }
        ]
      }
    ],
  });

  test(`let a = b = 1;`, {
    type: 'Program',
    body: [
      {
        declarations: [
          {
            id: {
              name: 'a',
              type: 'Identifier'
            },
            init: {
              left: {
                name: 'b',
                type: 'Identifier'
              },
              operator: '=',
              right: {
                type: 'NumericLiteral',
                value: 1
              },
              type: 'AssignmentExpression'
            },
            type: 'VaribleDeclaration'
          }
        ],
        type: 'VaribleStatement',
      },
    ],
  });
};
