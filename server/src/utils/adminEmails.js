function normalizeEmail(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function getConfiguredAdminEmails() {
  return new Set(
    (process.env.ADMIN_EMAILS ?? '')
      .split(',')
      .map((email) => normalizeEmail(email))
      .filter(Boolean),
  );
}

export function isConfiguredAdminEmail(email) {
  return getConfiguredAdminEmails().has(normalizeEmail(email));
}

export function resolveRoleForEmail(email, fallbackRole = 'student') {
  return isConfiguredAdminEmail(email) ? 'admin' : fallbackRole;
}

export async function promoteConfiguredAdmin(user) {
  if (!user || user.role === 'admin' || !isConfiguredAdminEmail(user.email)) {
    return user;
  }

  user.role = 'admin';
  await user.save();

  return user;
}
