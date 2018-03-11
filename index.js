const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const zipObject = require('lodash/zipObject');

/**
 * Authorize client using Google Service Account
 * @param {String} credentialsPath - path to credentials JWT
 */
async function authorize(credentialsPath) {
  const credentials = credentialsPath || path.resolve(__dirname, 'credentials.json');

  return new Promise((resolve) => {
    fs.readFile(credentials, (err, contents) => {
      if (err) throw err;

      const JWT = JSON.parse(contents);
      const authClient = new google.auth.JWT(
        JWT.client_email,
        null,
        JWT.private_key,
        ['https://www.googleapis.com/auth/spreadsheets.readonly'],
      );

      authClient.authorize((errTwo) => {
        if (errTwo) throw err;
        resolve(authClient);
      });
    });
  });
}

/**
 * @param  {Array} data - Array of columns from Google Data
 */
function formatData(data) {
  const keys = data[0];
  const values = data.filter((_, index) => index !== 0);
  const result = [];

  for (let i = 0; i < values.length; i += 1) {
    result.push(zipObject(keys, values[i]));
  }

  return result;
}

function getAllData(auth, { spreadsheetId, range }) {
  return new Promise((resolve, reject) => {
    const sheets = google.sheets('v4');
    sheets.spreadsheets.values.get({
      majorDimension: 'COLUMNS',
      auth,
      spreadsheetId,
      range,
    }, (err, response) => {
      if (err) {
        console.log(`The API returned an error: ${err}`);
        reject(err);
        return;
      }
      if (response.data.values.length === 0) {
        console.log('No data found.');
        reject();
      } else {
        resolve(formatData(response.data.values));
      }
    });
  });
}

/**
 * @param {String} spreadsheetId - The ID of Spreadsheet
 * @param {String} range - Range of Cells in format: LIST_NAME!A1:Z9
 * @param {String} credentialsPath - path to credentials JWT
 * @returns {Promise<Array{}>} - Array of coins
 */
async function run({ spreadsheetId, range, credentialsPath }) {
  const auth = await authorize(credentialsPath);
  return getAllData(auth, {
    spreadsheetId,
    range,
  });
}

module.exports = run;
