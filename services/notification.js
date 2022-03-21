const Mail = require('../utils/mail');
const helper = require('../utils/helper');
const config = require('../configs/config');
const template = require('../views/templates');

class Notificaton {
 static async sendVerificationEmail(option = {}) {
  // uses jwt to hash the email
  const secure = helper.generateRememberedToken(option.to);
  // uses crypto to encrypt the jwt hash
  let encryptedLink = helper.encrypt(secure);
  const data = {
   userName: option.name || option.to,
   buttonText: "Verify Account",
   buttonLink: `${config.host}/auth/verify/?secure=${encryptedLink}`,
   header: true,
   headerText: `Welcome to ${config.application_name}`,
   text: "Welcome to our platform.",
   additionalText: "Kindly use the button below to verify your account.",
  };
  // message config
  const message = {
   from: config.gmailUser,
   to: option.to,
   subject: "Account Verification",
   body: await template.use("dynamic-template", data),
  };
  // send the mail
  await Mail.sendMail(message);
 };

 static async sendActivationMail (option = {}) {
  const data = {
   userName: option.name || option.to,
   header: false,
   headerText: `Welcome to ${config.application_name}`,
   text: `Welcome to  ${config.application_name}.`,
   additionalText: "Your account has been verified successfully.",
  };
  // message config
  const message = {
   from: config.gmailUser,
   to: option.to,
   subject: "Account Activation",
   body: await template.use("dynamic-template", data),
  };
  // send the mail
  await Mail.sendMail(message);
 };

 static async sendResetPasswordMail(option = {}) {
  try {
   // uses jwt to hash the email
   const secure = helper.generateRememberedToken(option.id);
   // uses crypto to encrypt the jwt hash
   let encryptedLink = helper.encrypt(secure);
   const data = {
    userName: option.name || option.to,
    buttonText: "Confirm Reset",
    buttonLink: `${config.host}/auth/resetPassword/confirm?secure=${encryptedLink}`,
    header: true,
    headerText: `Welcome to ${config.application_name}`,
    text: "You requested for a password reset earlier.",
    additionalText: "Kindly use the button below to confirm your request.",
   };
   // message config
   const message = {
    from: config.gmailUser,
    to: option.to,
    subject: "Password Reset",
    body: await template.use("dynamic-template", data)
   };
   /* send the mail */
   await Mail.sendMail(message);

  } catch (e) {
   throw e;
  }
 };

 

 static async sendAccountDeletedEmail(option = {}) {
  try {
   const data = {
    userName: option.name || option.to,
    header: true,
    headerText: `Account Deleted`,
    text: "Your account has been deleted successfully.",
    additionalText: "Thank you for using our platform.",
   };
   // message config
   const message = {
    from: config.gmailUser,
    to: option.to,
    subject: "Account Deletion",
    body: await template.use("dynamic-template", data)
   };
   /* send the mail */
   await Mail.sendMail(message);

  } catch (e) {
   throw e;
  }
 }
}

module.exports = Notificaton;