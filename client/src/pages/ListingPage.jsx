import React, { Suspense, useCallback } from "react";
import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import useCountries from "../hooks/useCountries";
import { categoriesArray } from "../components/navbar/Categories";
import { amenitiesArray } from "../components/Amenities";
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

const ListingPage = () => {
  const { token } = useTokenStore();
  const params = useParams();
  const placeId = params.placeId;
  const loginModal = useLoginModal();
  const navigate = useNavigate();

  const [listingData, setListingData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(listingData?.price);
  const [dateRange, setDateRange] = useState(initialDateRange);

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

  console.log(listingData?.reservedDate)

  const disabledDate = useMemo(() => {
    let dates = [];

    listingData?.reservedDate?.forEach((reservation) => {
      const range = eachDayOfInterval({
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate),
      });
      dates = [...dates, ...range];
    });
    return dates
  }, [listingData?.reservedDate]);

  const onCreateReservation = useCallback(() => {
    if (!token) {
      loginModal.onOpen();
      return;
    }
    setIsLoading(true);

    const inputReservationData = {
      totalPrice,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      placeId,
    }
    axios
      .post("http://localhost:8080/api/reservation", inputReservationData, {
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

  const amenity = useMemo(() => {
    return amenitiesArray.filter((amenity) => listingData?.amenities[amenity.id]);
  }, [listingData?.amenities])

  if (!listingData) {
    return <EmptyState showReset />;
  }
  
  console.log(amenity)
  console.log(listingData)  

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
                amenities={amenity}
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
