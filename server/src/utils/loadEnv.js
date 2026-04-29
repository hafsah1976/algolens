import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function getServerEnvPathCandidates() {
  const cwd = process.cwd();
  const cwdPath = cwd.replace(/\\/g, '/');
  const candidates = [];

  if (process.env.SERVER_ENV_PATH) {
    candidates.push(process.env.SERVER_ENV_PATH);
  }

  if (cwdPath.endsWith('/server')) {
    candidates.push(resolve(cwd, '.env'));
  }

  candidates.push(resolve(cwd, 'server', '.env'));
  candidates.push(resolve(cwd, '.env'));

  return [...new Set(candidates)];
}

function parseEnvLine(line) {
  const trimmed = line.trim();

  if (!trimmed || trimmed.startsWith('#')) {
    return null;
  }

  const equalsIndex = trimmed.indexOf('=');

  if (equalsIndex === -1) {
    return null;
  }

  const key = trimmed.slice(0, equalsIndex).trim();
  let value = trimmed.slice(equalsIndex + 1).trim();

  if (!key) {
    return null;
  }

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  return { key, value };
}

export function loadServerEnv() {
  const serverEnvPath = getServerEnvPathCandidates().find((candidate) =>
    existsSync(candidate),
  );

  if (!serverEnvPath) {
    return;
  }

  const envFile = readFileSync(serverEnvPath, 'utf8');

  for (const line of envFile.split(/\r?\n/)) {
    const parsed = parseEnvLine(line);

    if (!parsed || process.env[parsed.key] !== undefined) {
      continue;
    }

    process.env[parsed.key] = parsed.value;
  }
}
