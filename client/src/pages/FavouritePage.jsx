
import Container from "../components/Container";
import Heading from "../components/Heading";
import ListingCard from "../components/listing/ListingCard";
import EmptyState from "../components/EmptyState";

import useAuth from "../hooks/useAuth";
import getFavouriteByUser from "../action/getFavouriteByUser"
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const FavouritePage = () => {

    const [favouritePlaces, setFavouritePlaces] = useState([]);
    const { authToken, isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate(ROUTES.HOME)
            toast.error("Please login to view your trips")
            loginModal.onOpen()
            return
        }
        const fetchData = async () => {
            try {
                const response = await getFavouriteByUser(authToken);
                setFavouritePlaces(response.data.favouritePlaces);
            } catch (error) {
                toast.error("Something went wrong");
            }
        }
        fetchData();
    }, [])

    return (
        <Container>
            <div className="pt-[120px]">
                <Heading title="Favourites" subtitle="Your favourite places"/>
                {favouritePlaces.length === 0 && <EmptyState title="No favourites found" subtitle="You haven't added any favourite places yet"/>}
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-10">
                    {favouritePlaces?.map((favourite) => (
                        <ListingCard
                            key={favourite?._id}
                            isFavourite
                            favouriteParams={favourite?._id}
                            data={favourite?._doc}
                        />
                    ))}
                </div>
            </div>
        </Container>
    )
}

export default FavouritePage;