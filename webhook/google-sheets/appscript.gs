/**
 * Apps Script webhook for Formspree -> Google Sheets
 *
 * Instructions: See README.md in the same folder for setup steps.
 */

function doPost(e) {
  // Basic secret check via query param: ?secret=XXX
  var scriptProps = PropertiesService.getScriptProperties();
  var expected = scriptProps.getProperty('WEBHOOK_SECRET');
  var secret = (e.parameter && e.parameter.secret) || '';
  if (!expected || secret !== expected) {
    return ContentService.createTextOutput('Forbidden').setMimeType(ContentService.MimeType.TEXT);
  }

  // Determine spreadsheet
  var ss;
  var ssId = scriptProps.getProperty('SPREADSHEET_ID');
  if (ssId) {
    ss = SpreadsheetApp.openById(ssId);
  } else {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  }

  var sheetName = scriptProps.getProperty('SHEET_NAME') || 'Sheet1';
  var sheet = ss.getSheetByName(sheetName) || ss.getSheets()[0];

  // Parse payload (Formspree sends JSON webhook payload)
  var payload;
  try {
    payload = JSON.parse(e.postData.contents);
  } catch (err) {
    payload = e.parameter || {};
  }

  var ts = new Date();
  var row = [
    ts.toISOString(),
    payload.name || '',
    payload.email || '',
    payload.phone || '',
    payload.trip || '',
    payload.subscribe || '',
    payload.consent || '',
    payload.signup_ts || '',
    payload.source || '',
    e.postData.contents || JSON.stringify(payload)
  ];

  sheet.appendRow(row);

  return ContentService.createTextOutput(JSON.stringify({status: 'ok'})).setMimeType(ContentService.MimeType.JSON);
}
