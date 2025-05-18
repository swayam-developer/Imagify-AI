import { useContext, useRef, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const { user, setShowLogin, logout, credit } = useContext(AppContext);
  const navigate = useNavigate();

  // Add state for dropdown visibility
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="flex items-center justify-between py-4">
      <Link to="/">
        <img src={assets.logo} alt="" className="w-28 sm:w-32 lg:w-40" />
      </Link>

      <div>
        {user ? (
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate("/buy")}
              className="flex items-center gap-2 bg-blue-100 px-4 sm:px-6 py-1.5 sm:py-3 rounded-full hover:scale-105 transition-all duration-700 cursor-pointer"
            >
              <img className="w-5 cursor-pointer" src={assets.credit_star} alt="" />
              <p className="text-xs sm:text-sm font-medium text-gray-600 cursor-pointer">
                Credits left: {credit}
              </p>
            </button>
            <p className="text-gray-600 max-sm:hidden pl-4 cursor-default">Hi! {user.name}</p>
            <div
              className="relative group cursor-pointer"
              ref={dropdownRef}
            >
              <img
                className="w-10 drop-shadow-2xl cursor-pointer"
                src={assets.profile_icon}
                alt=""
                onClick={() => setDropdownOpen((prev) => !prev)}
              />
              {/* Show dropdown on hover (desktop) or when dropdownOpen (mobile) */}
              <div
                className={`absolute ${
                  dropdownOpen ? "block" : "hidden"
                } group-hover:block top-0 right-0 z-20 text-black rounded pt-12`}
              >
                {/* Caret/triangle indicator */}
                <div className="absolute right-4 top-9 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white"></div>
                <ul className="list-none m-0 p-0 bg-white rounded-lg border shadow-lg text-sm min-w-[160px] overflow-hidden">
                  {/* Show user name on mobile inside dropdown */}
                  <li className="py-3 px-4 sm:hidden font-semibold text-gray-800 cursor-default bg-gray-50">
                    Hi! {user.name}
                  </li>
                  {/* Divider for mobile */}
                  <li className="sm:hidden border-t border-gray-200 my-0"></li>
                  <li
                    onClick={logout}
                    className="py-3 px-4 hover:bg-gray-100 transition-colors cursor-pointer text-gray-700 font-medium"
                  >
                    Logout
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-5">
            <p onClick={() => navigate("/buy")} className="cursor-pointer">
              Pricing
            </p>
            <button
              onClick={() => setShowLogin(true)}
              className="bg-zinc-800 text-white px-7 py-2 sm:px-10 text-sm rounded-full cursor-pointer hover:scale-105 transition-all duration-700"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
