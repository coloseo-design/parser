module.exports = test => {
  test(`
    for(let i = 0, y = 10; i <= 10; i += 1) {
      x += 12;
    }
  `, {
    type: 'Program',
    body: [
      {
        type: 'ForStatement',
        init: {
          type: 'VariableStatement',
          declarations: [
            {
              type: 'VariableDeclaration',
              id: {
                type: 'Identifier',
                name: 'i',
              },
              init: {
                type: 'NumericLiteral',
                value: 0,
              },
            },
            {
              type: 'VariableDeclaration',
              id: {
                type: 'Identifier',
                name: 'y',
              },
              init: {
                type: 'NumericLiteral',
                value: 10,
              },
            }
          ],
        },
        test: {
          type: 'BinaryExpression',
          operator: '<=',
          left: {
            type: 'Identifier',
            name: 'i',
          },
          right: {
            type: 'NumericLiteral',
            value: 10,
          },
        },
        update: {
          type: 'AssignmentExpression',
          operator: '+=',
          left: {
            type: 'Identifier',
            name: 'i',
          },
          right: {
            type: 'NumericLiteral',
            value: 1,
          },
        },
        body: {
          type: 'BlockStatement',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                operator: '+=',
                left: {
                  type: 'Identifier',
                  name: 'x',
                },
                right: {
                  type: 'NumericLiteral',
                  value: 12,
                }
              },
            }
          ],
        }
      },
    ]
  });

  test(`
    for(let i = 0, y = 10; i <= 10; i += 1) {
      x += i;
    }
  `, {
    type: 'Program',
    body: [
      {
        type: 'ForStatement',
        init: {
          type: 'VariableStatement',
          declarations: [
            {
              type: 'VariableDeclaration',
              id: {
                type: 'Identifier',
                name: 'i',
              },
              init: {
                type: 'NumericLiteral',
                value: 0,
              },
            },
            {
              type: 'VariableDeclaration',
              id: {
                type: 'Identifier',
                name: 'y',
              },
              init: {
                type: 'NumericLiteral',
                value: 10,
              },
            }
          ],
        },
        test: {
          type: 'BinaryExpression',
          operator: '<=',
          left: {
            type: 'Identifier',
            name: 'i',
          },
          right: {
            type: 'NumericLiteral',
            value: 10,
          },
        },
        update: {
          type: 'AssignmentExpression',
          operator: '+=',
          left: {
            type: 'Identifier',
            name: 'i',
          },
          right: {
            type: 'NumericLiteral',
            value: 1,
          },
        },
        body: {
          type: 'BlockStatement',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                operator: '+=',
                left: {
                  type: 'Identifier',
                  name: 'x',
                },
                right: {
                  type: 'Identifier',
                  name: 'i',
                }
              },
            }
          ],
        }
      },
    ]
  });

  test(`
    for(; i <= 10; i += 1) {
      x += i;
    }
  `, {
    type: 'Program',
    body: [
      {
        type: 'ForStatement',
        init: null,
        test: {
          type: 'BinaryExpression',
          operator: '<=',
          left: {
            type: 'Identifier',
            name: 'i',
          },
          right: {
            type: 'NumericLiteral',
            value: 10,
          },
        },
        update: {
          type: 'AssignmentExpression',
          operator: '+=',
          left: {
            type: 'Identifier',
            name: 'i',
          },
          right: {
            type: 'NumericLiteral',
            value: 1,
          },
        },
        body: {
          type: 'BlockStatement',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                operator: '+=',
                left: {
                  type: 'Identifier',
                  name: 'x',
                },
                right: {
                  type: 'Identifier',
                  name: 'i',
                }
              },
            }
          ],
        }
      },
    ]
  });

  test(`
    for(;;) {
      x += i;
    }
  `, {
    type: 'Program',
    body: [
      {
        type: 'ForStatement',
        init: null,
        test: null,
        update: null,
        body: {
          type: 'BlockStatement',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                operator: '+=',
                left: {
                  type: 'Identifier',
                  name: 'x',
                },
                right: {
                  type: 'Identifier',
                  name: 'i',
                }
              },
            }
          ],
        }
      },
    ]
  });

  test(`
    for(i = 0, y = 10; i <= 10; i += 1) {
      x += i;
    }
  `, {
    type: 'Program',
    body: [
      {
        type: 'ForStatement',
        init: {
          type: 'SequenceExpression',
          expressions: [
            {
              type: 'AssignmentExpression',
              operator: '=',
              left: {
                type: 'Identifier',
                name: 'i',
              },
              right: {
                type: 'NumericLiteral',
                value: 0,
              },
            },
            {
              type: 'AssignmentExpression',
              operator: '=',
              left: {
                type: 'Identifier',
                name: 'y',
              },
              right: {
                type: 'NumericLiteral',
                value: 10,
              },
            }
          ],
        },
        test: {
          type: 'BinaryExpression',
          operator: '<=',
          left: {
            type: 'Identifier',
            name: 'i',
          },
          right: {
            type: 'NumericLiteral',
            value: 10,
          },
        },
        update: {
          type: 'AssignmentExpression',
          operator: '+=',
          left: {
            type: 'Identifier',
            name: 'i',
          },
          right: {
            type: 'NumericLiteral',
            value: 1,
          },
        },
        body: {
          type: 'BlockStatement',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                operator: '+=',
                left: {
                  type: 'Identifier',
                  name: 'x',
                },
                right: {
                  type: 'Identifier',
                  name: 'i',
                }
              },
            }
          ],
        }
      },
    ]
  });
};
