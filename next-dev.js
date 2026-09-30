import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const nextCli = path.join(__dirname, 'node_modules', 'next', 'dist', 'bin', 'next');

const rawArgs = process.argv.slice(2);
const filteredArgs = [];
let hasPort = false;
let hasHost = false;

for (let i = 0; i < rawArgs.length; i++) {
  const arg = rawArgs[i];
  if (arg === '--host') {
    i++; // Skip the value that follows
    continue;
  }
  if (arg.startsWith('--host=')) {
    continue;
  }
  if (arg === '-p' || arg === '--port') {
    hasPort = true;
    filteredArgs.push(arg);
    if (i + 1 < rawArgs.length) {
      filteredArgs.push(rawArgs[i + 1]);
      i++;
    }
    continue;
  }
  if (arg.startsWith('--port=')) {
    hasPort = true;
    filteredArgs.push(arg);
    continue;
  }
  if (arg === '-H' || arg === '--hostname') {
    hasHost = true;
    filteredArgs.push(arg);
    if (i + 1 < rawArgs.length) {
      filteredArgs.push(rawArgs[i + 1]);
      i++;
    }
    continue;
  }
  if (arg.startsWith('--hostname=')) {
    hasHost = true;
    filteredArgs.push(arg);
    continue;
  }
  filteredArgs.push(arg);
}

const nextArgs = [nextCli, 'dev'];
if (!hasPort) {
  nextArgs.push('-p', '3000');
}
if (!hasHost) {
  nextArgs.push('-H', '0.0.0.0');
}
nextArgs.push(...filteredArgs);

const child = spawn(process.execPath, nextArgs, {
  stdio: 'inherit',
  env: process.env,
});

const handleSignal = (signal) => {
  if (child && !child.killed) {
    child.kill(signal);
  }
};

process.on('SIGTERM', () => handleSignal('SIGTERM'));
process.on('SIGINT', () => handleSignal('SIGINT'));
process.on('SIGHUP', () => handleSignal('SIGHUP'));

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exit(code ?? 0);
  }
});
