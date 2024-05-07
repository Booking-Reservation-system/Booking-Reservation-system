import Navbar from "./components/navbar/Navbar.jsx";
import ToasterProvider from "./providers/ToasterProvider.jsx";
import RentModal from "./components/modals/RentModal.jsx";
import LoginModal from "./components/modals/LoginModal.jsx";
import RegisterModal from "./components/modals/RegisterModal.jsx";
import EditPlaceModal from "./components/modals/EditPlaceModal.jsx";
import App from "./App.jsx";

const Layout = () => {
  return (
    <>
      <ToasterProvider />
      <RentModal />
      <LoginModal />
      <RegisterModal />
      <EditPlaceModal />
      <Navbar />
      <App />
    </>
  );
};

export default Layout;
