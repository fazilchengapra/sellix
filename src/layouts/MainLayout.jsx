import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import { ToastContainer } from "../components/ToastContainer";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <ScrollToTop />
      <Navbar />
      <div className="grow">
        <Outlet />
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default MainLayout;
