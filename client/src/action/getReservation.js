import axios from "axios"
import toast from "react-hot-toast";

const getReservation = async (token) => {

    try {
        const response = await axios.get(`http://localhost:8080/api/reservation/`, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
        return response;
    } catch (error) {
        throw error;
        toast.error("Something went wrong")
    }
}

export default getReservation;