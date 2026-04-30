export const MAX_SUBMISSION_CODE_LENGTH = 20000;
export const SUPPORTED_SUBMISSION_LANGUAGES = ['javascript', 'python'];

export function validateSubmissionInput(body = {}) {
  const language = typeof body.language === 'string' ? body.language.trim().toLowerCase() : '';
  const code = typeof body.code === 'string' ? body.code : '';

  if (!SUPPORTED_SUBMISSION_LANGUAGES.includes(language)) {
    return {
      error: `Choose a supported language: ${SUPPORTED_SUBMISSION_LANGUAGES.join(' or ')}.`,
    };
  }

  if (!code.trim()) {
    return {
      error: 'Code is required before submitting.',
    };
  }

  if (code.length > MAX_SUBMISSION_CODE_LENGTH) {
    return {
      error: `Code must be ${MAX_SUBMISSION_CODE_LENGTH.toLocaleString()} characters or fewer.`,
    };
  }

  return {
    data: {
      code,
      language,
    },
    error: null,
  };
}
