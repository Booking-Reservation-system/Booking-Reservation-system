import getReservation from "../action/getReservation";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import ROUTES from "../constants/routes";
import useLoginModal from "../hooks/useLoginModal";

import EmptyState from "../components/EmptyState";
import Container from "../components/Container";
import Heading from "../components/Heading";
import ListingCard from "../components/listing/ListingCard";

const TripPage = () => {
  const navigate = useNavigate();
  const loginModal = useLoginModal();
  const [reservations, setReservations] = useState([]);
  const [deleteId, setDeleteId] = useState("");

  const { authToken, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.HOME);
      toast.error("Please login to view your trips");
      loginModal.onOpen();
      return;
    }
    const fetchData = async () => {
      try {
        const response = await getReservation(authToken);
        setReservations(response.data.reservations);
      } catch (error) {
        toast.error("Something went wrong");
      }
    };
    fetchData();
  }, [isAuthenticated]);

  // TODO: hạn chế dùng promise, dùng try catch với async await đi
  //     // Cái này không cần dùng useCallback vì navigate, token không thay đổi, tốn bộ nhớ cho useCallback

  const onCancel = async (id) => {
    setDeleteId(id);
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/reservation/${id}`,
        {
          headers: {
            Authorization: "Bearer " + authToken,
          },
          withCredentials: true,
        }
      );
      toast.success("Reservation has been cancelled");
      navigate(ROUTES.HOME);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
    setDeleteId("");
  };

  if (reservations.length === 0) {
    return (
      <EmptyState
        title="No trips found"
        subtitle="You haven't made any reservation yet"
        showReset
      />
    );
  }

  return (
    <Container>
      <div className="pt-[120px]">
        <Heading
          title="Trips"
          subtitle="Where you have been and where you are going"
        />
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-10">
          {reservations?.map((reservation) => (
            <ListingCard
              key={reservation._id}
              actionId={reservation._id}
              data={reservation._doc.placeId}
              reservationParams={reservation.placeReservationParams}
              reservation={reservation._doc}
              onAction={onCancel}
              disabled={deleteId === reservation._id}
              actionLabel="Canceled reservation"
            />
          ))}
        </div>
      </div>
    </Container>
  );
};

export default TripPage;
