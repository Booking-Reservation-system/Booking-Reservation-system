import "./App.css";
import RegisterModal from "./components/modals/RegisterModal";
import LoginModal from "./components/modals/LoginModal";
import Navbar from "./components/navbar/Navbar";
import ToasterProvider from "./providers/ToasterProvider";

function App() {
  return (
    <>
      <ToasterProvider/>
      <LoginModal/>
      <RegisterModal/>
      <Navbar />
    </>
  );
}

export default App;
