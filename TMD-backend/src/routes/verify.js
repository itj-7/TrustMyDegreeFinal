const express = require('express');
const router = express.Router();
const { verifyCertificate } = require('../controllers/verifyController');

router.get('/:uniqueCode', verifyCertificate);

module.exports = router;