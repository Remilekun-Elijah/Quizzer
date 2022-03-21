
const path = require('path'),
 userHandler = require(path.resolve('modules', 'user', 'handler'));

exports.getLoggedInUser = async (req, res) => {
 const user = res.locals.user;
 const account = await userHandler.getLoggedInUser(user);
 res.status(account.code).json(account);
}

exports.getUserById = async (req, res) => {
 const account = await userHandler.getUserById(req);
 res.status(account.code).json(account);
}

exports.deleteUserById = async (req, res) => {
 const {
  id
 } = req.params;
 const account = await userHandler.deleteUserById(id);
 res.status(account.code).json(account);
}