const express = require("express");
const router = express.Router();
const { protect, isStudent } = require("../middleware/auth");
const {
  dashboard,
  requests,
  changePassword,
} = require("../controllers/studentController");

router.get("/dashboard", dashboard, protect, isStudent);
router.post("/requests", requests, protect, isStudent);
router.put("/settings", changePassword, protect, isStudent);

module.exports = router;
