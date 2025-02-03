const axios = require("axios");
const pdfParse = require("pdf-parse");

// Utility function to extract a field by a key
const extractField = (text, fieldName) => {
  const regex = new RegExp(`${fieldName}:?\\s*(.+)`, "i"); // Match "FieldName: value"
  const match = text.match(regex);
  return match ? match[1].trim() : null;
};

// Utility function to clean the reference number, always starting with "FT"
const cleanReferenceNo = (rawReferenceNo) => {
  const match = rawReferenceNo.match(/FT.+/); // Match anything starting with "FT"
  return match ? match[0].trim() : null; // Return only the matched portion or null
};

// Parse PDF and format the data
async function parsePDF(url) {
  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
      httpsAgent: new (require("https").Agent)({
        rejectUnauthorized: false, // Bypass SSL certificate validation
      }),
    });

    const pdfBuffer = response.data;
    const parsedData = await pdfParse(pdfBuffer);
    const text = parsedData.text;

    // Extract relevant fields
    const customerName = extractField(text, "Customer Name");
    const receiver = extractField(text, "Receiver");
    const payer = extractField(text, "Payer");
    const paymentDateTime = extractField(text, "Payment Date & Time");
    const rawReferenceNo = extractField(text, "Reference No");
    const referenceNo = cleanReferenceNo(rawReferenceNo); // Clean the reference number
    const transferredAmount = extractField(text, "Transferred Amount");
    const reason = extractField(text, "Reason / Type of service");
    const receiverAccount = extractField(text, "Account1\\*\\*\\*\\*"); // Extract masked account numbers

    // Return formatted data
    return {
      referenceNo,
      payer,
      receiver,
      receiverAccount,
      paymentDateTime,
      transferredAmount,
      reason,
    };
  } catch (error) {
    throw new Error("Failed to fetch or parse PDF: " + error.message);
  }
}

module.exports = parsePDF;
