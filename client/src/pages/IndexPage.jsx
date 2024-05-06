import Container from "../components/Container";
import EmptyState from "../components/EmptyState";
import ListingCard from "../components/listing/ListingCard";
import getAllPlaces from "../action/getAllPlaces";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import {useLocation} from "react-router-dom";

const IndexPage = () => {
  const [data, setData] = useState([]);
    const location = useLocation();
    const query = new URLSearchParams(location.search);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllPlaces()
        // check login with google success
        const ggLg = async () => {
            try {
                if(query.get("auth") === null) return;
                const response = await axios.get("http://localhost:8080/auth/google/success", {
                    withCredentials: true,
                });
                console.log(response.data);
                return response.data;
            } catch (error) {
                toast.error("Something went wrong");
            }
        }
        await ggLg();

        // get renew access token
        const renewGgToken = async () => {
            try {
                if(query.get("authError") === null) return;
                const response = await axios.post("http://localhost:8080/auth/google/refresh", {
                    refreshToken: "1//0e5St58NFWnv1CgYIARAAGA4SNwF-L9IrC0hW2tdRYDUQcL1eSUJ1BN5fh7-p4PDW-qPe3dKCJj_Z7e8Ro2Ff6FDFfM-ubXAGpgE",
                    withCredentials: true,
                });
                // console.log(response.data);
                return response.data;
            } catch (error) {
                toast.error("Something went wrong");
            }
        }
        await renewGgToken();

        setData(response)
      } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong")
      }
    }
    fetchData()
  }, [])

  

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
              {data.map((item) => (
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
