// server-only-shim.cjs
// Makes `import "server-only"` a no-op when running Node tests (tsx).
const Module = require("module");

const originalLoad = Module._load;

Module._load = function (request, parent, isMain) {
  if (request === "server-only") {
    return {}; // no-op
  }
  return originalLoad.apply(this, arguments);
};
