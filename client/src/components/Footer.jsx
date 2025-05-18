import React from "react";
import { assets } from "../assets/assets";
import {Link} from 'react-router-dom';

const Footer = () => {
  return (
    <div className="flex items-center justify-between gap-4 py-3 mt-20">
      <Link to="/">
        <img src={assets.logo} alt="" width={150} />
      </Link>

      <p className="flex-1 border-gray-400 pl-4 text-sm text-gray-500 max-sm:hidden">
        Copyright @stack.io | All Rights reserved.
      </p>

      <div className="flex gap-2.5">
        <img src={assets.facebook_icon} alt="" width={35} />
        <img src={assets.instagram_icon} alt="" width={35} />
        <img src={assets.twitter_icon} alt="" width={35} />
      </div>
    </div>
  );
};

export default Footer;
