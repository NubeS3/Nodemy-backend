const sgMail = require('./sgMail.email');

const sendPurchasedNotification = (email = '', fullname = '', courseName = '') => {
  sgMail.send({
    from: process.env.SG_EMAIL,
    to: email,
    subject: `${fullname}, welcome to ${courseName}`,
    text: `Hello ${fullname}, you have purchased course ${courseName}. If you have not done this, please contact us at huaaanhminh0412@gmail.com`,
  });
};

module.exports = sendPurchasedNotification;