const fs = require("fs");
const ts = require("typescript");

const file = "src/app/api/astro-chat/route.ts";
const source = fs.readFileSync(file, "utf8");
const ast = ts.createSourceFile(
  file,
  source,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX
);

const removals = [];

function visit(node) {
  if (
    ts.isExpressionStatement(node) &&
    ts.isCallExpression(node.expression)
  ) {
    const call = node.expression;
    const target = call.expression;

    if (
      ts.isPropertyAccessExpression(target) &&
      ts.isIdentifier(target.expression) &&
      target.expression.text === "console" &&
      target.name.text === "log"
    ) {
      removals.push({
        start: node.getStart(ast),
        end: node.getEnd(),
      });
    }
  }

  ts.forEachChild(node, visit);
}

visit(ast);

if (ast.parseDiagnostics.length) {
  throw new Error("Source has syntax errors. No changes made.");
}

let updated = source;

for (const item of removals.reverse()) {
  updated =
    updated.slice(0, item.start) +
    updated.slice(item.end);
}

fs.writeFileSync(file, updated);

console.log(`Removed ${removals.length} console.log statements.`);

