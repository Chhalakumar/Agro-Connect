const sendMail = require("./mailServices");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Seller = require("../models/sellerSchema");
const User = require("../models/userSchema");
const capitalizeFirstLetter = require("../helper/capitalizeFirstLetter");

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const saveAndSendVerificationOTP = async (id, type, origin) => {
  const otp = generateOTP();
  
  let Model = authModelSelector(type);
  const data = await Model.findById(id);

  // Hash OTP before storing
  var salt = await bcrypt.genSalt(10);
  data.verificationOTP = await bcrypt.hash(otp, salt);
  data.otpExpiry = Date.now() + 600000; // 10 minutes expiry

  await data.save();

  const mailHTML = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2d6a4f;">Verify Your ${capitalizeFirstLetter(type)} Account</h2>
      <p>Hello ${data.name},</p>
      <p>Your verification OTP is:</p>
      <div style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2d6a4f; border-radius: 8px; margin: 20px 0;">
        ${otp}
      </div>
      <p style="color: #666;">This OTP will expire in 10 minutes.</p>
      <p>If you didn't request this verification, please ignore this email.</p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
      <p style="color: #999; font-size: 12px;">AgroConnect - Connecting Farmers with Buyers</p>
    </div>
  `;

  const mailRes = await sendMail(
    data.email,
    mailHTML,
    `Verify your ${capitalizeFirstLetter(type)} account - OTP`
  );

  return mailRes;
};

// Keep old function for backward compatibility (optional)
const saveAndSendVerficationToken = async (id, type, origin) => {
  return await saveAndSendVerificationOTP(id, type, origin);
};

const authModelSelector = (type, res) => {
  if (type === "seller") {
    return Seller;
  } else if (type === "user") {
    return User;
  } else {
    return res.status(400).send({ message: "Invalid type" });
  }
};

const generateAccessToken = (type, id) => {
  const access_token = jwt.sign({ [type]: id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return access_token;
};

module.exports = {
  saveAndSendVerficationToken,
  saveAndSendVerificationOTP,
  authModelSelector,
  generateAccessToken,
};
