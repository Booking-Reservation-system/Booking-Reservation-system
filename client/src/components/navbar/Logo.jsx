import { useNavigate } from "react-router-dom";
import ROUTES from "../../constants/routes";
const Logo = () => {

  const navigate = useNavigate();

  return (
    <img
      onClick={() => navigate(ROUTES.HOME)}
      alt="Logo"
      height={60}
      width={60}
      src="../public/icon.png"
      className="
            hidden 
            md:block 
            cursor-pointer
            w-[60px] h-[60px]"
    ></img>
  );
};

export default Logo;
