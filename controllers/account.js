const path = require('path'),
 accountHandler = require(path.resolve('modules', 'account', 'handler'));

exports.createUser = async (req, res) => {

 const account = await accountHandler.createUser(req.body);
 res.status(account.code).json(account);
}

exports.login = async (req, res) => {
 const data = await accountHandler.login(req.body);
 res.status(data.code).json(data);
}

exports.resendVerificationEmail = async (req, res) => {
const { id } = req.locals;
 const result = await accountHandler.resendVerificationEmail(id);
 res.status(result.code).json(result);
}

exports.verifyAccount = async (req, res) => {
 const secure = req.query.secure;
 const result = await accountHandler.verifyAccount(secure);
 res.status(result.code).json(result);
}

exports.changePassword = async (req, res) => {
 const {
  id
 } = res.locals.user;

 const result = await accountHandler.changePassword(id, req.body);
 res.status(result.code).json(result);
}