import RegisterModal from "./components/modals/RegisterModal";
import LoginModal from "./components/modals/LoginModal";
import Navbar from "./components/navbar/Navbar";
import ToasterProvider from "./providers/ToasterProvider";

const IndexPage = () => {
    return (
        <>
          <ToasterProvider/>
          <LoginModal/>
          <RegisterModal/>
          <Navbar />
        </>
      );
}

export default IndexPage;