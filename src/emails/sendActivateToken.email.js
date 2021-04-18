const sgMail = require('./sgMail.email');

const sendActivateToken = (email, token) => {
  sgMail.send({
    from: process.env.SG_EMAIL,
    to: email,
    subject: 'Confirm email address',
    text: `Here is your code to confirm email: ${token}. This code will expired in 5 minutes. Keep it secretly.`,
  });
};

module.exports = sendActivateToken;
