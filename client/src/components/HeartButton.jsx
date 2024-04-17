import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
const HeartButton = ( props ) => {
    const { listingId } = props;

    const hasFavorite = false
    const toggleFavorite = () => {

    }

    return (
        <div onClick={toggleFavorite} className="relative hover:opacity-80 transition cursor-pointer">
            <AiOutlineHeart size={40} className="fill-white absolute -top-[2px] -right-[2px]" />
            <AiFillHeart size={40} className={hasFavorite ? 'fill-rose-500' : 'fill-neutral-500/70'} />
        </div>
    )
}

export default HeartButton;