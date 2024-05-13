import axios from "axios";

const checkRole = async (token) => {
    try {
        const response = await axios.get("http://localhost:8080/api/admin/check-role", {
            headers: {
                Authorization: "Bearer " + token,
            },
            withCredentials: true
        });
        return response
    } catch (error) {
        throw error;
    }
}

export default checkRole;
