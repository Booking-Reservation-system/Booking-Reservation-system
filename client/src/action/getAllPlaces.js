import axios from "axios";
import toast from "react-hot-toast";


const getAllPlaces = async (searchUrl) => {
    if (searchUrl === undefined || searchUrl === "") {
        try {
            const response = await axios.get(`http://localhost:8080/api/places`);
            return response.data.places;
        } catch (error) {
            toast.error("Something went wrong");
        }
    } else {
        try {
            const response = await axios.get(`http://localhost:8080/api/places${searchUrl}`);
            return response.data.places;
        } catch (error) {
            toast.error("Something went wrong");
        }
    }
}

export default getAllPlaces;