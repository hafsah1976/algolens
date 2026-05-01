# Production Email QA

Use this checklist before sharing the live AlgoLens link with testers.

## Required Netlify Variables

Set these in Netlify for the production deploy context:

- `RESEND_API_KEY`
- `EMAIL_FROM`
- `APP_BASE_URL`

`EMAIL_FROM` must use a sender that Resend has verified, such as `AlgoLens <hello@yourdomain.com>`.
`APP_BASE_URL` should be the public Netlify URL, for example `https://lustrous-beijinho-ac5708.netlify.app`.

## Safe Health Check

Open:

```text
https://your-site.netlify.app/api/health
```

The response should include:

```json
"email": {
  "provider": "resend",
  "state": "configured",
  "configured": true
}
```

The health response intentionally shows only safe metadata such as the sender domain and app host.
It must never show the Resend API key or the full sender address.

## Browser QA

1. Create a new account with an email address you can access.
2. Confirm the dashboard says the account needs verification.
3. Click the verification link from the email.
4. Confirm the reminder disappears after refresh.
5. Sign out and use forgot password.
6. Confirm the reset email arrives.
7. Reset the password.
8. Sign in with the new password.

## Common Failure Checks

- If no email arrives, confirm `EMAIL_FROM` is verified in Resend.
- If links open the wrong site, confirm `APP_BASE_URL` matches the live Netlify URL.
- If health says `missing_configuration`, confirm the Netlify variables are set for Production, not only Deploy Previews.
- If Resend rejects the send request, check the Netlify function logs for the provider error.
