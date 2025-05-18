import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [state, setState] = useState("Login");
  const { setShowLogin, backendUrl, setToken, setUser } =
    useContext(AppContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (state === "Login") {
        console.log("LOGIN URL:", backendUrl + "/api/user/login"); // Debug
        const { data } = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });
        if (data.success) {
          setToken(data.token);
          setUser(data.user);
          localStorage.setItem("token", data.token); // Fix here
          setShowLogin(false);
        } else {
          toast.error(data.message);
        }
      } else {
        console.log("REGISTER URL:", backendUrl + "/api/user/register"); // Debug
        const { data } = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });
        if (data.success) {
          setToken(data.token);
          setUser(data.user);
          localStorage.setItem("token", data.token); // Fix here
          setShowLogin(false);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
      <motion.form
        onSubmit={onSubmitHandler}
        initial={{ opacity: 0.2, y: 100 }}
        transition={{ duration: 0.3 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative bg-white p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-xs sm:max-w-sm flex flex-col gap-4"
      >
        <h1 className="text-center text-2xl text-neutral-700 font-semibold mb-1">
          {state}
        </h1>
        <p className="text-sm text-center mb-2">
          Welcome back! Please Sign In to continue
        </p>

        {state !== "Login" && (
          <div className="border px-4 py-2 flex items-center gap-3 rounded-full mt-2 bg-gray-50">
            <img src={assets.profile_icon} alt="" className="w-6 h-6" />
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="outline-none text-sm bg-transparent flex-1"
              type="text"
              placeholder="Enter Name"
              required
            />
          </div>
        )}

        <div className="border px-4 py-2 flex items-center gap-3 rounded-full mt-2 bg-gray-50">
          <img src={assets.email_icon} alt="" className="w-6 h-6" />
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="outline-none text-sm bg-transparent flex-1"
            type="email"
            placeholder="Enter Email"
            required
          />
        </div>

        <div className="border px-4 py-2 flex items-center gap-3 rounded-full mt-2 bg-gray-50">
          <img src={assets.lock_icon} alt="" className="w-6 h-6" />
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="outline-none text-sm bg-transparent flex-1"
            type="password"
            placeholder="Enter Password"
            required
          />
        </div>

        {state === "Login" && (
          <p className="text-sm text-blue-600 my-4 cursor-pointer">
            Forgot password?
          </p>
        )}

        <button className="w-full mt-4 bg-blue-600 text-white rounded-full py-2 font-medium hover:bg-blue-800 transition">
          {state === "Login" ? "Login" : "Create Account"}
        </button>

        {state == "Login" ? (
          <p className="mt-5 text-center">
            Don't have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => setState("Sign Up")}
            >
              Sign Up
            </span>
          </p>
        ) : (
          <p className="mt-5 text-center">
            Already have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => setState("Login")}
            >
              Login
            </span>
          </p>
        )}

        <img
          onClick={() => setShowLogin(false)}
          src={assets.cross_icon}
          alt=""
          className="absolute top-5 right-5 cursor-pointer"
        />
      </motion.form>
    </div>
  );
};

export default Login;
