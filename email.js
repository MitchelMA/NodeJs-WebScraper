require("dotenv").config();
const nodemailer = require("nodemailer");
// email process environment constants
const EMAIL_SENDER = process.env.EMAIL_SENDER;
const EMAIL_SENDER_PASSWORD = process.env.EMAIL_PASSWORD;
const EMAIL_RECIEVER = process.env.EMAIL_RECIEVER;
async function eMail(content, service, host) {
  let transport = nodemailer.createTransport({
    service: service,
    host: host,
    auth: {
      user: EMAIL_SENDER,
      pass: EMAIL_SENDER_PASSWORD,
    },
  });

  console.log(content.newItems.length);
  let subject;
  if (content.newItems.length > 1) {
    subject = content.newItems.length + " nieuwe producten gevonden";
  } else {
    subject = "1 nieuw product gevonden";
  }

  let html = `Er is gescrapet op deze <a href="${content.query}" >pagina</a>: <ol>`;
  for (let i = 0; i < content.newItems.length; i++) {
    html += `<li><p><a href="${content.newItems[i].hyperlink}">${content.newItems[i].title}</a> voor ${content.newItems[i].price} sinds ${content.newItems[i].listingDate}</p></li>`;
  }
  html += "</ol>";

  let mailOptions = {
    from: EMAIL_SENDER,
    to: EMAIL_RECIEVER,
    subject: subject,
    html: html,
  };

  let info = await transport.sendMail(mailOptions);
  console.log("Mail verzonden: %s", info.messageId);
}

exports.eMail = eMail;
