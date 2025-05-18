import express from "express";
import { createPaymentOrder, verifyPayment } from "../controllers/userController.js";
import userAuth from "../middleware/auth.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-order", userAuth, createPaymentOrder);
paymentRouter.post("/verify-payment", userAuth, verifyPayment);

export default paymentRouter;
