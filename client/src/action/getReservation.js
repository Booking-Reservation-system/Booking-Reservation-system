import axios from "axios"
import toast from "react-hot-toast";

const getReservation = async (token, userId) => {

    try {
        const response = await axios.get(`http://localhost:8080/api/reservation?userId=${userId}`, {
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