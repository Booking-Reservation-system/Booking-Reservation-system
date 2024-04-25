import getReservation from "../action/getReservation";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import ROUTES from "../constants/routes";

import EmptyState from "../components/EmptyState";
import Container from "../components/Container";
import Heading from "../components/Heading";
import ListingCard from "../components/listing/ListingCard";

const TripPage = () => {
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);
    const [deleteId, setDeleteId] = useState('')

    const { userId, token } = useAuth()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getReservation(token, userId)
                setReservations(response.data.reservations)
            } catch (error) {
                toast.error("Something went wrong")
            }
        }
        fetchData()
    }, [])

     // TODO: hạn chế dùng promise, dùng try catch với async await đi
    //     // Cái này không cần dùng useCallback vì navigate, token không thay đổi, tốn bộ nhớ cho useCallback

    // const onCancel = useCallback((id) => {
    //     setDeleteId(id)
    //     // id in here not encrypt
    //     axios.delete(`http://localhost:8080/api/reservation/${id}`, {
    //         headers: {
    //             Authorization: "Bearer " + token
    //         }
    //     })
    //     .then(() => {
    //         toast.success("Reservation has been cancelled")
    //     })
    //     .catch((error) => {
    //         toast.error(error?.response?.data?.message || "Something went wrong")
    //     })
    //     .finally(() => {
    //         setDeleteId('')
    //     })
    // }, [navigate, token])

    const onCancel = async (id) => {
        setDeleteId(id)
        try {
            const response = await axios.delete(`http://localhost:8080/api/reservation/${id}`, {
                headers: {
                    Authorization: "Bearer " + token
                }
            })
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong")
        }
        setDeleteId('')
        navigate(ROUTES.TRIPS)
    }

    return (
        <Container>
            <div className="pt-[120px]">
                <Heading title="Trips" subtitle="Where you have been and where you are going"/>
                {!reservations && <EmptyState title="No trips found" subtitle="You haven't made any reservation yet"/>}
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-10">
                    {reservations?.map((reservation) => (
                        <ListingCard
                            key={reservation._id}
                            data={reservation.placeId}
                            actionId={reservation._id}
                            reservation={reservation}
                            onAction={onCancel}
                            disabled={deleteId === reservation._id}
                            actionLabel="Canceled reservation"
                        />
                    ))}
                </div>
            </div>
        </Container>
    )
}

export default TripPage