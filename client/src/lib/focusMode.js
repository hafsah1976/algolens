export const FOCUS_MODE_STORAGE_KEY = 'algolens.focusMode';

export function readStoredFocusMode(storage) {
  try {
    return storage?.getItem(FOCUS_MODE_STORAGE_KEY) === 'on';
  } catch {
    return false;
  }
}

export function writeStoredFocusMode(storage, isFocusMode) {
  try {
    storage?.setItem(FOCUS_MODE_STORAGE_KEY, isFocusMode ? 'on' : 'off');
  } catch {
    // The UI still works if private browsing or browser settings block storage.
  }
}

export function getFocusModeToggleLabel(isFocusMode) {
  return isFocusMode ? 'Calm mode' : 'Focus mode';
}

export function getFocusModeStatus(isFocusMode) {
  return isFocusMode ? 'Focus Mode is on' : 'Calm Mode is on';
}
