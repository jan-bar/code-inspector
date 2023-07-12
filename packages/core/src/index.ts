import path from 'path';
import fs from 'fs';
import { dirname } from 'path';

let compatibleDirname = '';

function fileURLToPath(fileURL: string) {
  let filePath = fileURL;
  if (process.platform === 'win32') {
    filePath = filePath.replace(/^file:\/\/\//, '');
    filePath = decodeURIComponent(filePath);
    filePath = filePath.replace(/\//g, '\\');
  } else {
    filePath = filePath.replace(/^file:\/\//, '');
    filePath = decodeURIComponent(filePath);
  }
  return filePath;
}

if (typeof __dirname !== 'undefined') {
  compatibleDirname = __dirname;
} else {
  compatibleDirname = dirname(fileURLToPath(import.meta.url));
}

const jsCodePath = path.resolve(compatibleDirname, './client.umd.js');

const jsCode = fs.readFileSync(jsCodePath, 'utf-8');

export type HotKey = 'ctrlKey' | 'altKey' | 'metaKey' | 'shiftKey';
export type CodeOptions = {
  hotKeys?: HotKey[] | false;
  showSwitch?: boolean;
  autoToggle?: boolean;
};

export function getInjectCode(port: number, options?: CodeOptions) {
  const {
    hotKeys = ['shiftKey', 'altKey'],
    showSwitch = false,
    autoToggle = true,
  } = options || ({} as CodeOptions);
  return `<code-inspector-component port=${port} hotKeys="${(hotKeys
    ? hotKeys
    : []
  )?.join(',')}"
  ${showSwitch ? 'showSwitch=true' : ''} ${
    autoToggle ? 'autoToggle=true' : ''
  }></code-inspector-component>
  <script type="text/javascript">
  ${jsCode}
  </script>`;
}

export { startServer, enhanceCode, normalizePath, parseSFC } from './server';
