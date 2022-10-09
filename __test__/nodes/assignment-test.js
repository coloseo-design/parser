module.exports = test => {
  test(`a = 12;`, {
    type: 'Program',
    body: [{
      type: 'ExpressionStatement',
      expression: {
        type: 'AssignmentExpression',
        operator: '=',
        left: {
          type: 'Identifier',
          name: 'a'
        },
        right: {
          type: 'NumericLiteral',
          value: 12,
        }
      }
    }],
  });

  test(`a = b = 12;`, {
    type: 'Program',
    body: [{
      type: 'ExpressionStatement',
      expression: {
        type: 'AssignmentExpression',
        operator: '=',
        left: {
          type: 'Identifier',
          name: 'a'
        },
        right: {
          type: 'AssignmentExpression',
          operator: '=',
          left: {
            type: 'Identifier',
            name: 'b',
          },
          right: {
            type: 'NumericLiteral',
            value: 12,
          }
        }
      }
    }],
  });

  test(`a = (y + 10);`, {
    type: 'Program',
    body: [{
      type: 'ExpressionStatement',
      expression: {
        type: 'AssignmentExpression',
        operator: '=',
        left: {
          type: 'Identifier',
          name: 'a'
        },
        right: {
          type: 'BinaryExpression',
          operator: '+',
          left: {
            type: 'Identifier',
            name: 'y',
          },
          right: {
            type: 'NumericLiteral',
            value: 10,
          }
        }
      }
    }],
  });

  test(`a *= 12;`, {
    type: 'Program',
    body: [{
      type: 'ExpressionStatement',
      expression: {
        type: 'AssignmentExpression',
        operator: '*=',
        left: {
          type: 'Identifier',
          name: 'a'
        },
        right: {
          type: 'NumericLiteral',
          value: 12,
        }
      }
    }],
  });
};
