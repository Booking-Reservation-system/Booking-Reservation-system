import { useNavigate } from "react-router-dom";
const Logo = () => {

  const navigate = useNavigate();

  return (
    <img
      onClick={() => navigate("/")}
      alt="Logo"
      height={80}
      width={80}
      src="/icon.png"
      className="
            hidden 
            md:block 
            cursor-pointer"
    ></img>
  );
};

export default Logo;
