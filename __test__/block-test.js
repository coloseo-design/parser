module.exports = test => {
  test(`{
    // 单行注释测试
    123456;
    /** 多行注释测试  **/
    'helloworld';
  }`, {
    type: 'Program',
    body: [
      {
        type: 'BlockStatement',
        body:[
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NumericLiteral',
              value: 123456,
            }
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'StringLiteral',
              value: 'helloworld',
            }
          }
        ],
      }
    ],
  });

  test(`
  // 空的语句块测试
  {
  }
  `, {
    type: 'Program',
    body: [
      {
        type: 'BlockStatement',
        body: [],
      },
    ],
  });

  test(`
  // 嵌套
  {
    123;
    {
      "helloworld";
    }
  }
  `, {
    type: 'Program',
    body: [
      {
        type: 'BlockStatement',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NumericLiteral',
              value: 123,
            },
          },
          {
            type: 'BlockStatement',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'StringLiteral',
                  value: 'helloworld',
                },
              },
            ]
          }
        ],
      },
    ],
  })
}
