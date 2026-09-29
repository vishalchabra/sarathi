const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const root = "src";
const backupRoot = "console-cleanup-backup";
const excluded = [
  /[/\\]tests?[/\\]/i,
  /[/\\]debug[/\\]/i,
  /[/\\]dev[/\\]/i,
  /[/\\]stripe[/\\]webhook[/\\]/i,
  /[/\\](test|spec|certif|diagnos)[^/\\]*\.[jt]sx?$/i
];

function getFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true })
    .flatMap(entry => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return getFiles(full);
      return /\.[jt]sx?$/.test(entry.name) ? [full] : [];
    });
}

let total = 0;
let changed = 0;
const report = [];

for (const file of getFiles(root)) {
  if (excluded.some(pattern => pattern.test(file))) continue;

  const source = fs.readFileSync(file, "utf8");
  const ast = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  );

  if (ast.parseDiagnostics.length) {
    report.push(`SKIPPED (parse error): ${file}`);
    continue;
  }

  const removals = [];

  function visit(node) {
    if (
      ts.isExpressionStatement(node) &&
      ts.isCallExpression(node.expression)
    ) {
      const target = node.expression.expression;

      if (
        ts.isPropertyAccessExpression(target) &&
        ts.isIdentifier(target.expression) &&
        target.expression.text === "console" &&
        ["log", "debug", "info"].includes(target.name.text)
      ) {
        removals.push({
          start: node.getStart(ast),
          end: node.getEnd()
        });
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(ast);

  if (!removals.length) continue;

  const backup = path.join(backupRoot, file);
  fs.mkdirSync(path.dirname(backup), { recursive: true });
  fs.copyFileSync(file, backup);

  let updated = source;

  for (const item of removals.reverse()) {
    updated =
      updated.slice(0, item.start) +
      ";" +
      updated.slice(item.end);
  }

  fs.writeFileSync(file, updated);

  changed++;
  total += removals.length;
  report.push(`${removals.length} removed: ${file}`);
}

fs.writeFileSync(
  "console-cleanup-report.txt",
  report.join("\n")
);

console.log(`Files modified: ${changed}`);
console.log(`Statements removed: ${total}`);
console.log("Backups: console-cleanup-backup");
console.log("Report: console-cleanup-report.txt");
