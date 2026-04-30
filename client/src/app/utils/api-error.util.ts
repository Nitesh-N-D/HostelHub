export const getErrorMessage = (error: unknown, fallback = 'Something went wrong. Please try again.') => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    (error as { status?: number }).status === 0
  ) {
    return 'Unable to reach the server. Check your connection and try again.';
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'error' in error &&
    typeof (error as { error?: { message?: string } }).error?.message === 'string'
  ) {
    return (error as { error: { message: string } }).error.message;
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'error' in error &&
    Array.isArray((error as { error?: { errors?: string[] } }).error?.errors)
  ) {
    return (error as { error: { errors: string[] } }).error.errors.join(', ');
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'error' in error &&
    typeof (error as { error?: string }).error === 'string'
  ) {
    return (error as { error: string }).error;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};
