const AccountService = require('../../services/account')
const ProfileService = require('../../services/profile')

exports.getLoggedInUser = async (locals) => {
 const {
  id,
  role
 } = locals;
 const account = await AccountService.getAccountById(id);
 const profile = await ProfileService.getProfileByAccountId({
  user: id,
  role
 });
 if(account.data) {
 // ensures password related data doesn't go out
 delete account.data.password
 delete account.data.passwordArchived

 account.data.profile = profile;
 }
 return account;
}

exports.getUserById = async (req) => {
 const {
  id
 } = req.params;
 let {
  filter
 } = req.query;

 if (filter) {
  const dataRequested = filter.split(',');
  // ensures password related request doesn't come in
  filter = dataRequested.filter(item => {
   return item != 'password' && item != 'passwordArchived'
  })
 }

 const account = await AccountService.getAccountById(id, filter);
 if (account.data) {
  // ensures password related data doesn't go out
  delete account.data.password
  delete account.data.passwordArchived

  // get profile data
  const profile = await ProfileService.getProfileByAccountId({
   user: id,
   role: account.data.role
  });
  account.data.profile = profile;
 }
 return account;
}

exports.deleteUserById = async (id) => {
 const account = await AccountService.deleteAccount(id);
 return account;
}