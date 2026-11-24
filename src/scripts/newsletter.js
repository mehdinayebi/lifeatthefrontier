/*
 * Newsletter adapter. Connecting a provider is a change to this file only.
 *
 * subscribe(email) must return a promise that resolves only when the provider has
 * really accepted the address, and rejects otherwise. The form never shows a
 * success message unless this promise resolves.
 *
 * Default: POST { "email": "..." } as JSON to PUBLIC_NEWSLETTER_ENDPOINT,
 * which is read at build time (see .env.example).
 */
const ENDPOINT = import.meta.env.PUBLIC_NEWSLETTER_ENDPOINT || '';

export function subscribe(email) {
  if (!ENDPOINT) {
    console.error(
      '[newsletter] PUBLIC_NEWSLETTER_ENDPOINT is not set, so nobody can be subscribed. ' +
        'Set it to the newsletter provider\'s sign-up address and rebuild the site.'
    );
    return Promise.reject(new Error('Newsletter endpoint not configured'));
  }
  return fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ email: email }),
  }).then(function (res) {
    if (!res.ok) throw new Error('Newsletter provider answered ' + res.status);
  });
}
