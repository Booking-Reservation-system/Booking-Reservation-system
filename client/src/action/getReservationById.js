import axios from "axios";

const getReservationById = async (reservationId, authToken) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/reservation/${reservationId}`, {
            headers: {
                Authorization: "Bearer " + authToken,
            },
            withCredentials: true,
        });
        return response.data.reservation;
    } catch (error) {
        console.error(error);
    }
}

export default getReservationById;  