import getAllPlaces from "../action/getAllPlaces";
import {GoCheck} from "react-icons/go"
import { LuGraduationCap } from "react-icons/lu";
import { PiGlobeStand } from "react-icons/pi";
import { FaRegHeart } from "react-icons/fa";
import { RxMagicWand } from "react-icons/rx";
import { MdOutlineWorkOutline } from "react-icons/md";
import { LuLanguages } from "react-icons/lu";
import { PiMusicNotesBold } from "react-icons/pi";
import { FaRegLightbulb } from "react-icons/fa";

const ProfilePage = () => {
  return (
    <div
      className="pt-[150px] gap-4 max-w-[1540px] 
      mx-auto 
      xl:px-20
      md:px-10
      sm:px-2
      px-4"
    >
      <div className="flex flex-row gap-20">
        <div className="flex flex-col gap-10">
          <div className="flex flex-row w-[380px] h-[280px] justify-around items-center shadow-2xl rounded-[20px] gap-6 px-6 py-6">
            <div className="flex flex-col justify-center items-center text-center gap-4">
              <img
                className="rounded-full"
                width={100}
                height={100}
                src="/placeholder.jpg"
              ></img>
              <div>
                <h1 className="font-bold text-xl">Bui Nguyen Tung Lam</h1>
                <p className="text-md font-bold">Host / Organization</p>
              </div>
            </div>
            <div className="text-center">
              <h1 className="font-bold text-4xl text-[#db0b63]">1</h1>
              <p>years experience in Booking App</p>
            </div>
          </div>

          <div className="flex flex-row w-[380px] h-[280px] justify-around items-start border-2 border-gray-400 rounded-[20px] gap-6 px-6 py-6">
          <div> {/* Refactor to tailwind!!*/}
            <p className="font-bold text-xl" style={{ marginBottom: '16px' }}>Bui Nguyen Tung Lam's confirmed information</p>
            <p className="text-xl text-center" style={{ display: 'flex', alignItems: 'left', justifyContent: 'left', marginBottom: '10px'}}>
              <GoCheck className="ml-2" size={30}/>
              <span style={{ marginLeft: '25px' }}>Identity</span>
            </p>
            <p className="text-xl text-center" style={{ display: 'flex', alignItems: 'left', justifyContent: 'left', marginBottom: '10px'}}>
              <GoCheck className="ml-2" size={30}/>
              <span style={{ marginLeft: '25px' }}>Email address</span>
            </p>
            <p className="text-xl text-center" style={{ display: 'flex', alignItems: 'left', justifyContent: 'left', marginBottom: '10px'}}>
              <GoCheck className="ml-2" size={30}/>
              <span style={{ marginLeft: '25px' }}>Phone number</span>
            </p>
          </div>
        </div>

        </div>

        <div>
          <h1 className="font-bold text-xxl" style={{fontSize: '32px', marginBottom: '30px'}}>About Bui Nguyen Tung Lam</h1>

          <div> {/* change to table like display later*/}
          <p className="text-xl text-center" style={{ display: 'flex', alignItems: 'left', justifyContent: 'left', marginBottom: '10px'}}>
              <LuGraduationCap className="ml-2" size={30}/>
              <span style={{ marginLeft: '25px' }}>Where I went to college: Posts and Telecommunications Institute of Technology</span>
          </p>
          <p className="text-xl text-center" style={{ display: 'flex', alignItems: 'left', justifyContent: 'left', marginBottom: '10px'}}>
              <PiGlobeStand className="ml-2" size={30}/>
              <span style={{ marginLeft: '25px' }}>Where I live: Hanoi, Vietnam</span>
          </p>
          <p className="text-xl text-center" style={{ display: 'flex', alignItems: 'left', justifyContent: 'left', marginBottom: '10px'}}>
              <FaRegHeart className="ml-2" size={30}/>
              <span style={{ marginLeft: '25px' }}>I'm obsessed with: アニメ女子</span>
          </p>
          <p className="text-xl text-center" style={{ display: 'flex', alignItems: 'left', justifyContent: 'left', marginBottom: '10px'}}>
              <RxMagicWand className="ml-2" size={30}/>
              <span style={{ marginLeft: '25px' }}>My most useless skill: ...</span>
          </p>
          <p className="text-xl text-center" style={{ display: 'flex', alignItems: 'left', justifyContent: 'left', marginBottom: '10px'}}>
              <MdOutlineWorkOutline className="ml-2" size={30}/>
              <span style={{ marginLeft: '25px' }}>My work: 大学生</span>
          </p>
          <p className="text-xl text-center" style={{ display: 'flex', alignItems: 'left', justifyContent: 'left', marginBottom: '10px'}}>
              <LuLanguages className="ml-2" size={30}/>
              <span style={{ marginLeft: '25px' }}>Language I speak: English, Vietnamese</span>
          </p>
          <p className="text-xl text-center" style={{ display: 'flex', alignItems: 'left', justifyContent: 'left', marginBottom: '10px'}}>
              <PiMusicNotesBold className="ml-2" size={30}/>
              <span style={{ marginLeft: '25px' }}>My favorite song: Lần cuối - Ngọt</span>
          </p>
          <p className="text-xl text-center" style={{ display: 'flex', alignItems: 'left', justifyContent: 'left', marginBottom: '50px'}}>
              <FaRegLightbulb className="ml-2" size={30}/>
              <span style={{ marginLeft: '25px' }}>My fun fact: 大きなおっぱいJKが大好き</span>
          </p>
          </div>

          <div>
          <p className="text-xl text-center" style={{ display: 'flex', alignItems: 'left', justifyContent: 'left', marginBottom: '50px'}}>
            Description about yourself ...
          </p>
          </div>

          <hr style={{marginBottom: '50px'}}/>

          <div>
          <p className="font-bold text-xl" style={{ marginBottom: '16px' }}>Bui Nguyen Tung Lam's listings</p>
          {/* add logic to here later*/}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
