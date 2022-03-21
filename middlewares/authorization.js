const helper = require("../utils/helper");
const {
 getAccountById
} = require("../services/account");
const responseMessage = require("../utils/http.response.message");
const responseCode = require("../utils/http.response.code");
const ApiResponse = require("../utils/http.response");
const {
 getRole
} = require("../modules/user/model");

exports.validateAuthorization = (req, res, next) => {
 const token = req.headers.authorization;
 if (token) {
  const isVerified = helper.verifyToken(token);

  if (isVerified === "token_expired" || isVerified === "invalid_signature") {
   const data = ApiResponse.gen(responseCode.HTTP_UNAUTHORIZED, responseMessage.UNAUTHORIZED);
  return res.status(data.code).json(data);
  } else {
   res.locals.user = isVerified;
   next();
  }
 } else {
  const data = ApiResponse.gen(responseCode.HTTP_BAD_REQUEST, responseMessage.NO_TOKEN);
  return res.status(data.code).json(data);
 }
};

exports.validateAdmin = async (req, res, next) => {
 const {
  role
 } = res.locals.user;
 // Get the role of the user
 // const {
 //  data
 // } = await getAccountById(id, ['role']);
 // const {
 //  role
 // } = data;
 // Check if role is user
 if (role !== "admin" || role !== "superAdmin") {
  // Deny access to the route
  const data = ApiResponse.gen(responseCode.HTTP_FORBIDDEN, responseMessage.ACCESS_DENIED);
  return res.status(data.code).json(data);
 }
 next();
};