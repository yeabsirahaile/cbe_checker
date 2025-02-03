const { verify } = require("@jvhaile/cbe-verifier");
const errorHandler = require("../utils/errorHandler");
const db = require("../config/database"); // MySQL database connection

exports.validateCBETransaction = async (req, res) => {
  try {
    const { transactionNumber } = req.params;

    // Fetch admin details from the database
    const [adminData] = await db.query(
      "SELECT cbe_account_number, cbe_receiver_name FROM admin LIMIT 1"
    );
    if (adminData.length === 0) {
      return res.status(500).json({
        success: false,
        message: "Admin details not configured.",
      });
    }

    let { cbe_account_number, cbe_receiver_name } = adminData[0];

    // Remove leading zeros after "1"
    cbe_account_number = cbe_account_number.replace(/^10+/, ""); // Removes "1" and any following zeros

    // Use the CBE Verifier library to verify the transaction
    const verificationResult = await verify({
      transactionId: transactionNumber,
      accountNumberOfSenderOrReceiver: cbe_account_number,
      cbeVerificationUrl: "https://apps.cbe.com.et:100/", // Update if necessary
    });

    if (verificationResult.isLeft()) {
      return res.status(400).json({
        success: false,
        message: "Transaction verification failed.",
        error: verificationResult.value,
      });
    }

    const transactionDetails = verificationResult.value;

    // Step 2: Validate the receiver name (case-insensitive)
    if (
      transactionDetails.receiver.toLowerCase() !==
      cbe_receiver_name.toLowerCase()
    ) {
      return res.status(400).json({
        success: false,
        message: "Receiver account name does not match.",
      });
    }

    // Step 3: Check the database for duplicate transactions
    const [existingTransaction] = await db.query(
      "SELECT * FROM cbe_transactions WHERE reference_no = ?",
      [transactionDetails.reference]
    );

    if (existingTransaction.length > 0) {
      return res.status(400).json({
        success: false,
        message: "This transaction has already been processed.",
        transactionDetails: existingTransaction[0],
      });
    }

    // Step 4: Save the validated transaction to the database
    await db.query(
      "INSERT INTO cbe_transactions (reference_no, receiver, payer, receiver_account, payment_date, transferred_amount) VALUES (?, ?, ?, ?, ?, ?)",
      [
        transactionDetails.reference,
        transactionDetails.receiver,
        transactionDetails.payer,
        transactionDetails.receiverAccount,
        new Date(transactionDetails.date), // Convert date to a Date object
        transactionDetails.amount,
      ]
    );

    // Step 5: Return the success response
    res.status(200).json({
      success: true,
      message: "Transaction successfully validated and recorded.",
      transactionDetails,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};
