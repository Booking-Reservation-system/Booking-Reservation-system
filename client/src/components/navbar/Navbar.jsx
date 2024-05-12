import axios from "axios";
import toast from "react-hot-toast";
import checkRole from "../../action/getRole";
import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import Container from "../Container";
import Logo from "./Logo";
import Search from "./Search";
import UserMenu from "./UserMenu";
import Categories from "./Categories";
import Dashboard from "./dashboard";

const Navbar = () => {
  const { authToken } = useAuth();
  const [role, setRole] = useState();

  useEffect(() => {
    const fetchData = async() => {
      try {
        const response = await checkRole(authToken);
        setRole(response.data.role);
      } catch (error) {
        // toast.error("Something went wrong");
      }
    };
    fetchData();
  }, [])
  
  return (
    <div className="fixed w-full bg-white z-10 shadow-sm">
      <div className=" py-4 border-b-[1px]">
        <Container>
        <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
          <Logo />
          <Search />
            <div className="flex items-center gap-3">
              {role === 'admin' && <Dashboard />}
              <UserMenu />
            </div>
        </div>
        </Container>
      </div>
      <Categories/>
    </div>
  );
};

export default Navbar;
