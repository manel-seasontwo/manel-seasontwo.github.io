Google Sheets webhook for Formspree

This guide shows how to receive Formspree webhook POSTs and append submissions to a Google Sheet using Google Apps Script.

Overview
- We'll create a Google Sheet that stores incoming rows.
- We'll add an Apps Script web app that accepts POST requests from Formspree and appends rows.
- We'll protect the endpoint with a shared secret passed as a query parameter when configuring the Formspree webhook.

Why use Apps Script?
- It's simple, free for low-volume usage, and stores data directly in a Google Sheet you control.

Security note
- The webhook will be deployed with visibility "Anyone, even anonymous" so Formspree can reach it. We protect access by requiring a secret query parameter (e.g. `?secret=LONG_RANDOM_STRING`). Keep that secret private.

Steps
1) Create a Google Sheet
- Create a new Google Sheet and name the first sheet "Sheet1" (or any name you prefer).
- Note the spreadsheet ID from the URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`.

2) Open Apps Script
- In the Google Sheet, go to Extensions → Apps Script.
- Delete any default code and create a new file called `Code.gs`.

3) Paste the webhook code
- Open `appscript.gs` from this repo and paste it into `Code.gs`.
- Save the project.

4) Set project properties
- In Apps Script: Project settings → Script properties (or via Editor: View → Project properties → Script properties).
- Add a property named `WEBHOOK_SECRET` with a long random value (e.g. generated from 32+ chars).
- Optionally add `SPREADSHEET_ID` if you plan to deploy as a standalone script and want to target a specific sheet, or leave it blank for a container-bound script.
- Optionally set `SHEET_NAME` if your sheet is not `Sheet1`.

5) Deploy the web app
- Click Deploy → New deployment.
- Select "Web app".
  - Description: Formspree webhook
  - Execute as: Me
  - Who has access: Anyone
- Click Deploy, authenticate, and copy the web app URL.

6) Configure Formspree webhook
- In Formspree dashboard for your form, add a webhook pointing to the web app URL, including the secret query param, for example:
  `https://script.google.com/macros/s/XXXX/exec?secret=LONG_RANDOM_SECRET`
- Make sure Formspree sends JSON (Formspree sends JSON by default for webhooks).

7) Test
- Submit the form on the live site (after the site is deployed to GitHub Pages and `site.form_endpoint` is configured), or use curl/Postman to POST JSON to your web app URL with the correct `?secret=`.
- The Google Sheet should receive a new row with the submission data (timestamp, name, email, phone, trip, consent, signup_ts, source, raw payload).

Troubleshooting
- If you get 403, verify the `WEBHOOK_SECRET` project property matches the `?secret=` parameter in the webhook URL.
- If the script errors on appendRow, ensure script has permission to edit the sheet and that the sheet name matches.

Notes on privacy & compliance
- This stores personal data in Google Sheets. Ensure your Google account and Sheets are secured and that you have a DPA with Google (Google Workspace accounts generally have stronger contractual protections). For EU-only storage, consider using a cloud function in an EU region and an EU-hosted database.

Files in this folder
- `appscript.gs` — the Apps Script webhook code to paste into Apps Script.

If you want, I can also produce a small Node.js serverless webhook implementation (AWS Lambda or Cloud Run) that stores to a Postgres DB hosted in an EU region. Tell me which option you prefer.
