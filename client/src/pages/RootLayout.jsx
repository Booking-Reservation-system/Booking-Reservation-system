import Navbar from "../components/navbar/Navbar.jsx";
import ToasterProvider from "../providers/ToasterProvider.jsx";
import RentModal from "../components/modals/RentModal.jsx";
import LoginModal from "../components/modals/LoginModal.jsx";
import RegisterModal from "../components/modals/RegisterModal.jsx";
import EditPlaceModal from "../components/modals/EditPlaceModal.jsx";
import App from "../App.jsx";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import useTokenStore from "../hooks/storeToken.js";
import {getTokenDuration} from "../../utils/auth.js";
import ROUTES from "../constants/routes.js";
import axios from "axios";

const RootLayout = () => {
    const navigate = useNavigate();
    const {
        accessToken,
        setAccess,
        refreshToken,
        setRefresh,
        expiresAt,
        setExpires,
        isAuthenticated,
        setAuth
    } = useTokenStore();
    const tokenDuration = getTokenDuration();
    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }
        const refreshInterval = setInterval(() => {
            axios.post("http://localhost:8080/auth/refresh", {refreshToken})
                .then((response) => {
                    const {accessToken, expires_in, token_type} = response.data;
                    setAccess(accessToken);
                    setExpires(expires_in);
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
            <Navbar/>
            <App/>
        </>
    );
};

export default RootLayout;
