import Razorpay from "razorpay";
import TransactionModel from "../models/transactionModel.js";
import userModel from "../models/userModel.js";
import crypto from "crypto";

// Create Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Plans config
const plans = {
  Basic: { credits: 100, amount: 10 },
  Advanced: { credits: 500, amount: 50 },
  Business: { credits: 5000, amount: 250 },
};

// Create order for credit purchase
export const createCreditOrder = async (req, res) => {
  try {
    const { plan } = req.body;
    const userId = req.userId;

    if (!userId || !plan || !plans[plan]) {
      return res.status(400).json({ success: false, message: "Invalid plan or user" });
    }

    const { credits, amount } = plans[plan];

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: process.env.CURRENCY,
      receipt: `credit_${userId}_${Date.now()}`,
    });

    const transaction = await TransactionModel.create({
      userId,
      plan,
      amount,
      credits,
      status: "created",
      razorpayOrderId: order.id,
    });

    res.json({ success: true, order, transactionId: transaction._id });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ success: false, message: "Failed to create order" });
  }
};

// Verify payment and update credits
export const verifyCreditPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, transactionId } = req.body;
    const transaction = await TransactionModel.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    // Signature verification
    const sign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (sign !== razorpay_signature) {
      transaction.status = "failed";
      await transaction.save();
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    // Mark as paid and update credits
    transaction.status = "paid";
    transaction.razorpayPaymentId = razorpay_payment_id;
    transaction.razorpaySignature = razorpay_signature;
    await transaction.save();

    await userModel.findByIdAndUpdate(transaction.userId, {
      $inc: { creditBalance: transaction.credits },
    });

    res.json({ success: true, message: "Credits added successfully" });
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({ success: false, message: "Failed to verify payment" });
  }
};
