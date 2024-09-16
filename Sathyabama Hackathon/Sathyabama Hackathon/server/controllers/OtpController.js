let otpStore = require('./AdminController').otpStore;


const verifyOtp = async (req, res) => {
  const { otp, email } = req.body;

  try {
      if (otpStore[email] && otpStore[email] === otp) {
      delete otpStore[email];

      res.status(200).json({ message: "OTP Verified Successfully" });
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("OTP Verification Error:", error);
    res.status(500).json({ message: "Error verifying OTP", error: error.message });
  }
};

module.exports = { verifyOtp };
