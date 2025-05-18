import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  plan: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  credits: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["created", "paid", "failed"],
    default: "created",
  },
  razorpayOrderId: {
    type: String,
  },
  razorpayPaymentId: {
    type: String,
  },
  razorpaySignature: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TransactionModel =
  mongoose.models.transaction ||
  mongoose.model("transaction", TransactionSchema);

export default TransactionModel;
