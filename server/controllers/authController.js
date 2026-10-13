const capitalizeFirstLetter = require("../helper/capitalizeFirstLetter");
const {
  saveAndSendVerficationToken,
  authModelSelector,
  generateAccessToken,
} = require("../services/authServices");
const { setCookie } = require("../services/cookieServices");
const bcrypt = require("bcryptjs");

// SignUp
const signup = async (req, res) => {
  let type = req.params.type.toLowerCase();
  try {
    let Model = authModelSelector(type, res);

    let data = Model(req.body);

    let salt = await bcrypt.genSalt(8);
    data.password = await bcrypt.hash(data.password, salt);

    let result = await data.save();

    const isMailSentSuccessful = await saveAndSendVerficationToken(
      result._id.toString(),
      type,
      req.get("Origin")
    );
    if (isMailSentSuccessful) {
      return res.status(200).send({
        message: `${capitalizeFirstLetter(
          type
        )} account created. A 6-digit OTP has been sent to your email. Please verify to login.`,
        email: req.body.email,
      });
    } else {
      return res.status(200).send({
        message: `${capitalizeFirstLetter(
          type
        )} account created. However, we couldn't send the OTP. You can verify your account during login.`,
        email: req.body.email,
      });
    }
  } catch (error) {
    if (error.code === 11000) {
      if (error.keyPattern.email || error.keyPattern.contact) {
        return res.status(400).send({
          message: `${capitalizeFirstLetter(
            type
          )} with this email or phone number already exists`,
        });
      } else if (type === "seller" && error.keyPattern.brandName) {
        return res
          .status(409)
          .send({ message: "This brand name already exists" });
      }
    }

    res.status(500).send({ message: "Something went wrong!" });
    console.log(error);
  }
};

// Login
const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    let type = req.params.type.toLowerCase();

    let Model = authModelSelector(type, res);

    let data = await Model.findOne({ email }).select(
      `password isVerified ${type === "seller" && "brandName"}`
    );

    if (!data) {
      res.status(404);
      return res.send({ message: `${capitalizeFirstLetter(type)} not found` });
    }

    let isPasswordMatched = await bcrypt.compare(password, data.password);

    if (!isPasswordMatched) {
      return res.status(401).send({ message: "Incorrect password" });
    } else {
      if (!data.isVerified) {
        const isMailSentSuccessful = await saveAndSendVerficationToken(
          data._id.toString(),
          type,
          req.get("Origin")
        );
        if (!isMailSentSuccessful) {
          return res.status(200).send({
            message: `${capitalizeFirstLetter(
              type
            )} account not verified. We couldn't send the OTP. Please try again later. If this issue persists, contact the developer.`,
            requiresVerification: true,
            email: email,
          });
        } else {
          return res.status(200).send({
            message: `${capitalizeFirstLetter(
              type
            )} account not verified. We've sent a 6-digit OTP to your email. Please verify to login.`,
            requiresVerification: true,
            email: email,
          });
        }
      }

      // setCookie(
      //   res,
      //   `${type}_access_token`,
      //   generateAccessToken(type, data._id.toString())
      // );

      // if (type === "seller") {
      //   setCookie(res, "brandName", data.brandName);
      // }

      return res.status(200).send({
        message: `${capitalizeFirstLetter(type)} login successful`,
        cookies: {
          [`${type}_access_token`]: generateAccessToken(
            type,
            data._id.toString()
          ),
          ...(type === "seller" && { brandName: data.brandName }),
        },
      });
    }
  } catch (error) {
    res.status(500).send({ message: "Something went wrong!" });
    console.log(error);
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const type = req.params.type.toLowerCase();

    if (!email || !otp) {
      return res.status(400).send({ message: "Email and OTP are required" });
    }

    let Model = authModelSelector(type, res);
    if (!Model) return res.status(400).send({ message: "Invalid type" });

    // Find user/seller by email
    const data = await Model.findOne({ email }).select(
      `isVerified verificationOTP otpExpiry email name ${type === "seller" ? "brandName" : ""}`
    );

    // User not found
    if (!data) {
      return res.status(404).send({ 
        message: `${capitalizeFirstLetter(type)} not found` 
      });
    }

    // Already verified
    if (data.isVerified) {
      return res.status(409).send({ 
        message: "Account already verified. You can login now." 
      });
    }

    // Check if OTP exists
    if (!data.verificationOTP || !data.otpExpiry) {
      return res.status(400).send({ 
        message: "No OTP found. Please request a new OTP by trying to login." 
      });
    }

    // Check if OTP expired
    const isOTPExpired = data.otpExpiry < Date.now();
    if (isOTPExpired) {
      return res.status(403).send({ 
        message: "OTP has expired. Please login again to receive a new OTP." 
      });
    }

    // Verify OTP
    const isOTPValid = await bcrypt.compare(otp, data.verificationOTP);
    if (!isOTPValid) {
      return res.status(401).send({ 
        message: "Invalid OTP. Please check and try again." 
      });
    }

    // Mark as verified and clear OTP
    await Model.findByIdAndUpdate(data._id, { 
      isVerified: true,
      verificationOTP: null,
      otpExpiry: null,
      verificationToken: null,
      verificationTokenExpiry: null
    });

    // Generate access token for automatic login
    const accessToken = generateAccessToken(type, data._id.toString());

    console.log(`✅ ${capitalizeFirstLetter(type)} account verified via OTP: ${data.email}`);

    return res.status(200).send({
      message: `${capitalizeFirstLetter(type)} account verified successfully! You are now logged in.`,
      cookies: {
        [`${type}_access_token`]: accessToken,
        ...(type === "seller" && { brandName: data.brandName }),
      },
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).send({ message: "Something went wrong during OTP verification. Please try again." });
  }
};

const verifyToken = async (req, res) => {
  try {
    const verificationToken = decodeURIComponent(req.params.token).toString();
    const type = req.params.type.toLowerCase();

    let Model = authModelSelector(type, res);

    if (!Model) return res.status(400).send({ message: "Invalid type" });

    // Find user/seller by verification token
    const data = await Model.findOne({
      verificationToken: verificationToken,
    }).select(
      `isVerified verificationTokenExpiry email name ${type === "seller" ? "brandName" : ""}`
    );

    // Token not found
    if (!data) {
      return res.status(404).send({ 
        message: "Invalid or expired verification link. Please request a new one by trying to login." 
      });
    }

    // Already verified
    if (data.isVerified) {
      return res.status(409).send({ 
        message: "Account already verified. You can login now." 
      });
    }

    // Check if token expired
    const isTokenExpired = data.verificationTokenExpiry < Date.now();
    if (isTokenExpired) {
      return res.status(403).send({ 
        message: "Verification link has expired. Please login again to receive a new verification email." 
      });
    }

    // Mark as verified and clear verification token
    await Model.findByIdAndUpdate(data._id, { 
      isVerified: true,
      verificationToken: null,
      verificationTokenExpiry: null
    });

    // Generate access token for automatic login
    const accessToken = generateAccessToken(type, data._id.toString());

    console.log(`✅ ${capitalizeFirstLetter(type)} account verified: ${data.email}`);

    return res.status(200).send({
      message: `${capitalizeFirstLetter(type)} account verified successfully! You are now logged in.`,
      cookies: {
        [`${type}_access_token`]: accessToken,
        ...(type === "seller" && { brandName: data.brandName }),
      },
    });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).send({ message: "Something went wrong during verification. Please try again." });
  }
};

module.exports = {
  verifyToken,
  verifyOTP,
  login,
  signup,
};
