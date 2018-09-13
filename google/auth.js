const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const {
    google
} = require('googleapis');
const path = require('path');
const DEFAULT_TOKEN_PATH = path.resolve(process.cwd(), 'token.json');

// If modifying these scopes, delete token.json.
const DEFAULT_SCOPES = ['https://mail.google.com/', 'https://www.googleapis.com/auth/gmail.readonly'];

const readline = require('readline');
const {
    promisify
} = require('util');

readline.Interface.prototype.question[promisify.custom] = function (prompt) {
    return new Promise(resolve =>
        readline.Interface.prototype.question.call(this, prompt, resolve),
    );
};
readline.Interface.prototype.questionAsync = promisify(
    readline.Interface.prototype.question,
);

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 */
async function authorize(credentials, options) {
    options = Object.assign({
        tokenPath: DEFAULT_TOKEN_PATH,
        maxResults: 100
    }, options);
    const {
        client_secret,
        client_id,
        redirect_uris
    } = credentials;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
    var token = null;
    try {
        token = await readFile(options.tokenPath);
        oAuth2Client.setCredentials(JSON.parse(token));
        return oAuth2Client;
    } catch (error) {
        return await getNewToken(oAuth2Client);
    }
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 */
async function getNewToken(oAuth2Client, options) {
    options = Object.assign({
        tokenPath: DEFAULT_TOKEN_PATH,
        scopes: DEFAULT_SCOPES,
    }, options);
    const authUrl = oAuth2Client.generateAuthUrl(options);
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    const code = await rl.questionAsync('Enter the code from that page here: ');
    rl.close();
    try {
        const response = await oAuth2Client.getToken(code);
        const tokens = response.tokens;
        oAuth2Client.setCredentials(tokens);
        await writeFile(options.tokenPath, JSON.stringify(tokens));
        return oAuth2Client;
    } catch (error) {
        return console.error('Error retrieving access token', error);
    }
}

module.exports = {
    authorize,
    getNewToken,
    readline
}