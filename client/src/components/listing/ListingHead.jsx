import useCountries from "../../hooks/useCountries";
import HeartButton from "../HeartButton";

const ListingHead = (props) => {
  const { title, locationValue, imageSrc, id } = props;
  const { getByValue } = useCountries();
  const location = getByValue(locationValue);

  const imgSrc = "http://localhost:8080/" + imageSrc;
  return (
    <>
      <div className="text-start">
        <div className="text-2xl font-bold">{title}</div>
        <div className="font-light text-md text-neutral-500 mt-3">{`${location.region}, ${location.label}`}</div>
      </div>
      <div className="flex flex-row justify-between">
        <div className="w-full h-[70vh] relative overflow-hidden">
          <img
            src={imgSrc}
            alt="listingImg"
            className="object-cover h-full rounded-xl"
          ></img>
          <div className="absolute top-5 right-5">
            <HeartButton listingId={id} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ListingHead;
