import RegisterModal from "./components/modals/RegisterModal";
import LoginModal from "./components/modals/LoginModal";
import RentModal from "./components/modals/RentModal";
import Navbar from "./components/navbar/Navbar";
import ToasterProvider from "./providers/ToasterProvider";
import Container from "./components/Container";
import EmptyState from "./components/EmptyState";
import ListingCard from "./components/listing/ListingCard";

const DUMMY_DATA = [
  {
    id: 1,
    title: "East Side Beehive",
    locationValue: "US",
    price: 315,
    imageSrc: "/Dummy_Img/Beach.webp",
    category: "Beach",
    roomCount: 3,
    bathroomCount: 2,
    guestCapacity: 6,
    description: "A beautiful beach house with a view of the ocean",
    user: "Tung Lam",
  },
  {
    id: 2,
    title: "East Side Beehive",
    locationValue: "US",
    price: 315,
    imageSrc: "/Dummy_Img/Beach.webp",
    category: "Beach",
    roomCount: 3,
    bathroomCount: 2,
    guestCapacity: 6,
    description: "A beautiful beach house with a view of the ocean",
    user: "Tung Lam",
  },
  {
    id: 3,
    title: "East Side Beehive",
    locationValue: "US",
    price: 315,
    imageSrc: "/Dummy_Img/Beach.webp",
    category: "Beach",
    roomCount: 3,
    bathroomCount: 2,
    guestCapacity: 6,
    description: "A beautiful beach house with a view of the ocean",
    user: "Tung Lam",
  },
  {
    id: 4,
    title: "East Side Beehive",
    locationValue: "US",
    price: 315,
    imageSrc: "/Dummy_Img/Beach.webp",
    category: "Beach",
    roomCount: 3,
    bathroomCount: 2,
    guestCapacity: 6,
    description: "A beautiful beach house with a view of the ocean",
    user: "Tung Lam",
  },
  {
    id: 5,
    title: "East Side Beehive",
    locationValue: "US",
    price: 315,
    imageSrc: "/Dummy_Img/Beach.webp",
    category: "Beach",
    roomCount: 3,
    bathroomCount: 2,
    guestCapacity: 6,
    description: "A beautiful beach house with a view of the ocean",
    user: "Tung Lam",
  },
  {
    id: 6,
    title: "East Side Beehive",
    locationValue: "US",
    price: 315,
    imageSrc: "/Dummy_Img/Beach.webp",
    category: "Beach",
    roomCount: 3,
    bathroomCount: 2,
    guestCapacity: 6,
    description: "A beautiful beach house with a view of the ocean",
    user: "Tung Lam",
  },
  {
    id: 7,
    title: "East Side Beehive",
    locationValue: "US",
    price: 315,
    imageSrc: "/Dummy_Img/Beach.webp",
    category: "Beach",
    roomCount: 3,
    bathroomCount: 2,
    guestCapacity: 6,
    description: "A beautiful beach house with a view of the ocean",
    user: "Tung Lam",
  },
];

const IndexPage = () => {
  const isEmpty = false;
  return (
    <>
      <ToasterProvider />
      <RentModal />
      <LoginModal />
      <RegisterModal />
      <Navbar />

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
                xl:grid-cols-4
                2xl:grid-cols-5
                gap-10
              "
            >
              {DUMMY_DATA.map((item) => (
                <ListingCard data={item} key={item.id} reservation="false" />
              ))}
            </div>
          </Container>
        </div>
      )}
    </>
  );
};

export default IndexPage;
