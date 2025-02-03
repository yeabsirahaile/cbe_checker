const express = require("express");
const {
  loginAdmin,
  getAdminDetails,
  updateAdminDetails,
} = require("../controllers/adminController");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

router.post("/login", loginAdmin);
router.get("/details", verifyToken, getAdminDetails);
router.put("/update", verifyToken, updateAdminDetails);

module.exports = router;
