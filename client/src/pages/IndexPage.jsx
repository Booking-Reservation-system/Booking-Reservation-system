
import Container from "../components/Container";
import EmptyState from "../components/EmptyState";
import ListingCard from "../components/listing/ListingCard";
import getAllPlaces from "../action/getAllPlaces";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const IndexPage = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllPlaces()
        setData(response)
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
