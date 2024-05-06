import Container from "../components/Container";
import EmptyState from "../components/EmptyState";
import ListingCard from "../components/listing/ListingCard";
import getAllPlaces from "../action/getAllPlaces";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import useStoreGoogleToken from "../hooks/useStoreGoogleToken";
import useStoreGithubToken from "../hooks/useStoreGithubToken";
import useAuth from "../hooks/useAuth";

const IndexPage = () => {
  const { authToken, accessTokenGoogle, accessTokenGithub } = useAuth();
  const { setAccessTokenGoogle } = useStoreGoogleToken();
  const { setAccessTokenGithub } = useStoreGithubToken();
  const [placeData, setPlaceData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllPlaces();
        setPlaceData(response);

        if (authToken === null && accessTokenGithub === null) {
          await ggLg();
        }

        if (authToken === null && accessTokenGoogle === null) {
          await gitLg();
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    };
    fetchData();
  }, []);

  // check login with google success
  const ggLg = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/auth/google/success",
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      setAccessTokenGoogle(response.data.accessToken);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        await renewGgToken();
      } else {
        toast.error(error.message || "Something went wrong");
      }
    }
  };

  const gitLg = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/auth/github/success",
        {
          withCredentials: true,
        }
      );
      // console.log(response.data);
      setAccessTokenGithub(response.data.accessToken);
      return response.data;
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  // get renew access token
  const renewGgToken = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/auth/google/refresh",
        {
          refreshToken:
            "1//0e5St58NFWnv1CgYIARAAGA4SNwF-L9IrC0hW2tdRYDUQcL1eSUJ1BN5fh7-p4PDW-qPe3dKCJj_Z7e8Ro2Ff6FDFfM-ubXAGpgE",
          withCredentials: true,
        }
      );
      console.log(response.data + "renew");
      return response.data;
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // const renewGitToken = async () => {
  //     try {
  //         const response = await axios.post("http://localhost:8080/auth/github/refresh", {
  //             refreshToken: "ghr_E3t0lXsHqGIgPYRQkICpKGV4sS4x3uRSH6BvOw2S08wmTXXFd8wp0MxF45IxBWDRagfySx2Fc1W1",
  //             withCredentials: true,
  //         });
  //         console.log(response.data);
  //         return response.data;
  //     } catch (error) {
  //         toast.error("Something went wrong");
  //     }
  // }

  console.log(authToken, accessTokenGoogle, accessTokenGithub);

  const isEmpty = false;
  return (
    <>
      {(isEmpty && <EmptyState showReset />) || (
        <div className="pb-20 pt-40">
          <Container>
            <div
              className="
                pt-24
                grid
                grid-cols-1
                sm:grid-cols-1
                md:grid-cols-2
                lg:grid-cols-3
                2xl:grid-cols-4
                gap-10
              "
            >
              {placeData.map((item) => (
                <ListingCard data={item} key={item._id} />
              ))}
            </div>
          </Container>
        </div>
      )}
    </>
  );
};

export default IndexPage;
