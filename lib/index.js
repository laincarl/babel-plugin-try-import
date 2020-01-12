module.exports = function (babel) {
  const {
    types: t
  } = babel;
  return {
    name: "ast-transform",
    // not required
    visitor: {
      VariableDeclaration(path) {
        const node = path.node;

        if (node.declarations[0] && node.declarations[0].init && node.declarations[0].init.callee) {
          const funcName = node.declarations[0].init.callee.name;

          if (funcName === "tryImport") {
            const name = node.declarations[0].id.name;
            const args = node.declarations[0].init.arguments;
            const left = t.identifier(name); // 不带default
            // const right = t.callExpression(t.identifier("require"), [args[0]])

            const right = t.memberExpression(t.callExpression(t.identifier("require"), [args[0]]), t.identifier("default"));
            path.replaceWithMultiple([t.variableDeclaration("let", [t.variableDeclarator(t.identifier(name), args[1])]), t.tryStatement(t.blockStatement([t.expressionStatement(t.assignmentExpression("=", left, right))]), t.catchClause(t.identifier('error'), t.blockStatement([])))]);
          } else if (funcName === "hasModule") {
            const name = node.declarations[0].id.name;
            const args = node.declarations[0].init.arguments;
            path.replaceWithMultiple([t.variableDeclaration("let", [t.variableDeclarator(t.identifier(name), t.identifier('false'))]), t.tryStatement(t.blockStatement([t.expressionStatement(t.callExpression(t.memberExpression(t.identifier("require"), t.identifier("resolveWeak")), [args[0]])), t.expressionStatement(t.assignmentExpression("=", t.identifier(name), t.identifier('true')))]), t.catchClause(t.identifier('error'), t.blockStatement([])))]);
          }
        }
      }

    }
  };
};