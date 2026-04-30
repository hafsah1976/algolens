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

export function isVerifiedAdminUser(user) {
  return Boolean(user?.emailVerifiedAt) && isConfiguredAdminEmail(user.email);
}

export function resolveRoleForUser(user, fallbackRole = 'student') {
  if (!user) {
    return fallbackRole;
  }

  return isVerifiedAdminUser(user) ? 'admin' : fallbackRole;
}

export async function promoteConfiguredAdmin(user) {
  if (!user) {
    return user;
  }

  if (!isConfiguredAdminEmail(user.email) || !user.emailVerifiedAt) {
    if (user.role === 'admin' && !isConfiguredAdminEmail(user.email)) {
      user.role = 'student';
      if (typeof user.save === 'function') {
        await user.save();
      }
    }

    return user;
  }

  if (user.role === 'admin') {
    return user;
  }

  user.role = 'admin';
  await user.save();

  return user;
}
