import { useNavigate, Link } from "react-router-dom";
import useCountries from "../../hooks/useCountries";
import { useMemo } from "react";
import { format } from "date-fns";

import { FaStar } from "react-icons/fa";
import HeartButton from "../HeartButton";

const ListingCard = (props) => {
  const { data, reservation } = props;
  const { getByValue } = useCountries();
  const location = getByValue(data.location);

  const price = useMemo(() => {
    if (reservation) {
      return reservation.totalPrice;
    }
    return data.price;
  }, [reservation, data.price]);

  const revervationDate = useMemo(() => {
    if (!reservation) return null;
    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);
    // return `${format(start, 'PP')} - ${format(end, 'PP')}`;
    // bug appear beacuse of the date is undefined
  }, [reservation]);

  const imgSrc = "http://localhost:8080/" + data.imageSrc;
  const formatNumber = data.price.toLocaleString("en-US");
  return (
    <Link to={`listing/${data._id}`}>
      <div className="col-span-1 cursor-pointer group">
        <div className="flex flex-col gap-2 w-full">
          <div className="aspect-square overflow-hidden w-full relative rounded-xl">
            <img
              src={imgSrc}
              className=" object-cover w-full h-full transition group-hover:scale-110"
            ></img>
            <div className="absolute top-3 right-3">
              <HeartButton listingId={data.id} currentUser={data.user} />
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="text-lg font-semibold">{data.title}</div>
          </div>
          <div className="text-md text-neutral-500">
            <div>
              {location?.region}, {location?.label}
            </div>
            <div>{data.category}</div>
          </div>
          <div className="text-md font-semibold">${formatNumber} / Night</div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;
