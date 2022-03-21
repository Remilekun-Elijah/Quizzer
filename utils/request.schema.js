const joi = require('joi');

const password = joi.string().min(8).max(300).required();
const email = joi.string().email().required();
const oldPassword = joi.string().min(8).max(300).required();


// profile
const firstName = joi.string().min(3).max(100);
const lastName = joi.string().min(3).max(100);
const number = joi.string().min(11).max(100);
const avatar = joi.string().min(3).max(100);

// quiz
const title = joi.string().min(3).max(100).required();
const description = joi.string().min(3).max(1000).required();
const instruction = joi.string().min(3).max(1000)
const coverImage = joi.string().min(3).max(100);
const totalMarks = joi.number().min(1).max(1000);
const passMark = joi.number().min(1).max(500);


exports.accountSchema = joi.object({
 email,
 password,
 type: joi.string().valid('admin', 'student', 'superAdmin')
});

exports.profileSchema = joi.object({
 firstName,
 lastName,
 number,
 avatar,

});

exports.changePasswordSchema = joi.object({
  oldPassword,
  password
});