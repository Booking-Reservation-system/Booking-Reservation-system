import Navbar from "../components/navbar/Navbar.jsx";
import ToasterProvider from "../providers/ToasterProvider.jsx";
import RentModal from "../components/modals/RentModal.jsx";
import LoginModal from "../components/modals/LoginModal.jsx";
import RegisterModal from "../components/modals/RegisterModal.jsx";
import EditPlaceModal from "../components/modals/EditPlaceModal.jsx";
import SearchModal from "../components/modals/SearchModal.jsx";
import App from "../App.jsx";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import useTokenStore from "../hooks/storeToken.js";
import {getTokenDuration} from "../../utils/auth.js";
import ROUTES from "../constants/routes.js";
import axios from "axios";

const RootLayout = () => {
    const {isAuthenticated, setAuth} = useTokenStore();
    const navigate = useNavigate();
    const refreshToken = localStorage.getItem("refreshToken");
    const tokenDuration = getTokenDuration();
    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }
        const refreshInterval = setInterval(() => {
            if (localStorage.getItem("provider") === "google") {
                axios.post("http://localhost:8080/auth/google/refresh", {refreshToken}, {withCredentials: true})
                    .then((response) => {
                        const {accessToken, expires_in, token_type} = response.data;
                        console.log('Google refresh');
                        localStorage.setItem("accessToken", accessToken);
                        localStorage.setItem("expiresAt", expires_in);
                    })
                    .catch((error) => {
                        console.log(error);
                        navigate(ROUTES.HOME);
                    });
                return;
            }
            axios.post("http://localhost:8080/auth/refresh", {refreshToken})
                .then((response) => {
                    const {accessToken, expires_in, token_type} = response.data;
                    console.log(response.data);
                    localStorage.setItem("accessToken", accessToken);
                    localStorage.setItem("expiresAt", expires_in);
                })
                .catch((error) => {
                    console.log(error);
                    navigate(ROUTES.HOME);
                });
        }, tokenDuration); // Refresh every minute

        // Cleanup interval on component unmount
        return () => {
            clearInterval(refreshInterval);
        };
    }, [isAuthenticated]);
    return (
        <>
            <ToasterProvider/>
            <RentModal/>
            <LoginModal/>
            <RegisterModal/>
            <EditPlaceModal/>
            <SearchModal/>
            <Navbar/>
            <App/>
        </>
    );
};

export default RootLayout;
