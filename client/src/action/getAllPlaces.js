import axios from "axios";
import toast from "react-hot-toast";

const getAllPlaces = async () => {
    try {
        const response = await axios.get("http://localhost:8080/api/place");
        return response.data.places;
    } catch (error) {
        toast.error("Something went wrong");
    }
}

export default getAllPlaces;