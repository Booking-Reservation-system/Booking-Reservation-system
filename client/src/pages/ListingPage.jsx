import React, { Suspense, useCallback } from "react";
import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import useCountries from "../hooks/useCountries";
import { categoriesArray } from "../components/navbar/Categories";
import Container from "../components/Container";
import ListingHead from "../components/listing/ListingHead";
import ListingInfo from "../components/listing/ListingInfo";
import ListingFooter from "../components/listing/ListingFooter";
import ListingReservation from "../components/listing/ListingReservation";
import EmptyState from "../components/EmptyState";
import useLoginModal from "../hooks/useLoginModal";
import getPlaceById from "../action/getPlaceById";
import getReservation from "../action/getReservation";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import useTokenStore from "../hooks/storeToken";


const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};

const ListingPage = () => {
  const { token } = useTokenStore();
  const params = useParams();
  const placeId = params.placeId;
  const loginModal = useLoginModal();
  const navigate = useNavigate();

  const [listingData, setListingData] = useState();
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(listingData?.price);
  const [dateRange, setDateRange] = useState(initialDateRange);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await getReservation(token, placeId);
        setReservations(response.data.reservations);
      } catch (error) {
        // toast.error("Something went wrong");
        console.log(error)
      }
    }
    fetchReservations();
  }, []);
  console.log(reservations)


  useEffect(() => {
    setIsLoading(true);
    const fetchPlace = async () => {
      try {
        const response = await getPlaceById(placeId);
        setListingData(response);
        console.log(response)
      } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    };
    fetchPlace();
  }, []);

  const { getByValue } = useCountries();
  const location = getByValue(listingData?.locationValue);

  const Map = useMemo(
    () => React.lazy(() => import("../components/Map")),
    [location]
  );

  const disabledDate = useMemo(() => {
    let dates = [];

    reservations?.forEach((reservation) => {
      const range = eachDayOfInterval({
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate),
      });
      dates = [...dates, ...range];
    });
    return dates
  }, [reservations]);

  const onCreateReservation = useCallback(() => {
    if (!token) {
      loginModal.onOpen();
      return;
    }
    setIsLoading(true);
    const reservationDB = new FormData()
    reservationDB.append('totalPrice', totalPrice)
    reservationDB.append('startDate', dateRange.startDate)
    reservationDB.append('endDate', dateRange.endDate)
    reservationDB.append('placeId', placeId)
    // for (const value of reservationDB.entries()) {
    //   console.log(value[0], value[1]);
    // }
    axios
      .post("http://localhost:8080/api/reservation", reservationDB, {
       headers: {
          Authorization: "Bearer " + token,
       }
      })
      .then(() => {
        toast.success("Reservation created successfully");
        navigate('/trips')
        setDateRange(initialDateRange);
      })
      .catch(() => {
        toast.error(error?.response?.data?.message || "Something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [totalPrice, dateRange, placeId, token, loginModal]);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const dayCount = differenceInCalendarDays(
        dateRange.endDate,
        dateRange.startDate
      );

      if (dayCount && listingData.price) {
        setTotalPrice(dayCount * listingData?.price);
      } else {
        setTotalPrice(listingData?.price);
      }
    }
  }, [dateRange, listingData?.price]);

  const category = useMemo(() => {
    return categoriesArray.find(
      (category) => category.label === listingData?.category
    );
  }, [listingData?.category]);

  if (!listingData) {
    return <EmptyState showReset />;
  }

  return (
    <>
      <Container>
        <div className="max-w-screen-lg mx-auto pt-[120px]">
          <div className="grid grid-cols-3 gap-6 max-[1000px]:grid-cols-1">
            <div className="col-span-2 max-[1000px]:col-span-1">
              <ListingHead
                title={listingData?.title}
                imageSrc={listingData?.imageSrc}
                locationValue={listingData?.locationValue}
                id={listingData?._id}
              />
              <div className="pt-[50px]">
              <ListingInfo
                user={listingData?.creator?.name}
                roomCount={listingData?.roomCount}
                category={category}
                description={listingData?.description}
                guestCapacity={listingData?.guestCapacity}
                bathroomCount={listingData?.bathroomCount}
                locationValue={listingData?.locationValue}
              />
              </div>
            </div>
            <div className=" max-lg:grid-cols-1 top-[75px] max-[1000px]:top-0 relative max">
              <ListingReservation
                price={listingData.price}
                totalPrice={totalPrice}
                onChangeDate={(value) => setDateRange(value)}
                dateRange={dateRange}
                onSubmit={onCreateReservation}
                disabled={isLoading}
                disabledDate={disabledDate}
              />
            </div>
          </div>
          <hr />
          <div className="flex flex-col gap-6 py-8">
            <div className="text-xl font-semibold">Where you will go</div>
            <div className="font-light text-md text-neutral-500">{`${location?.region}, ${location?.label}`}</div>
            <div className="">
              <Suspense fallback={<div>Loading...</div>}>
                <Map center={location?.lating} />
              </Suspense>
            </div>
          </div>
        </div>
      </Container>
      <ListingFooter />
    </>
  );
};

export default ListingPage;
