import axios from "axios";
import toast from "react-hot-toast";

const getFavouriteByUserId = async (token) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/favourite`, {
            headers: {
                Authorization: "Bearer " + token
            }
        });
        return response.data.favouritePlaces;
    } catch (error) {
    }
}

export default getFavouriteByUserId;    