import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";
import useTokenStore from "./storeToken";
import { jwtDecode } from "jwt-decode";

import useLoginModal from "../hooks/useLoginModal"; 

const useFavourite = (props) => {
    const { token } = useTokenStore();
    const decodedToken = jwtDecode(token)
    const userId = decodedToken.userId
    
    const getUserFavorites = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/favorite");
            console.log(response.data.favorites);
            return response.data.favorites;
        } catch (error) {
            toast.error("Something went wrong");
        }
    }

    const { listingId } = props;
    const navigate = useNavigate();
    const loginModal = useLoginModal();

    const hasFavorite = useMemo(() => {
        const list = getUserFavorites() || [];
    }, [])
}

export default useFavourite;