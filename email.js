require("dotenv").config();
// email process environment constants
const EMAIL_SENDER = process.env.EMAIL_SENDER;
const EMAIL_SENDER_PASSWORD = process.env.EMAIL_PASSWORD;
const EMAIL_RECIEVER = process.env.EMAIL_RECIEVER;
async function eMail(content, service, host) {}

exports.eMail = eMail;
