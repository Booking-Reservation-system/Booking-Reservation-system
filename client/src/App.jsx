import "./App.css";
import { Route, Routes } from "react-router-dom";
import IndexPage from "./pages/IndexPage";
import ErrorPage from "./pages/ErrorPage";
import ListingPage from "./pages/ListingPage";
import TripPage from "./pages/TripPage";

function App() {
  return (
    <Routes>
      <Route index element={<IndexPage />} errorElement={<ErrorPage />} />
      <Route path="listing/:placeId" element={<ListingPage/>} />
      <Route path="trips" element={<TripPage/>} />
    </Routes>
  );
}

export default App;
