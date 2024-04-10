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
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="549956100643-j05msueeegv9pevbfahmdhj8msha5umn.apps.googleusercontent.com">
      <BrowserRouter>
        <ToasterProvider />
        <RentModal />
        <LoginModal />
        <RegisterModal />
        <Navbar />
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
