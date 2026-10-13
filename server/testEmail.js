const sendMail = require("./services/mailServices");
require("dotenv").config();

const testEmail = async () => {
  console.log("🧪 Testing email service...\n");
  console.log("Gmail ID:", process.env.GMAIL_ID);
  console.log("Email:", process.env.EMAIL);
  console.log("App Password:", process.env.APP_PASSWORD ? "✅ Set" : "❌ Not set");
  
  const testOTP = "123456";
  
  const mailHTML = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2d6a4f;">Test OTP Email - AgroConnect</h2>
      <p>Hello,</p>
      <p>This is a test email. Your OTP is:</p>
      <div style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2d6a4f; border-radius: 8px; margin: 20px 0;">
        ${testOTP}
      </div>
      <p style="color: #666;">This is a test OTP.</p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
      <p style="color: #999; font-size: 12px;">AgroConnect - Connecting Farmers with Buyers</p>
    </div>
  `;

  const result = await sendMail(
    process.env.EMAIL, // Send to yourself for testing
    mailHTML,
    "Test OTP Email - AgroConnect"
  );

  if (result) {
    console.log("\n✅ Email test successful! Check your inbox.");
  } else {
    console.log("\n❌ Email test failed. Check the error above.");
  }
};

testEmail();
