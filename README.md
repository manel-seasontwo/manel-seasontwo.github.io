# manel-seasontwo.github.io
temp landing page

## Waiting list form

This repo now contains a waiting-list signup form on the homepage.

What I added
- `index.html` — accessible signup form (reads `site.form_endpoint` from `_config.yml`).
- `assets/js/form.js` — client-side validation and submission logic.
- `assets/css/styles.css` — minimal styling.
- `privacy.md` — basic privacy & data handling page.

How to enable submissions
1. Pick a form backend (Formspree or Getform are simple).
	- Formspree: https://formspree.io — create a free form and get an endpoint like `https://formspree.io/f/abcd1234`.
	- Getform: https://getform.io — similar flow.
2. Open `_config.yml` and set `form_endpoint` to the URL they give you (replace the placeholder).

Testing locally
1. If you have Ruby & Bundler, run Jekyll locally:

```bash
bundle install
bundle exec jekyll serve
```

2. Open `http://127.0.0.1:4000/` and submit the form.

If you don't run Jekyll locally, you can still open `index.html` in a browser but the Liquid variable won't be rendered — make sure `site.form_endpoint` is set (Jekyll will inject it on GitHub Pages).

Production notes
- `CNAME` is already present for `seasontwo.no`. Ensure DNS A records match GitHub Pages docs and the custom domain is configured in the repository settings.
- After configuring `form_endpoint`, deploy to GitHub and test a submission.

Privacy & Data
- See `privacy.md` for what we collect and how we process it.

Next steps (recommended)
- Enable double opt-in or use Mailchimp for mailing list management and GDPR-friendly consent.
- Optionally wire submissions to Google Sheets via a webhook (Getform/Formspree support webhooks), or to Mailchimp with their API.

Integration examples

1) Quick: Formspree
	- Create a free form at https://formspree.io and copy the endpoint (looks like `https://formspree.io/f/abcd1234`).
	- Put that value into `_config.yml` as `form_endpoint` and push to GitHub. The form will POST JSON to that endpoint.
	- Enable email notifications in Formspree to receive submissions in your inbox, or enable their webhook to forward to other services.

2) Storing to Google Sheets (recommended simple workflow)
	- Use a service like Make/Integromat, Zapier, or a small Cloud Function to accept Formspree webhook calls and append rows to Google Sheets.
	- Flow: Formspree -> Webhook/Make -> Google Sheets. This preserves submissions for audit and operations.

3) Mailchimp or SendGrid
	- For a managed mailing list and compliance, forward form submissions to Mailchimp using their API (create an audience and use their add-member endpoint) or use Formspree/Getform to forward to Mailchimp webhook.

Security & spam notes
- Honeypot field is included in the form to reduce bot spam. For higher-volume sites, consider adding reCAPTCHA v3 or hCaptcha and server-side verification.

Deployment checklist
- Set `form_endpoint` in `_config.yml`.
- Configure DNS for `seasontwo.no` following GitHub Pages instructions and ensure the repository has the custom domain set (the `CNAME` file is present).
- Test a submission and verify delivery (email, Google Sheets row, or Mailchimp list).


