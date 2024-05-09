import axios from "axios"
import toast from "react-hot-toast";
import instance from "../../utils/customizeAxios";

const getReservation = async (token) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/reservations`, {
            headers: {
                Authorization: "Bearer " + token,
            },
            withCredentials: true
        });
        // const response = await instance.get(`/api/reservations?userId=${userId}`);
        return response;
    } catch (error) {
        throw error;
        toast.error("Something went wrong")
    }
}

export default getReservation;