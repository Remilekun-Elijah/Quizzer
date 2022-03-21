const path = require('path');
const {
 adminProfileModel,
 userProfileModel
} = require('../modules/profile/model');
const helper = require('../utils/helper');
const {
 SUPERADMIN,
 ADMIN,
 STUDENT
} = require('../utils/role');

const {
 profileSchema
} = require(path.resolve('utils', 'request.schema'));
const responseCode = require(path.resolve('utils', 'http.response.code'));
const responseMessage = require(path.resolve('utils', 'http.response.message'));
const ApiResponse = require(path.resolve(path.resolve('utils', 'http.response')));
const validator = require(path.resolve('utils', 'validator'));

class Profile {
 /**
  * @description Setup user profile by the user id
  * @param {string} user - The user id
  * @param {string} role - The role of the user
  * @returns {object} The user profile
  */
 static async setUpProfile(user, role) {
  const profile = [SUPERADMIN, ADMIN].includes(role) ? adminProfileModel : userProfileModel,
   createdProfile = await profile.create({
    user
   });

  return createdProfile
 }

 /**
  * @description Get user profile by the user id
  * @param {string} user - The user id
  * @param {array} filter - The filter to be applied
  * @returns {object} The user profile
  */
 static async getProfileByAccountId({
  user,
  role,
  filter
 }) {
  if (role === STUDENT) {
   const profile = await adminProfileModel.findOne({
    user
   });
   if (profile) {
    const result = filter ? helper.filter(profile._doc, filter) : profile._doc;
    return result;
   }
   return null;
  } else if ([SUPERADMIN, ADMIN].includes(role)) {
   const profile = await adminProfileModel.create({
    user
   });
   if (profile) {
    const result = filter ? helper.filter(profile._doc, filter) : profile._doc;
    return result;
   }
   return null;
  }
 }

 /**
  * @description Updates user profile by the user id
  * @param {string} id - The user id
  * @param {object} data - The data to be updated
  * @returns {object} The updated user profile
  */
 static async updateProfileById(id, data) {
  if (data) {
   const valid = await validator(profileSchema, data);
   if (valid.ok) {
    const profile = await ProfileModel.findByIdAndUpdate(id, {
     $set: data
    });
    if (profile) return ApiResponse.success(responseCode.HTTP_OK, responseMessage.PROFILE_UPDATED, profile);
    return ApiResponse.gen(responseCode.HTTP_INTERNAL_SERVER_ERROR, responseMessage.PROFILE_UPDATED_FAILED);
   } else {
    return valid;
   }
  } else {
   return ApiResponse.gen(responseCode.HTTP_BAD_REQUEST, responseMessage.PROFILE_UPDATED_FAILED);
  }
 }

 /**
  * @description Deletes user profile by the user id
  * @param {string} id - The user id
  * @returns {object} The deleted user profile
  */
 static async deleteProfile({
  user,
  role
 }) {
  if (role === STUDENT) {
   const profile = await userProfileModel.findOneAndDelete({
    user
   });
   return profile;
  } else if ([SUPERADMIN, ADMIN].includes(role)) {
   const profile = await adminProfileModel.findOneAndDelete({
    user
   });
   return profile._doc;
  }
 }
}

module.exports = Profile;