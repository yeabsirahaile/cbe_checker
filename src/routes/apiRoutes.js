const express = require("express");
const {
  validateTelebirrTransaction,
} = require("../controllers/teleBirrController");
const { validateCBETransaction } = require("../controllers/cbeController");
const router = express.Router();

router.get("/telebirr/:transactionNumber", validateTelebirrTransaction);
router.get("/cbe/:transactionNumber", validateCBETransaction);

module.exports = router;
