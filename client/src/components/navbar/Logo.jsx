import { useNavigate } from "react-router-dom";
const Logo = () => {

  const navigate = useNavigate();

  return (
    <img
      onClick={() => navigate("/")}
      alt="Logo"
      height={50}
      width={50}
      src="/icon.png"
      className="
            hidden 
            md:block 
            cursor-pointer
            w-[50px] h-[50px]"
    ></img>
  );
};

export default Logo;
