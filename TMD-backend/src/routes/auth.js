const express = require('express');
const router = express.Router();
const { login, changePassword, seedSuperAdmin } = require('../controllers/authController');

router.post('/login', login);
router.put('/change-password', changePassword);
router.post('/seed-super-admin', seedSuperAdmin);

module.exports = router;