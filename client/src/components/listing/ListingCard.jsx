import { useNavigate, Link } from "react-router-dom";
import useCountries from "../../hooks/useCountries";
import { useCallback, useMemo } from "react";
import { format } from "date-fns";

import { FaStar } from "react-icons/fa";
import HeartButton from "../HeartButton";
import Button from "../Button";

const ListingCard = (props) => {
  const { data, reservation, onAction, disabled, actionLabel, actionId } =
    props;
  const { getByValue } = useCountries();
  const location = getByValue(data.location);

  const handleCancel = useCallback(
    (event) => {
      event.stopPropagation();
      if (disabled) {
        return;
      }

      onAction?.(actionId);
    },
    [disabled, onAction, actionId]
  );

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
    return `${format(start, 'PP')} - ${format(end, 'PP')}`;
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
              alt="listing"
              className=" object-cover w-full h-full transition group-hover:scale-110"
            ></img>
            <div className="absolute top-3 right-3">
              <HeartButton listingId={data.id} />
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="text-lg font-semibold">{data.title}</div>
          </div>
          <div className="text-md text-neutral-500">
            <div>
              {location?.region}, {location?.label}
            </div>
            <div>{revervationDate || data.category}</div>
          </div>
          <div className="flex flex-row items-center gap-1">
            <div className="text-md font-semibold flex flex-row">
              ${formatNumber}
              {!reservation && <div className="font-light"> / night</div>}
            </div>

            {onAction && actionLabel && (
              <Button
                disabled={disabled}
                small
                label={actionLabel}
                onClick={handleCancel}
              />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;
