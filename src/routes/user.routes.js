const express = require('express');
const auth = require('../middleware/auth');
const urlRoutes = express.Router();

const controller = require('../controllers/user.controller');

urlRoutes.get('/requestToken', controller.generateToken);
urlRoutes.get('/', auth(), controller.getAll);
urlRoutes.post('/', auth(), controller.create);
urlRoutes.get('/:id', auth(), controller.read);
urlRoutes.get('/accountNumber/:id', auth(), controller.getByAccountNumber);
urlRoutes.get('/identityNumber/:id', auth(), controller.getByIdentityNumber);
urlRoutes.put('/:id', auth(), controller.update);
urlRoutes.delete('/:id', auth(), controller.delete);

module.exports = urlRoutes;

