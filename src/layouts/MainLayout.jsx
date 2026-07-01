import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import { ToastContainer } from "../components/ToastContainer";
import { useSupportModal } from "../context/SupportContext";
import SupportTicketModal from "../components/support/SupportTicketModal";

const MainLayout = () => {
  const { isOpen, linkedOrder, closeSupport } = useSupportModal();

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <ScrollToTop />
      <Navbar />
      <div className="grow">
        <Outlet />
      </div>
      <Footer />
      <ToastContainer />

      {/* Global Support Modal — triggered by footer or order pages */}
      <SupportTicketModal
        isOpen={isOpen}
        onClose={closeSupport}
        order={linkedOrder}
      />
    </div>
  );
};

export default MainLayout;

