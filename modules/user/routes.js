const api = require('express').Router();
const controller = require('../../controllers/user');
const Middlewares = require('../../middlewares/authorization')

api.get('/user', Middlewares.validateAuthorization, controller.getLoggedInUser);
api.get('/user/:id', controller.getUserById);
api.delete('/user/:id', controller.deleteUserById);



module.exports = api;