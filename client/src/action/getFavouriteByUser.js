import axios from "axios";

const getFavouritesByUser = async (token) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/favourites`, {
            headers: {
                Authorization: "Bearer " + token,
            },
            withCredentials: true
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export default getFavouritesByUser;