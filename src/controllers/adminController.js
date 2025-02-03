const db = require("../config/database"); // MySQL database connection
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Admin Login
exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const [admin] = await db.query("SELECT * FROM admin WHERE username = ?", [
      username,
    ]);
    if (admin.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found." });
    }

    const isPasswordValid = await bcrypt.compare(password, admin[0].password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password." });
    }

    const token = jwt.sign({ id: admin[0].id }, "SECRET_KEY", {
      expiresIn: "1d",
    }); // Replace SECRET_KEY with your secret
    res
      .status(200)
      .json({ success: true, message: "Login successful.", token });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error.", error: error.message });
  }
};

// Get Admin Details
exports.getAdminDetails = async (req, res) => {
  try {
    const adminId = req.user.id; // Extracted from JWT middleware
    const [admin] = await db.query("SELECT * FROM admin WHERE id = ?", [
      adminId,
    ]);

    if (admin.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found." });
    }

    res.status(200).json({ success: true, admin: admin[0] });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error.", error: error.message });
  }
};

// Update Admin Details
exports.updateAdminDetails = async (req, res) => {
  try {
    const {
      telebirr_phone_number,
      telebirr_name,
      cbe_receiver_name,
      cbe_account_number,
    } = req.body;
    const adminId = req.user.id; // Extracted from JWT middleware

    await db.query(
      "UPDATE admin SET telebirr_phone_number = ?, telebirr_name = ?, cbe_receiver_name = ?, cbe_account_number = ? WHERE id = ?",
      [
        telebirr_phone_number,
        telebirr_name,
        cbe_receiver_name,
        cbe_account_number,
        adminId,
      ]
    );

    res
      .status(200)
      .json({ success: true, message: "Admin details updated successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error.", error: error.message });
  }
};
