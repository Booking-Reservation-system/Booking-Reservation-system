
import Container from "../components/Container";
import EmptyState from "../components/EmptyState";
import ListingCard from "../components/listing/ListingCard";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const IndexPage = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/place")
        setData(response.data.places)
      } catch (error) {
        toast.error("Something went wrong")
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
                <ListingCard data={item} key={item._id} reservation="false" />
              ))}
            </div>
          </Container>
        </div>
      )}
    </>
  );
};

export default IndexPage;
