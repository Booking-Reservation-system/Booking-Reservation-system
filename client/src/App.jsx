import "./App.css";
import { Route, Routes } from "react-router-dom";
import IndexPage from "./pages/IndexPage";
import ErrorPage from "./pages/ErrorPage";
import ListingPage from "./pages/ListingPage";

function App() {
  return (
    <Routes>
      <Route index element={<IndexPage />} errorElement={<ErrorPage />} />
      <Route path="listing/:listingId" element={<ListingPage/>} />
    </Routes>
  );
}

export default App;
