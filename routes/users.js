const router = require('express').Router();
const { signup, login, logout } = require("../../controllers/users");



router.route('/users/login').post(login);
router.route('/users/signup').post(signup);
router.route('/users/logout').post(logout);
module.exports = router;
