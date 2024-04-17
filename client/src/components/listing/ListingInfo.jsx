import { useMemo } from "react";
import React, { Suspense } from "react";
import useCountries from "../../hooks/useCountries";
import Avatar from "../Avatar";
import ListingCategory from "./ListingCategory";

const ListingInfo = (props) => {
  const {
    user,
    roomCount,
    category,
    description,
    guestCapacity,
    bathroomCount,
    locationValue,
  } = props;
  const { getByValue } = useCountries();
  const location = getByValue(locationValue);
  return (
    <>
      <div className="col-span-4 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="text-xl font-semibold flex flex-row items-center gap-4">
            <Avatar />
            <div>Hosted by {user}</div>
          </div>
          <div className="flex flex-row font-light items-center gap-1 text-neutral-500 text-md">
            <div>{guestCapacity} guests -</div>
            <div>{roomCount} rooms -</div>
            <div>{bathroomCount} bathrooms.</div>
          </div>
        </div>
        <hr />
        {category && (
          <ListingCategory
            icon={category.icon}
            label={category.label}
            description={category.description}
          />
        )}
        <hr />
        <div className="font-light text-neutral-500 text-lg pb-[32px]">{description}</div>
      </div>       
    </>
  );
};

export default ListingInfo;
