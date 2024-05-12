import getAllPlaces from "../action/getAllPlaces";
import {GoCheck} from "react-icons/go"

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
          <div>
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
          <h1 className="font-bold text-xxl" style={{fontSize: '32px'}}>About Bui Nguyen Tung Lam</h1>
          
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
