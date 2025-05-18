import React, { useContext } from "react";
import { assets, plans } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const BuyCredit = () => {
  const { user, backendUrl, loadCreditsData, token, setShowLogin } =
    useContext(AppContext);

  const navigate = useNavigate();

  const initPay = async (order, transactionId) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "AI Image Generator",
      description: "Buy credits",
      order_id: order.id,
      handler: async function (response) {
        try {
          // Verify payment on backend
          const { data } = await axios.post(
            backendUrl + "/api/payment/verify-payment",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              transactionId,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (data.success) {
            toast.success("Payment successful! Credits added.");
            loadCreditsData();
            navigate("/"); // Navigate to home after successful payment
          } else {
            toast.error(data.message || "Payment verification failed");
          }
        } catch (err) {
          toast.error("Payment verification failed");
        }
      },
      prefill: {
        name: user?.name,
        email: user?.email,
      },
      theme: { color: "#6366f1" },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const paymentRazorpay = async (plan) => {
    try {
      if (!user) {
        setShowLogin(true);
        return; // Prevent further execution and error toasts if not logged in
      }
      const { data } = await axios.post(
        backendUrl + "/api/payment/create-order",
        { plan },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.success) {
        initPay(data.order, data.transactionId);
      } else {
        toast.error(data.message || "Payment initialization failed");
      }
    } catch (error) {
      // Only show error toast if user is logged in
      if (user) {
        toast.error(error?.response?.data?.message || error.message);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="min-h-[80vh] text-center pt-14 mb-10"
    >
      <button className="border border-gray-400 px-10 py-2 rounded-full mb-6">
        Our Plans
      </button>
      <h1 className="text-center text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold bg-gradient-to-r from-gray-900 to-gray-400 bg-clip-text text-transparent mb-6 sm:mb-10">
        Choose the plans that's right for you
      </h1>
      <div className="flex flex-wrap justify-center gap-6 text-left">
        {plans.map((item) => (
          <div
            className="bg-white drop-shadow-sm border rounded-lg py-12 px-8 text-gray-700 hover:scale-105 transition-all duration-500"
            key={item.id}
          >
            <img width={40} src={assets.logo_icon} alt="" />
            <p className="mt-3 font-semibold">{item.id}</p>
            <p className="text-sm">{item.desc}</p>
            <p className="mt-6">
              <span className="text-3xl font-medium">$ {item.price}</span>/
              {item.credits} credits
            </p>
            <button
              onClick={() => paymentRazorpay(item.id)} // item.id must be "Basic", "Advanced", or "Business"
              className="w-full bg-gray-800 text-white mt-8 text-sm rounded-md py-2.5 min-w-52"
            >
              {user ? "Buy Now" : "Get Started"}
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default BuyCredit;
