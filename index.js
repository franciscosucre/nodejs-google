const fs = require('fs');
const {
  listMessages
} = require('./google/gmail');
const {
  authorize
} = require('./google/auth');
const path = require('path');
// If modifying these scopes, delete token.json.
const CREDENTIAL_PATH = path.resolve(process.cwd(), 'credentials.json');

// Load client secrets from a local file.
fs.readFile(CREDENTIAL_PATH, (err, credentials) => {
  console.log(JSON.parse(credentials))
  credentials = JSON.parse(credentials)
  authorize(credentials.installed).then((auth) => {
    listMessages({
      auth: auth,
    }).then((value) => {
      console.log(value.data)
    })
  });

});