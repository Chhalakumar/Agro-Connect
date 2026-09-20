const nodemailer = require("nodemailer");

const sendMail = async (receiverEmailAddress, content, subject) => {
  const userEmail = receiverEmailAddress;

  let config = {
    service: "gmail",
    auth: {
      user: process.env.GMAIL_ID,
      pass: process.env.APP_PASSWORD,
    },
  };

  let transporter = nodemailer.createTransport(config);

  let message = {
    from: process.env.EMAIL,
    to: userEmail,
    subject: subject,
    html: content,
  };

  try {
    const info = await transporter.sendMail(message);
    console.log("✅ Email sent successfully");
    console.log("📧 Message ID:", info.messageId);
    console.log("📬 To:", userEmail);
    return true;
  } catch (error) {
    console.log("❌ Email sending failed:");
    console.log("Error Code:", error.code);
    console.log("Error Message:", error.message);
    console.log("Full Error:", error);
    return false;
  }
};

module.exports = sendMail;
