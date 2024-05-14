import {useMemo} from "react";
import React, {Suspense} from "react";
import useCountries from "../../hooks/useCountries";
import Avatar from "../Avatar";
import ListingCategory from "./ListingCategory";
import ListingAmenity from "./ListingAmenity";
import {format} from "date-fns";
import storeToken from "../../hooks/storeToken.js";

const ListingInfo = (props) => {
    const {
        user,
        roomCount,
        category,
        description,
        guestCapacity,
        bathroomCount,
        locationValue,
        amenities,
        isTrip,
        guest,
        startDate,
        endDate,
        imageSrc
    } = props;
    const {getByValue} = useCountries();
    const location = getByValue(locationValue);
    const {role} = storeToken();

    const tripDate = useMemo(() => {
        if (!startDate || !endDate) return null;
        const start = new Date(startDate);
        const end = new Date(endDate);
        return `${format(start, "PP")} to ${format(end, "PP")}`;
    }, [startDate, endDate]);

    return (
        <>
            <div className="col-span-4 flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                    <div className="text-xl font-semibold flex flex-row items-center gap-4">
                        {!isTrip && <Avatar imageSrc={imageSrc}/>}
                        {!isTrip && <div>Hosted by {user}</div>}
                        {isTrip &&
                            <>
                                {role === "admin" ? (
                                    <div className="flex flex-col gap-3 font-normal">
                                        <div>Guest information:</div>
                                        <div>Name: <strong>{guest[0]}</strong></div>
                                        <div>Email: <strong>{guest[1]}</strong></div>
                                        <div>Booked from <strong>{tripDate}</strong></div>
                                    </div>
                                ) : (
                                    <div>You have booked from {tripDate}</div>
                                )}
                            </>
                        }
                    </div>
                    <div className="flex flex-row font-light items-center gap-1 text-neutral-500 text-md">
                        <div>{guestCapacity} guests -</div>
                        <div>{roomCount} rooms -</div>
                        <div>{bathroomCount} bathrooms.</div>
                    </div>
                </div>
                <hr/>
                {category && (
                    <ListingCategory
                        icon={category.icon}
                        label={category.label}
                        description={category.description}
                    />
                )}
                <hr/>
                <div className="font-light text-neutral-500 text-lg pb-[32px]">{description}</div>
                <hr/>
                <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1 pb-[32px]">
                    {amenities.map((amenity) => (
                        <ListingAmenity
                            key={amenity.label}
                            icon={amenity.icon}
                            label={amenity.label}
                            description={amenity.description}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export default ListingInfo;
