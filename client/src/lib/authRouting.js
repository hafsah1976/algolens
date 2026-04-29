export function getAuthReturnPath(fromLocation, fallback = '/app/dashboard') {
  if (!fromLocation?.pathname) {
    return fallback;
  }

  return `${fromLocation.pathname}${fromLocation.search ?? ''}`;
}
