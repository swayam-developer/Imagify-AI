import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Razorpay from "razorpay";
import TransactionModel from "../models/transactionModel.js";
import crypto from "crypto";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };
    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token, user: { name: user.name } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not found!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

      res.json({
        success: true,
        token,
        user: { name: user.name, email: user.email },
      });
    } else {
      return res.json({ success: false, message: "Invalid credentials" }); // Fix here
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const userCredits = async (req, res) => {
  try {
    const userId = req.userId; // <-- read from req.userId

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized. Login again" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json({
      success: true,
      credits: user.creditBalance,
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
const createPaymentOrder = async (req, res) => {
  try {
    const { plan } = req.body;
    console.log("Received plan:", plan); // Debug log
    const userId = req.userId;

    if (!userId || !plan) {
      return res.status(400).json({ success: false, message: "Missing details" });
    }

    let credits, amount;
    const planName = typeof plan === "string" ? plan : plan?.id || "";
    switch (planName) {
      case "Basic":
        credits = 100;
        amount = 10;
        break;
      case "Advanced":
        credits = 500;
        amount = 50;
        break;
      case "Business":
        credits = 5000;
        amount = 250;
        break;
      default:
        return res.status(400).json({ success: false, message: "Invalid plan" });
    }

    // Check for missing Razorpay credentials
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ success: false, message: "Razorpay credentials missing in environment variables" });
    }

    const orderOptions = {
      amount: amount * 100,
      currency: process.env.CURRENCY,
      receipt: `rcptid_${Date.now()}`,
    };

    let order;
    try {
      order = await razorpayInstance.orders.create(orderOptions);
    } catch (razorErr) {
      console.error("Razorpay order error:", razorErr);
      // Provide more details in the response for debugging
      return res.status(500).json({
        success: false,
        message: "Razorpay order creation failed",
        error: razorErr.error?.description || razorErr.message,
        code: razorErr.error?.code || razorErr.statusCode || "UNKNOWN",
      });
    }

    const transaction = await TransactionModel.create({
      userId,
      plan: planName,
      amount,
      credits,
      status: "created",
      razorpayOrderId: order.id,
    });

    res.json({ success: true, order, transactionId: transaction._id });
  } catch (error) {
    console.error("Payment order error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Verify payment and update user credits
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, transactionId } = req.body;
    const transaction = await TransactionModel.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    // Verify signature
    const sign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (sign !== razorpay_signature) {
      transaction.status = "failed";
      await transaction.save();
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    // Mark transaction as paid
    transaction.status = "paid";
    transaction.razorpayPaymentId = razorpay_payment_id;
    transaction.razorpaySignature = razorpay_signature;
    await transaction.save();

    // Update user credits
    await userModel.findByIdAndUpdate(transaction.userId, {
      $inc: { creditBalance: transaction.credits },
    });

    res.json({ success: true, message: "Payment verified and credits added" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export {
  registerUser,
  loginUser,
  userCredits,
  createPaymentOrder,
  verifyPayment,
};
