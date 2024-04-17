import axios from 'axios';

const getPlaceById = async (listingId) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/place/${listingId}`);
        return response.data.place;
    } catch (error) {
        console.error(error);
    }
}

export default getPlaceById;