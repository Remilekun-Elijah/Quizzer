const path = require('path');
const AccountModel = require(path.resolve('modules/account/model'));
const helper = require('../utils/helper');
const responseCode = require(path.resolve('utils', 'http.response.code'));
const responseMessage = require(path.resolve('utils', 'http.response.message'));
const NotificationService = require(path.resolve('services', 'notification'));
const {
  accountSchema,
  changePasswordSchema
} = require(path.resolve('utils', 'request.schema'));
const ApiResponse = require(path.resolve(path.resolve('utils', 'http.response')));
const validator = require(path.resolve('utils', 'validator'));

const Profile = require("./profile")
class Account {

  static async getAccountById(id, filter) {
    const account = await AccountModel.findById(id);
    if (account) {
      const result = filter ? helper.filter(account._doc, filter) : account._doc;

      // return result;
      return ApiResponse.gen(responseCode.HTTP_OK, responseMessage.ACCOUNT_RETRIEVED, result);
    }
    return ApiResponse.gen(responseCode.HTTP_NOT_FOUND, responseMessage.ACCOUNT_NOT_FOUND);
  }

  static async getAccountByEmail(email, filter) {

    const account = await AccountModel.findOne({
      email
    });
    if (account) {
      const result = filter ? helper.filter(account._doc, filter) : account._doc;
      return result;
    }
    return null;
  }

  static async createAccount({
    email,
    password,
    type
  }) {
    try {
      const valid = await validator(accountSchema, {
        email,
        password,
        type
      });

      if (valid.ok) {
        const user = await this.getAccountByEmail(email);
        if (!user) {
          const passwordArchived = [];
          password = helper.hashPassword(password);

          const account = await AccountModel.create({
            email,
            password,
            role: type,
            passwordArchived
          });

          // setup profile
          const profile = await Profile.setUpProfile(account._id, type);
          logger.info(profile)
          // send notification
          await NotificationService.sendVerificationEmail({
            to: email
          });
          const res = ApiResponse.gen(responseCode.HTTP_CREATED, responseMessage.ACCOUNT_CREATED);
          return res;

        } else {
          const res = ApiResponse.gen(responseCode.HTTP_CONFLICT, responseMessage.ACCOUNT_ALREADY_EXISTS);
          return res;
        }
      } else {
        return valid;
      }
    } catch (err) {
      logger.error(err);
      return ApiResponse.gen(responseCode.HTTP_INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR);
    }
  }

  static async login({
    email,
    password
  }) {
    const valid = await validator(accountSchema, {
      email,
      password
    });

    if (valid.ok) {
      const userInfo = await this.getAccountByEmail(email)
      if (userInfo) {
        const passwordMatches = helper.comparePassword(userInfo.password, password)
        if (passwordMatches) {
          const token = helper.generateUserToken(userInfo._id, userInfo.role);
          // logger.info("token", token)
          return ApiResponse.gen(responseCode.HTTP_OK, responseMessage.ACCOUNT_LOGGED_IN, token)
        }
        return ApiResponse.gen(responseCode.HTTP_BAD_REQUEST, responseMessage.PASSWORD_INCORRECT)
      }
      return ApiResponse.gen(responseCode.HTTP_NOT_FOUND, responseMessage.ACCOUNT_NOT_FOUND)
    } else {
      return valid;
    }
  }

  static async updateAccount(id, data) {
    try {
      const valid = await validator(accountSchema, data);
      if (valid.ok) {
        const account = await Profile.updateProfileById(id, valid.data);

        if (account) return ApiResponse.success(responseCode.HTTP_OK, responseMessage.ACCOUNT_UPDATED, account);
        return ApiResponse.gen(responseCode.HTTP_INTERNAL_SERVER_ERROR, responseMessage.ACCOUNT_UPDATED_FAILED);
      } else {
        return valid;
      }
    } catch (err) {
      logger.error(err);
      return ApiResponse.gen(responseCode.HTTP_INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR);
    }
  }

  static async deleteAccount(id) {
    try {
      const account = await AccountModel.findByIdAndDelete(id);
      if (account) {

        const profile = await Profile.deleteProfile({
          user: id,
          role: account._doc.role
        });
        account._doc.profile = profile;
        // send notification
        await NotificationService.sendAccountDeletedEmail({
          to: account.email
        });
        return ApiResponse.gen(responseCode.HTTP_OK, responseMessage.ACCOUNT_DELETED);
      }
      return ApiResponse.gen(responseCode.HTTP_NOT_FOUND, responseMessage.ACCOUNT_NOT_FOUND);
    } catch (err) {
      logger.error(err);
      return ApiResponse.gen(responseCode.HTTP_INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR);
    }
  }

  static async resendVerificationEmail(id) {
    try {
      const {data} = this.getAccountById(id)
      // const account = await this.getAccountByEmail(data.email);
      if (data) {
        // send notification
        await NotificationService.sendVerificationEmail({
          to: data.email
        });

        return ApiResponse.gen(responseCode.HTTP_OK, responseMessage.VERIFICATION_EMAIL_SENT);
      }
      return ApiResponse.gen(responseCode.HTTP_NOT_FOUND, responseMessage.ACCOUNT_NOT_FOUND);
    } catch (err) {
      logger.error(err);
      return ApiResponse.gen(responseCode.HTTP_INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR);
    }
  }

  static async verifyAccount(secure) {
    try {
      const token = helper.decrypt(secure);
      const user = helper.verifyToken(token);

      if (token) {
        const account = await this.getAccountByEmail(user.id);

        if (account) {
          if (account.status == 'active') {
            return ApiResponse.gen(responseCode.HTTP_BAD_REQUEST, responseMessage.ACCOUNT_ALREADY_VERIFIED);
          } else {
            account.status = 'active';
            const data = await AccountModel.findByIdAndUpdate(account._id, account);
            return ApiResponse.gen(responseCode.HTTP_OK, responseMessage.ACCOUNT_VERIFIED, data);
          }
        }
        return ApiResponse.gen(responseCode.HTTP_NOT_FOUND, responseMessage.ACCOUNT_NOT_FOUND);
      }
    } catch (err) {
      logger.error(err);
      return ApiResponse.gen(responseCode.HTTP_INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR);
    }
  }

  static async changePassword(id, data) {
    
    const valid = await validator(changePasswordSchema, data);
    if (valid.ok) {
      const account = await AccountModel.findById(id);
      if (account) {
        const passwordMatches = helper.comparePassword(account.password, data.oldPassword);
        if (!passwordMatches) {
          const msg = `Old ${responseMessage.PASSWORD_INCORRECT.toLowerCase()}`;
          return ApiResponse.gen(responseCode.HTTP_BAD_REQUEST, msg);
        }

        let isUsedPassword = false;
        for (let oldPass of account.passwordArchived){
          logger.info(helper.decrypt(oldPass) === data.oldPassword)
          if(helper.decrypt(oldPass) == data.oldPassword) isUsedPassword = true;
        }
        if (isUsedPassword) {
          return ApiResponse.gen(responseCode.HTTP_BAD_REQUEST, responseMessage.OLD_PASSWORD_ALREADY_USED);
        } else {
          const passwordArchived = [...account.passwordArchived, helper.encrypt(data.oldPassword)];
          const password = helper.hashPassword(data.password);
          const result = await AccountModel.findByIdAndUpdate(id, {
            password,
            passwordArchived
          });
          return ApiResponse.gen(responseCode.HTTP_OK, responseMessage.PASSWORD_CHANGED);
        }
      }
      return ApiResponse.gen(responseCode.HTTP_NOT_FOUND, responseMessage.ACCOUNT_NOT_FOUND);
    } 
    return valid;
  }
}

module.exports = Account;