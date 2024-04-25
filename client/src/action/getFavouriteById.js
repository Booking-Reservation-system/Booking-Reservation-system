import axios from "axios";
import toast from "react-hot-toast";

const getFavouriteById = async (token, id) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/favorite/${id}`, {
            headers: {
                Authorization: "Bearer " + token
            }
        });
        return response;
    } catch (error) {
        toast.error("Something went wrong");
    }
}