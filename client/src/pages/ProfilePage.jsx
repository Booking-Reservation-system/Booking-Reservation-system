import { GoCheck } from "react-icons/go";
import { LuGraduationCap } from "react-icons/lu";
import { PiGlobeStand } from "react-icons/pi";
import { FaRegHeart } from "react-icons/fa";
import { MdOutlineWorkOutline } from "react-icons/md";
import { LuLanguages } from "react-icons/lu";
import { PiMusicNotesBold } from "react-icons/pi";

import ListingUser from "../components/listing/ListingUser";
import ListingFooter from "../components/listing/ListingFooter";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import { useEffect, useState } from "react";

const ProfilePage = () => {
  const { authToken } = useAuth();
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/profile", {
          headers: {
            Authorization: "Bearer " + authToken,
          },
          withCredentials: true,
        });
        setUserData(response.data.profile);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserData();
  }, []);

  console.log(userData);

  return (
    <>
      <div
        className="pt-[150px] gap-4 max-w-[1540px] 
      mx-auto 
      xl:px-20
      md:px-10
      sm:px-2
      px-4
      pb-20"
      >
        <div className="grid grid-cols-3 gap-20">
          <div className="flex flex-col gap-10 col-span-1 relative">
            <div className="flex flex-col gap-8 sticky top-[100px]">
              <div className="flex flex-row w-[380px] h-[280px] justify-around items-center shadow-2xl rounded-[20px] px-6 py-6">
                <div className="flex flex-col justify-center items-center text-center gap-4">
                  <img
                    className="rounded-full"
                    width={100}
                    height={100}
                    src="/placeholder.jpg"
                  ></img>
                  <div>
                    <h1 className="font-bold text-xl">{userData?.name}</h1>
                    <p className="text-md font-bold">Host / Organization</p>
                  </div>
                </div>
                <div className="text-center">
                  <h1 className="font-bold text-4xl text-[#db0b63]">1</h1>
                  <p>years experience in Booking App</p>
                </div>
              </div>

              <div className="flex flex-row w-[380px] h-[240px] justify-around items-start border-2 border-gray-400 rounded-[20px] gap-6 px-6 py-6">
                <div>
                  <p className="font-bold text-xl mb-4">
                    {userData?.name}'s confirmed information
                  </p>
                  <div className="text-xl text-center flex flex-row justify-start mb-[10px]">
                    <GoCheck className="ml-2" size={30} />
                    <span className="ml-6">Identity</span>
                  </div>
                  <div className="text-xl text-center flex flex-row justify-start mb-[10px]">
                    <GoCheck className="ml-2" size={30} />
                    <span className="ml-6">Email address</span>
                  </div>
                  <div className="text-xl text-center flex flex-row justify-start mb-[10px]">
                    <GoCheck className="ml-2" size={30} />
                    <span className="ml-6">Phone number</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-12 col-span-2">
            <h1 className="font-bold text-4xl">About {userData?.name}</h1>

            <div className="grid grid-cols-2 gap-6">
              {/* change to table like display later*/}
              <div className="text-xl text-left flex flex-row gap-4">
                <LuGraduationCap className="ml-2" size={30} />
                <span>Where I went to college: PTIT</span>
              </div>
              <div className="text-xl text-left flex flex-row gap-4">
                <PiGlobeStand className="ml-2" size={30} />
                <span>Where I live: Hanoi, Vietnam</span>
              </div>
              <div className="text-xl text-left flex flex-row gap-4">
                <FaRegHeart className="ml-2" size={30} />
                <span>I'm obsessed with: Code</span>
              </div>
              <div className="text-xl text-left flex flex-row gap-4">
                <MdOutlineWorkOutline className="ml-2" size={30} />
                <span>My work: Developer</span>
              </div>
              <div className="text-xl text-left flex flex-row gap-4">
                <LuLanguages className="ml-2" size={30} />
                <span>Language I speak: English, Vietnamese</span>
              </div>
              <div className="text-xl text-left flex flex-row gap-4">
                <PiMusicNotesBold className="ml-2" size={30} />
                <span>My favorite song: Lần cuối - Ngọt</span>
              </div>
            </div>

            <hr />

            <div>
              <p className="font-bold text-xl" style={{ marginBottom: "16px" }}>
                {userData.name}'s listings
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
              {userData?.places?.map((item) => (
                <ListingUser userData={item} key={item._id} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <ListingFooter isUser={null} />
    </>
  );
};

export default ProfilePage;
