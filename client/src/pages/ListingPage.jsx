import axios from "axios";
import React, { Suspense } from "react";
import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import useCountries from "../hooks/useCountries";
import { categoriesArray } from "../components/navbar/Categories";
import Container from "../components/Container";
import ListingHead from "../components/listing/ListingHead";
import ListingInfo from "../components/listing/ListingInfo";
import ListingFooter from "../components/listing/ListingFooter";

const ListingPage = () => {
  const params = useParams();
  const listingId = params.listingId;
  const [data, setData] = useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/place/${listingId}`
        );
        setData(response.data.place);
      } catch (error) {
        toast.error("Something went wrong");
      }
    };
    fetchData();
  }, []);

  const { getByValue } = useCountries();
  const location = getByValue(data?.location);

  const Map = useMemo(
    () => React.lazy(() => import("../components/Map")),
    [location]
  );

  const category = useMemo(() => {
    return categoriesArray.find(
      (category) => category.label === data?.category
    );
  }, [data?.category]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Container>
        <div className="max-w-screen-lg mx-auto pt-[120px]">
          <div className="flex flex-col gap-6">
            <ListingHead
              title={data?.title}
              imageSrc={data?.imageSrc}
              locationValue={data?.location}
              id={data?._id}
            />
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
