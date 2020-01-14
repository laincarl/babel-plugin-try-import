module.exports = function Plugin(babel) {
  const { types: t } = babel;
  return {
    name: 'try-import', // not required
    visitor: {
      CallExpression(path, state) {
        // const hasModuleB = hasModule('moduleB');
        //        |  |
        //        |  |
        //       \    /
        //        \  /
        //         \/
        // (function () {
        //   let temp = false;
        //   try {
        //     require.resolveWeak('moduleB');
        //     temp = true;
        //   } catch (error) { }
        //   return temp;
        // }())
        const options = state.opts
        const tryImport = options.tryImport || 'tryImport';
        const hasModule = options.hasModule || 'hasModule';
        const { node } = path;
        if (node.callee) {
          const funcName = node.callee.name;
          if (funcName === tryImport) {
            const [moduleName, defaultValue] = node.arguments;
            const left = t.identifier('temp');
            // 不带default
            // const right = t.callExpression(t.identifier("require"), [moduleName])
            const right = t.memberExpression(t.callExpression(t.identifier('require'), [moduleName]), t.identifier('default'));
            path.replaceWith(t.expressionStatement(
              t.callExpression(
                t.functionExpression(
                  null,
                  [],
                  t.blockStatement(
                    [
                      // 定义临时变量
                      t.variableDeclaration('let', [t.variableDeclarator(t.identifier('temp'), defaultValue)]),
                      t.tryStatement(
                        t.blockStatement([t.expressionStatement(t.assignmentExpression('=', left, right))]),
                        t.catchClause(t.identifier('error'), t.blockStatement([])),
                      ),
                      t.returnStatement(t.identifier('temp'))
                    ]
                  )
                ),
                []
              )
            ))
          }
          else if (funcName === hasModule) {
            const [moduleName] = node.arguments;
            path.replaceWith(t.expressionStatement(
              t.callExpression(
                t.functionExpression(
                  null,
                  [],
                  t.blockStatement(
                    [
                      // 定义临时变量
                      t.variableDeclaration('let', [t.variableDeclarator(t.identifier('temp'), t.identifier('false'))]),
                      t.tryStatement(
                        t.blockStatement([
                          t.expressionStatement(t.callExpression(t.memberExpression(t.identifier('require'), t.identifier('resolveWeak')), [moduleName])),
                          t.expressionStatement(t.assignmentExpression('=', t.identifier('temp'), t.identifier('true'))),
                        ]),
                        t.catchClause(t.identifier('error'), t.blockStatement([])),
                      ),
                      t.returnStatement(t.identifier('temp'))
                    ]
                  )
                ),
                []
              )
            ))
          }
        }
      },
    },
  };
};
