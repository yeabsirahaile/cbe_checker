const parseTelebirrHTML = require("../utils/tableParser.js");
const errorHandler = require("../utils/errorHandler");
const db = require("../config/database"); // MySQL database connection

// Helper function to convert a phone number
const convertPhoneNumber = (phoneNumber) => {
  if (phoneNumber.startsWith("0")) {
    return `251${phoneNumber.slice(1)}`; // Replace leading "0" with "251"
  }
  return phoneNumber;
};

// Helper function to convert date format
const convertToMySQLDatetime = (dateString) => {
  // Input format: DD-MM-YYYY HH:mm:ss
  const [datePart, timePart] = dateString.split(" ");
  const [day, month, year] = datePart.split("-");
  return `${year}-${month}-${day} ${timePart}`; // Output format: YYYY-MM-DD HH:mm:ss
};

exports.validateTelebirrTransaction = async (req, res) => {
  try {
    const { transactionNumber } = req.params;

    // Fetch admin details from the database
    const [adminData] = await db.query(
      "SELECT telebirr_phone_number FROM admin LIMIT 1"
    );
    if (adminData.length === 0) {
      return res.status(500).json({
        success: false,
        message: "Admin details not configured.",
      });
    }

    // Convert the telebirr phone number
    const creditedPartyAccountNo = convertPhoneNumber(
      adminData[0].telebirr_phone_number
    );

    const url = `https://transactioninfo.ethiotelecom.et/receipt/${transactionNumber}`;

    // Step 1: Check if the transaction number already exists in the database
    const [existingTransaction] = await db.query(
      "SELECT * FROM telebirr_transactions WHERE transaction_number = ?",
      [transactionNumber]
    );

    if (existingTransaction.length > 0) {
      return res.status(400).json({
        success: false,
        message: "This transaction number has already been processed.",
        transactionDetails: existingTransaction[0],
      });
    }

    // Step 2: Parse the transaction details from the Telebirr receipt
    const transactionDetails = await parseTelebirrHTML(url);

    // Step 3: Validate the receiver account number
    if (transactionDetails.receiverPhone !== creditedPartyAccountNo) {
      return res.status(400).json({
        success: false,
        message: "Receiver account number does not match.",
      });
    }

    // Step 4: Check the transaction status
    if (transactionDetails.transactionStatus !== "Completed") {
      return res.status(400).json({
        success: false,
        message: "Transaction is not completed.",
      });
    }

    // Step 5: Convert payment date to MySQL DATETIME format
    const paymentDate = convertToMySQLDatetime(transactionDetails.paymentDate);
    const { payerName } = transactionDetails;

    // Step 6: Save the transaction to the database
    await db.query(
      "INSERT INTO telebirr_transactions (transaction_number, payer_name, transaction_date) VALUES (?, ?, ?)",
      [transactionNumber, payerName, paymentDate]
    );

    // Step 7: Send the success response
    res.status(200).json({
      success: true,
      message: "Transaction successfully validated and recorded.",
      transactionDetails,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        success: false,
        message: "Transaction number already exists in the database.",
      });
    }

    // Generic error handler for unexpected errors
    errorHandler(res, error);
  }
};
