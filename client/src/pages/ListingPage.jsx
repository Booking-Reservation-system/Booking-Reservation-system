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
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import useTokenStore from "../hooks/storeToken";

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};
const reservations = []

const ListingPage = () => {
  const { token } = useTokenStore();
  const params = useParams();
  const listingId = params.listingId;
  const [data, setData] = useState();
  useEffect(() => {
    setIsLoading(true);
    const fetchPlace = async () => {
      try {
        const response = await getPlaceById(listingId);
        setData(response);
      } catch (error) {
        toast.error("Something went wrong");
      }
    };
    fetchPlace();
  }, []);
  const loginModal = useLoginModal();
  const navigate = useNavigate();
  const { getByValue } = useCountries();
  const location = getByValue(data?.location);

  const Map = useMemo(
    () => React.lazy(() => import("../components/Map")),
    [location]
  );

  const disabledDate = useMemo(() => {
    let dates = [];

    reservations.forEach((reservation) => {
      const range = eachDayOfInterval({
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate),
      })
      dates = [...dates, ...range]
    })
  }, [reservations])

  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(data?.price);
  const [dateRange, setDateRange] = useState(initialDateRange);

  const onCreateReservation = useCallback(() => {
    if (!token) {
      loginModal.onOpen();
      return;
    }
    setIsLoading(true);
    axios
      .post("/api/reservation", {
        totalPrice,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        placeId: listingId,
      })
      .then(() => {
        toast.success("Reservation created successfully");
        setDateRange(initialDateRange);
      })
      .catch(() => {
        toast.error("Something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [totalPrice, dateRange, listingId, token, loginModal]);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const dayCount = differenceInCalendarDays(
        dateRange.endDate,
        dateRange.startDate
      );

      if (dayCount && data.price) {
        setTotalPrice(dayCount * data?.price);
      } else {
        setTotalPrice(data?.price);
      }
    }
  }, [dateRange, data?.price]);

  const category = useMemo(() => {
    return categoriesArray.find(
      (category) => category.label === data?.category
    );
  }, [data?.category]);

  if (!data) {
    return <EmptyState showReset />;
  }

  return (
    <>
      <Container>
        <div className="max-w-screen-lg mx-auto pt-[120px]">
          <div className="flex flex-col gap-6">
            <div className="flex flex-row gap-8">
              <div className="">
                <ListingHead
                  title={data?.title}
                  imageSrc={data?.imageSrc}
                  locationValue={data?.location}
                  id={data?._id}
                />
              </div>
              <div className="w-[35%]">
                <ListingReservation
                price={data.price}
                totalPrice={totalPrice}
                onChangeDate={(value) => setDateRange(value)}
                dateRange={dateRange}
                onSubmit={onCreateReservation}
                disabled={isLoading}
                disabledDate={disabledDate}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
              <ListingInfo
                user={data?.creator?.name}
                roomCount={data?.roomCount}
                category={category}
                description={data?.description}
                guestCapacity={data?.guestCapacity}
                bathroomCount={data?.bathroomCount}
                locationValue={data?.location}
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
