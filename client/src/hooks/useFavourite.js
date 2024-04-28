import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";
import ROUTES from "../constants/routes";
import useAuth from "./useAuth";
import useLoginModal from "../hooks/useLoginModal";
import getFavouriteByUserId from "../action/getFavouriteByUserId";

const useFavourite = (props) => {
  const { authToken } = useAuth();

  const getUserFavourites = async () => {
    if (!authToken) {
      return;
    } else {
      try {
        const response = await getFavouriteByUserId(authToken);
        console.log(response);
        return response;
      } catch (error) {
        toast.error("Something went wrong");
      }
    }
  };

  const { listingId } = props;
  const navigate = useNavigate();
  const loginModal = useLoginModal();

  const hasFavourite = useMemo(async () => {
    const list = await getUserFavourites() || [];
    return list.includes(listingId);
  }, [listingId]);

  console.log(hasFavourite);
  console.log(listingId)

  const toggleFavourite = useCallback(
    async (e) => {
      e.stopPropagation();
      if (!authToken) {
        return loginModal.onOpen();
      }
      let request;
      try {
        if (hasFavourite) {
          request = () =>
            axios.delete(
              `http://localhost:8080/api/favourite/${listingId}`,
              {
                headers: {
                  Authorization: "Bearer " + authToken,
                },
              }
            );
        } else {
          request = () =>
            axios.post(
              `http://localhost:8080/api/favourite/${listingId}`,
              {
                headers: {
                  Authorization: "Bearer " + authToken,
                },
              }
            );
        }
        await request();
        navigate(ROUTES.FAVOURITES);
        toast.success(
          `Listing has been ${
            hasFavourite ? "removed from" : "added to"
          } favourites`
        );
      } catch (error) {
        toast.error(request.message || "Something went wrong");
      }
    },
    [hasFavourite, authToken, listingId, loginModal]
  );

  return {
    hasFavourite,
    toggleFavourite,
  };
};

export default useFavourite;
