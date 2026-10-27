import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);

// Run a browser-style script (one that assigns to `window.*`) inside a vm
// context built from `win`, and return that context.
export function loadBrowserScript(relPath, win = {}) {
  const file = path.isAbsolute(relPath) ? relPath : path.join(ROOT, relPath);
  win.window = win;
  if (!('globalThis' in win)) win.globalThis = win;
  const ctx = vm.createContext(win);
  vm.runInContext(fs.readFileSync(file, 'utf8'), ctx, { filename: file });
  return win;
}
