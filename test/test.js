const GoogleSource = require('../');
const assert = require('assert');
const path = require('path');

describe('Google Source', () => {
  it('Resolves data without errors', async () => {
    const data = await GoogleSource({
      spreadsheetId: '1sqJjo4W6dvGhH6ktgqI0L3HtEFBokwIDLY3-DJsxhyY',
      range: 'Master!A2:ZZZ999',
      credentialsPath: path.resolve(__dirname, 'test_credentials.json'),
    });

    assert(data[0]['Project Name'] === 'Cardano');
  });
});
