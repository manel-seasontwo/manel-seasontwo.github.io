Formspree -> Google Sheets webhook (summary)

Files added
- `/webhook/google-sheets/appscript.gs` — Apps Script code to receive Formspree webhook POSTs and append to a Google Sheet.
- `/webhook/google-sheets/README.md` — full step-by-step setup instructions.

Quick steps
1) Create a Google Sheet and open Extensions → Apps Script.
2) Paste `appscript.gs` into the script editor and save.
3) In Project settings, add Script properties:
   - `WEBHOOK_SECRET` = a long random string (keep private)
   - Optional: `SPREADSHEET_ID` = your sheet ID if using a standalone script
   - Optional: `SHEET_NAME` = the sheet/tab name, default `Sheet1`
4) Deploy → New deployment → Web app → Execute as: Me → Who has access: Anyone.
5) Copy the web app URL and add it in Formspree webhook settings, appended with `?secret=YOUR_SECRET`.
6) Test by submitting the form. A new row should appear with the submission and `signup_ts`.

Support
- For any issues or data requests contact: help.seasontwo@gmail.com

Notes
- This approach stores data in Google Sheets. For stronger compliance choose a storage location in the EEA (e.g., EU-hosted DB) and ensure DPAs are in place.
