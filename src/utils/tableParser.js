const axios = require("axios");
const cheerio = require("cheerio");

async function parseTelebirrHTML(url) {
  try {
    const response = await axios.get(url, {
      httpsAgent: new (require("https").Agent)({
        rejectUnauthorized: false, // Skip SSL for development
      }),
    });

    const $ = cheerio.load(response.data);

    // Locate the table containing receipt details
    const transactionTable = $('table:contains("የክፍያ ቁጥር/Receipt No.")'); // Find the table with receipt details

    // Extract rows from the transaction table
    const rows = transactionTable.find("tr");

    // Extract attributes and corresponding values
    let receiptNo = "";
    let paymentDate = "";
    let settledAmount = "";

    rows.each((index, row) => {
      const cells = $(row).find("td"); // Get all <td> elements in the row

      if (cells.length === 3) {
        // Check if this is the attribute row
        const firstCellText = $(cells[0]).text().trim();
        if (firstCellText.includes("የክፍያ ቁጥር/Receipt No.")) {
          // The next row contains the values
          const valueCells = rows.eq(index + 1).find("td");
          receiptNo = $(valueCells[0]).text().trim();
          paymentDate = $(valueCells[1]).text().trim();
          settledAmount = $(valueCells[2]).text().trim();
        }
      }
    });

    // Extract other fields
    const payerName = $('td:contains("የከፋይ ስም/Payer Name")')
      .next()
      .text()
      .trim();
    const receiverPhone = $(
      'td:contains("የገንዘብ ተቀባይ ቴሌብር ቁ./Credited party account no")'
    )
      .next()
      .text()
      .trim();
    const receiverName = $('td:contains("የገንዘብ ተቀባይ ስም/Credited Party name")')
      .next()
      .text()
      .trim();
    const transactionStatus = $('td:contains("የክፍያው ሁኔታ/transaction status")')
      .next()
      .text()
      .trim();

    // Return all extracted details
    return {
      payerName,
      receiverName,
      transactionStatus,
      receiptNo,
      receiverPhone,
      paymentDate,
      settledAmount,
    };
  } catch (error) {
    throw new Error("Failed to fetch or parse HTML: " + error.message);
  }
}

module.exports = parseTelebirrHTML;
