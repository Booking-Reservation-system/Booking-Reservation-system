import "./App.css";
import { Route, Routes } from "react-router-dom";
import IndexPage from "./pages/IndexPage";
import ErrorPage from "./pages/ErrorPage";
import ListingPage from "./pages/ListingPage";
import TripPage from "./pages/TripPage";
import FavouritePage from "./pages/FavouritePage";
import ROUTES from "./constants/routes";
function App() {
  return (
    <Routes>
      <Route index element={<IndexPage />} errorElement={<ErrorPage />} />
      <Route path={ROUTES.LISTING_DETAIL} element={<ListingPage/>} />
      <Route path={ROUTES.TRIPS} element={<TripPage/>} />
      <Route path={ROUTES.FAVOURITES} element={<FavouritePage/>} />
    </Routes>
  );
}

export default App;
