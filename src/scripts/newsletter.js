/*
 * Newsletter adapter: Kit (kit.com). Connecting or changing a provider is a change to this file only.
 *
 * subscribe(email) returns a promise that resolves only when Kit has really accepted the
 * address, and rejects otherwise. The form never shows a success message unless it resolves.
 * Kit then emails the subscriber a confirmation link (double opt-in), which is why the
 * success message says "Check your inbox to confirm."
 *
 * The Kit form ID is public (it appears in every Kit embed code), so it lives here.
 * PUBLIC_NEWSLETTER_ENDPOINT, if set at build time, overrides it.
 */
const KIT_FORM_ID = '';

const ENDPOINT =
  import.meta.env.PUBLIC_NEWSLETTER_ENDPOINT ||
  (KIT_FORM_ID ? 'https://app.kit.com/forms/' + KIT_FORM_ID + '/subscriptions' : '');

export function subscribe(email) {
  if (!ENDPOINT) {
    console.error(
      '[newsletter] No Kit form ID or PUBLIC_NEWSLETTER_ENDPOINT is set, so nobody can be subscribed. ' +
        'Set KIT_FORM_ID in src/scripts/newsletter.js and rebuild the site.'
    );
    return Promise.reject(new Error('Newsletter endpoint not configured'));
  }
  /* A plain form post (no custom headers), the same request Kit's own embed sends. */
  return fetch(ENDPOINT, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: new URLSearchParams({ email_address: email }),
  })
    .then(function (res) {
      if (!res.ok) throw new Error('Kit answered ' + res.status);
      return res.json().catch(function () {
        return {};
      });
    })
    .then(function (data) {
      if (data && data.status && data.status !== 'success') {
        throw new Error('Kit did not accept the address: ' + data.status);
      }
    });
}
