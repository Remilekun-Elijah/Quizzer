const path = require('path');
const AccountService = require(path.resolve('services', 'account'));

exports.createUser = async (body) => {
  const {
    email,
    password,
    type
  } = body;
  
  const account = await AccountService.createAccount({
    email,
    password,
    type
  });

    return account;
}

exports.login = async (body) => {
  const data = await AccountService.login(body);
  return data;
}


exports.resendVerificationEmail = async (id) => {

  const result = await AccountService.resendVerificationEmail(id);
  return result;
}

exports.verifyAccount = async (secure) => {

  const result = await AccountService.verifyAccount(secure);
  return result;
}

exports.changePassword = async (id, body) => {


  const result = await AccountService.changePassword(id, body);
  return result;
}