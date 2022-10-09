module.exports = (test) => {
  test(`
  if (x) {
    x = 1;
  } else {
    x = 2;
  }
  `, {
    type: 'Program',
    body: [
      {
        type: 'IfStatement',
        test: {
          type: 'Identifier',
          name: 'x',
        },
        consequent: {
          type: 'BlockStatement',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                  type: 'Identifier',
                  name: 'x',
                },
                right: {
                  type: 'NumericLiteral',
                  value: 1,
                }
              }
            }
          ],
        },
        alternate: {
          type: 'BlockStatement',
          body: [{
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              operator: '=',
              left: {
                type: 'Identifier',
                name: 'x',
              },
              right: {
                type: 'NumericLiteral',
                value: 2,
              }
            },
          }]
        },
      }
    ],
  });

  test(`
  if (x) {
    x = 1;
  }
  `, {
    type: 'Program',
    body: [
      {
        type: 'IfStatement',
        test: {
          type: 'Identifier',
          name: 'x',
        },
        consequent: {
          type: 'BlockStatement',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                  type: 'Identifier',
                  name: 'x',
                },
                right: {
                  type: 'NumericLiteral',
                  value: 1,
                }
              }
            }
          ],
        },
        alternate: null,
      }
    ],
  });

  test(`if (x) x = 1;`, {
    type: 'Program',
    body: [
      {
        type: 'IfStatement',
        test: {
          type: 'Identifier',
          name: 'x',
        },
        consequent: {
          type: 'ExpressionStatement',
          expression: {
            type: 'AssignmentExpression',
            operator: '=',
            left: {
              type: 'Identifier',
              name: 'x',
            },
            right: {
              type: 'NumericLiteral',
              value: 1,
            }
          }
        },
        alternate: null,
      }
    ],
  });

  test(`if (x) if (y) {} else {}`, {
    type: 'Program',
    body: [
      {
        type: 'IfStatement',
        test: {
          type: 'Identifier',
          name: 'x',
        },
        consequent: {
          type: 'IfStatement',
          test: {
            type: 'Identifier',
            name: 'y',
          },
          consequent: {
            type: 'BlockStatement',
            body: [],
          },
          alternate: {
            type: 'BlockStatement',
            body: [],
          }
        },
        alternate: null,
      }
    ],
  });

  test(`if (x) if (y) {} else {} else {}`, {
    type: 'Program',
    body: [
      {
        type: 'IfStatement',
        test: {
          type: 'Identifier',
          name: 'x',
        },
        consequent: {
          type: 'IfStatement',
          test: {
            type: 'Identifier',
            name: 'y',
          },
          consequent: {
            type: 'BlockStatement',
            body: [],
          },
          alternate: {
            type: 'BlockStatement',
            body: [],
          }
        },
        alternate: {
          type: 'BlockStatement',
          body: []
        },
      }
    ],
  });
  // return;
  test(`if (x > 0) {
    x = 0;
  } else {
    x = 1;
  }`, {
    type: 'Program',
    body: [
      {
        type: 'IfStatement',
        test: {
          type: 'BinaryExpression',
          left: {
            type: 'Identifier',
            name: 'x',
          },
          right: {
            type: 'NumericLiteral',
            value: 0,
          },
          operator: '>',
        },
        consequent: {
          type: 'BlockStatement',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                  type: 'Identifier',
                  name: 'x'
                },
                right: {
                  type: 'NumericLiteral',
                  value: 0,
                },
              },
            }
          ]
        },
        alternate: {
          type: 'BlockStatement',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                  type: 'Identifier',
                  name: 'x'
                },
                right: {
                  type: 'NumericLiteral',
                  value: 1,
                },
              },
            }
          ]
        },
      }
    ],
  });

  test(`
    if (x >= 0) {
      x += 10;
    } else {
      x += 20;
    }
  `, {
    type: 'Program',
    body: [
      {
        type: 'IfStatement',
        test: {
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
        consequent: {
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
                  value: 10,
                },
              },
            }
          ],
        },
        alternate: {
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
                  value: 20,
                },
              }
            }
          ],
        },
      }
    ],
  });

  test(`
    if (x + 10 > 0) {
      x += 10;
    } else {
      x += 20;
    }
  `, {
    type: 'Program',
    body: [
      {
        type: 'IfStatement',
        test: {
          type: 'BinaryExpression',
          operator: '>',
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
            }
          },
          right: {
            type: 'NumericLiteral',
            value: 0,
          },
        },
        consequent: {
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
                  value: 10,
                },
              },
            }
          ],
        },
        alternate: {
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
                  value: 20,
                },
              }
            }
          ],
        },
      }
    ],
  });
};
