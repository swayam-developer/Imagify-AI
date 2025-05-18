import React, { useState } from "react";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Result = () => {
  const [image, setImage] = useState(assets.sample_img_1);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");

  const {generateImage} = useContext(AppContext);

  const OnSubmitHandler = async (e) => {
    e.preventDefault();
    if (!input) return;
    setLoading(true);
    setIsImageLoaded(false);
    setInput(""); // Clear input immediately after submit
    const image = await generateImage(input);
    setLoading(false);
    if (image) {
      setImage(image);
      setIsImageLoaded(true);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col min-h-[90vh] justify-center items-center"
      onSubmit={OnSubmitHandler}
    >
      <div>
        <div className="relative">
          <img src={image} alt="" className="max-w-sm rounded" />
          <span
            className={`block h-1 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400 mt-1 rounded-full
              ${loading ? "animate-pulse w-full" : "w-0 hidden"}
            `}
            style={{
              boxShadow: loading
                ? "0 0 16px 4px rgba(59,130,246,1)"
                : undefined,
              transition: "width 1s cubic-bezier(0.4,0,0.2,1)",
            }}
          />
        </div>
        <p className={!loading ? "hidden" : "animate-pulse text-blue-600 font-medium mt-2"}>Generating image...</p>
      </div>

      {!isImageLoaded && (
        <div className="flex w-full max-w-xl bg-neutral-500 text-white text-sm p-0.5 mt-10 rounded-full">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Describe what you want to generate"
            className="flex-1 bg-transparent outline-none ml-8 max-sm:w-20 placeholder-color"
          />
          <button
            type="submit"
            className="bg-zinc-900 px-10 sm:px-16 py-3 rounded-full"
          >
            Generate
          </button>
        </div>
      )}

      {isImageLoaded && (
        <div className="flex gap-2 flex-wrap justify-center text-white text-sm p-0.5 mt-10 rounded-full">
          <p
            onClick={() => {
              setIsImageLoaded(false);
              setImage(assets.sample_img_1); // Reset to sample image
            }}
            className="bg-transparent border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer"
          >
            Generate Another
          </p>
          <a
            href={image}
            download
            className="bg-zinc-900 px-10 py-3 rounded-full cursor-pointer"
          >
            Download
          </a>
        </div>
      )}
    </motion.form>
  );
};

export default Result;
