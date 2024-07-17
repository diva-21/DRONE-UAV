/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box } from "@mui/material";
import Drone from "../assets/drone.jpg";
import { GiDeliveryDrone } from "react-icons/gi";
const Home = () => {
  return (
    <Box className="  w-screen h-screen pt-[100px]">
      <Box className=" flex flex-col items-center justify-center ">
        <Box className=" text-lg sm:text-2xl flex flex-col justify-center items-center mt-[100px] ">
          <img
            src={Drone}
            alt="robot"
            style={{
              height: "100px",
              width: "100px",
              borderRadius: 50,
            }}
          />

          <div className=" font-semibold mt-5 text-xl">
            WELCOME TO DRONE UAV SYSTEM
          </div>

          <div className=" font-semibold mt-5">
            BORON ANTUNA
          </div>
            <GiDeliveryDrone className=" w-20 h-20 m-5" />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
