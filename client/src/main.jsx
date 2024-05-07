import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/navbar/Navbar.jsx";
import ToasterProvider from "./providers/ToasterProvider.jsx";
import RentModal from "./components/modals/RentModal.jsx";
import LoginModal from "./components/modals/LoginModal.jsx";
import RegisterModal from "./components/modals/RegisterModal.jsx";
import EditPlaceModal from "./components/modals/EditPlaceModal.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <BrowserRouter>
        <ToasterProvider />
        <RentModal />
        <LoginModal />
        <RegisterModal />
        <EditPlaceModal/>
        <Navbar />
        <App />
      </BrowserRouter>
  </React.StrictMode>
);
