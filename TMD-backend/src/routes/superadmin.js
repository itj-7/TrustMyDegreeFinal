
const express = require('express');
const router = express.Router();
const { getAdmins, createAdmin, deleteAdmin } = require('../controllers/superadminController');
const { protect, isSuperAdmin } = require('../middleware/auth');

router.get('/admins', protect, isSuperAdmin, getAdmins);
router.post('/admins', protect, isSuperAdmin, createAdmin);
router.delete('/admins/:id', protect, isSuperAdmin, deleteAdmin);

module.exports = router;  
