# Google Spreadsheet source

This package aims to fetch data from Cointel Google Table.

Example usage:

```
const getAllCoins = require('@cointel/SpreadSheetSource');

getAllCoins({
  spreadsheetId: '1sqJjo4W6dvGhH6ktgqI0L3HtEFBokwIDLY3-DJsxhyY',
  range: 'Master!A2:ZZZ999',
  credentialsPath: path.resolve(__dirname, 'test_credentials.json'),
});

```

## Test

```
npm test
```