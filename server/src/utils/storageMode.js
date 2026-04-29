const VALID_STORAGE_PREFERENCES = new Set(['auto', 'mongo', 'file']);

export function getProgressStoragePreference() {
  const value = (process.env.PROGRESS_STORAGE_MODE || 'auto').toLowerCase();
  return VALID_STORAGE_PREFERENCES.has(value) ? value : 'auto';
}

export function getProgressStorageMode(databaseConnected) {
  const preference = getProgressStoragePreference();

  if (preference === 'file') {
    return 'file';
  }

  if (preference === 'mongo') {
    return 'mongo';
  }

  return databaseConnected ? 'mongo' : 'file-fallback';
}
