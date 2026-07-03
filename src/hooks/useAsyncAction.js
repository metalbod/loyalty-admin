import { useCallback, useState } from 'react';

/**
 * Wraps an async submit handler with loading/error/success state, so forms across the
 * dashboard (create profile, configure rates, create campaign) share one consistent pattern.
 */
export function useAsyncAction(action) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const run = useCallback(
    async (...args) => {
      setIsSubmitting(true);
      setError(null);
      setSuccess(false);
      try {
        const result = await action(...args);
        setSuccess(true);
        return result;
      } catch (err) {
        setError(err?.message || 'Something went wrong. Please try again.');
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [action],
  );

  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  return { run, isSubmitting, error, success, reset };
}
