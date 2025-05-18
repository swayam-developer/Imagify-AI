import { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./components/Login";
import { useContext, useEffect } from "react";
import { AppContext } from "./context/AppContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Lazy load pages for faster navigation and less blocking
const Home = lazy(() => import("./pages/Home"));
const BuyCredit = lazy(() => import("./pages/BuyCredit"));
const Result = lazy(() => import("./pages/Result"));

const App = () => {
  const { showLogin, user } = useContext(AppContext);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="px-4 sm:px-10 md:px-14 lg:px-28 min-h-screen bg-gradient-to-b from-teal-50 to-orange-50">
      <ToastContainer position="bottom-right"/>
      <Navbar />
      {showLogin && <Login />}
      <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/buy" element={<BuyCredit />} />
          <Route path="/result" element={
            user ? <Result /> : (
              <div className="text-center py-10 text-lg text-gray-600">
                Please login to access this page.
              </div>
            )
          } />
        </Routes>
      </Suspense>
      <Footer />
    </div>
  );
};

export default App;
