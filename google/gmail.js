const {
    google
} = require('googleapis');

// Load client secrets from a local file.
function makeBody(to, from, subject, message) {
    var str = ["Content-Type: text/plain; charset=\"UTF-8\"\n",
        "MIME-Version: 1.0\n",
        "Content-Transfer-Encoding: 7bit\n",
        "to: ", to, "\n",
        "from: ", from, "\n",
        "subject: ", subject, "\n\n",
        message
    ].join('');

    var encodedMail = new Buffer(str).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
    return encodedMail;
}

/**
 *
 *
 * @param {*} credentials
 * @param {*} options
 * @returns
 */
async function listMessages(options) {
    options = Object.assign({
        userId: 'me',
        maxResults: 100
    }, options);
    const gmail = google.gmail({
        version: 'v1',
        auth: options.auth
    });
    try {
        return await gmail.users.messages.list(options);
    } catch (error) {
        console.error(error);
    }
}

async function getMessage(options) {
    options = Object.assign({
        userId: 'me',
        format: 'full'
    }, options);
    const gmail = google.gmail({
        version: 'v1',
        auth: options.auth
    });
    return await gmail.users.messages.get(options);
}

module.exports = {
    makeBody,
    listMessages,
    getMessage
}