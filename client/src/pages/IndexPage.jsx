import Container from "../components/Container";
import EmptyState from "../components/EmptyState";
import ListingCard from "../components/listing/ListingCard";
import getAllPlaces from "../action/getAllPlaces";
import {useEffect, useState, Component, Fragment} from "react";
import toast from "react-hot-toast";
import axios from "axios";
import {useLocation} from "react-router-dom";
import useTokenStore from "../hooks/storeToken.js";

const IndexPage = () => {
    const [data, setData] = useState([]);
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const {
        isAuthenticated,
        setAuth
    } = useTokenStore();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAllPlaces()
                setData(response)
            } catch (error) {
                toast.error(error?.response?.data?.message || "Something went wrong")
            }
        }
        fetchData();

        // check login with google success
        const ggLg = async () => {
            try {
                if (query.get("auth") === null) return;
                if (query.get("authError") && query.get("authError") === "true") {
                    toast.error("Something went wrong");
                    window.history.replaceState({}, document.title, "/");
                    return;
                }
                const response = await axios.get("http://localhost:8080/auth/google/success", {
                    withCredentials: true,
                });
                console.log(response.data);
                if (response.status !== 200) {
                    toast.error("Something went wrong");
                    return;
                }
                const accessToken = localStorage.getItem("accessToken");
                const expiresAt = localStorage.getItem("expiresAt");
                const refreshToken = localStorage.getItem("refreshToken");
                const authName = localStorage.getItem("authName");

                if (!accessToken || !expiresAt || !refreshToken || !authName || !isAuthenticated) {
                    localStorage.setItem("accessToken", response.data.accessToken);
                    localStorage.setItem("expiresAt", response.data.expires_in);
                    localStorage.setItem("refreshToken", response.data.refreshToken);
                    localStorage.setItem("authName", response.data.name);
                    localStorage.setItem("provider", "google");
                    setAuth(true);
                }
                // remove query params
                window.history.replaceState({}, document.title, "/");
            } catch (error) {
                toast.error("Something went wrong");
            }
        }
        ggLg();

    }, []);

    const isEmpty = false;

    return (
        <>
            {(isEmpty && <EmptyState showReset/>) || (
                <div className="pb-20 pt-40">
                    <Container>
                        <div
                            className="
                pt-24
                grid
                grid-cols-1
                sm:grid-cols-1
                md:grid-cols-2
                lg:grid-cols-3
                2xl:grid-cols-4
                gap-10
              "
                        >
                            {data.map((item) => (
                                <ListingCard data={item} key={item._id}/>
                            ))}
                        </div>
                    </Container>
                </div>
            )}
        </>
    );
};

export default IndexPage;
