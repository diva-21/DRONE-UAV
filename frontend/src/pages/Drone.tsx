/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from 'react-hot-toast';
import alanBtn from "@alan-ai/alan-sdk-web";
interface AlanCommand {
  [key: string]: any;
}
const alanKey ='3d7156a7f223d08eea3f20b4090a50732e956eca572e1d8b807a3e2338fdd0dc/stage'
  // "7866e857e190d5bf69caaefaeb1e8a972e956eca572e1d8b807a3e2338fdd0dc/stage";

function Drone() {
  const [voiceResponse, setVoiceResponse] = React.useState<string>("");
  console.log("voiceResponse", voiceResponse);
  // const [commands, setCommands] = React.useState<any>([]);
  const [message, setMessage] = useState<string>("");
  const [showMessage, setShowMessage] = useState<Array<any>>([]);
  const [wss, setWss] = React.useState<WebSocket>();
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendPayload();
    }
  };
  const sendPayload = async () => {
    try {
      const resp = await axios.post(
        "http://localhost:5000/api/v1/user/intent",
        { data: message.toUpperCase() }
      );
      const data = resp.data;
      console.log("response from server", data);
      toast.success("Command sent successfully");
      setMessage("");
    } catch (error) {
      console.error(error);
      toast.error("Error in sending command");
    }
  };
  const websocketUrl =
    "wss://yw9v2tyflf.execute-api.us-east-1.amazonaws.com/production/";

  useEffect(() => {
    const connectWebSocket = async () => {
      try {
        if (!websocketUrl) {
          console.error(
            "WebSocket URL is not defined in the environment variables."
          );
        } else {
          const ws = new WebSocket(websocketUrl);

          // const ws = new WebSocket("ws://34.135.191.51:8765/home/server");
          // const ws = new WebSocket("wss://xa7rjbut51.execute-api.us-east-1.amazonaws.com/testing/");
          ws.addEventListener("error", (error) => {
            console.error("WebSocket error:", error);
            //   setIsWebSocketOpen(false);
          });

          ws.addEventListener("open", () => {
            console.log("WebSocket connection opened from client side..");
            // const payload = {
            //   action: "sendMessage",
            //   message: "Hello From Client react app",
            // };
            // ws.send(JSON.stringify(payload));

            //   console.log("sent message to server")
            //   setIsWebSocketOpen(true);
          });
          ws.addEventListener("close", () => {
            console.log("WebSocket connection closed from client side..");
            //   setIsWebSocketOpen(false);
          });

          // throw new Error("Random error")
          ws.addEventListener("message", (event: any) => {
            if (event.data) {
              // setErrorMessage("Data streaming paused");
              console.log("Receiving event.data in client side.:");
              console.log(event.data);
              const array = [
                "NORTH",
                "EAST",
                "WEST",
                "SOUTH",
                "TAKEOFF",
                "RTL",
                "STATUS",
              ];
              const eventString: string = event.data; // Replace with your actual event string

              if (array.some((word) => eventString.includes(word))) {
                console.log("Don't show");
              } else {
                console.log("Show");
                console.log("eventString", eventString);
                if (!showMessage.includes(eventString)) {
                  // If not, update the state with a new array including the new message
                  setShowMessage((prev) => [...prev, eventString]);
                }
              }
            }
          });
          setWss(ws);

          return () => {
            ws.close();
          };
        }
      } catch (error: any) {
        console.error("Error in Sockets part in client side.:", error.message);
      }
    };

    connectWebSocket();
  }, []);


  useEffect(() => {
    alanBtn({
      key: alanKey,
      onCommand: (commandObject: AlanCommand) => {
        const command = commandObject.command;
        const response=commandObject.response;
        if (command === 'testCommand') {
          alert('This code was executed');
        }
        else if(command==='droneCommand'){
          console.log(response);
          setVoiceResponse(response);
        }
        else if(command==='droneCommandList'){
          console.log("this statement is executed")
          // console.log("list",response);
          // setCommands(response);
        }
      },
    });
  }, []);
  // useEffect(() => {
  //   const alanInstance = alanBtn({
  //     key: alanKey,
  //     onCommand: (commandObject: AlanCommand) => {
  //       const command = commandObject.command;
  //       const response = commandObject.response;
  
  //       if (command === "testCommand") {
  //         alert("This code was executed");
  //       } else if (command === "droneCommand") {
  //         console.log(response);
  //         setVoiceResponse(response);
  //       } else if (command === "droneCommandList") {
  //         console.log("this statement is executed");
  //         // Handle droneCommandList if needed
  //       }
  //     },
  //   });
  
  //   return () => {
  //     // Cleanup function to remove Alan instance when the component unmounts
  //       // alanInstance.destroy();
  //   };
  // }, []);

  
  return (
    <div className="pt-[100px] w-screen h-screen">
      <div className="text-center flex justify-center items-center flex-col text-lg sm:text-2xl text-blue-400 mt-10">
        <div className="font-bold text-2xl text-yellow-400">
          Voice Response is {voiceResponse}
        </div>


         <div className=" w-1/2 flex justify-center items-center flex-col">
          <input
            type="text"
            placeholder="Enter command here"
            value={message}
            className=" w-full p-2"
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button className=" bg-blue-500 rounded-md px-4 py-2 mt-10 text-white text-lg sm:text-2xl" onClick={sendPayload}>Send</button>
        </div>
        

        <div className=" mt-10">
          <div className=" font-bold text-2xl text-yellow-400">
          Response from Drone
          </div>
          <div className=" flex flex-col flex-wrap">
            {showMessage.map((msg, index) => {
              return (
                <div className=" mt-2 font-semi" key={index}>
                  {msg}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Drone;

//  **********************ALAN AI CODE WHICH IS NOT SERVING THE PURPOSE****************




// const sendMsgToWS = () => {
//   console.log("sendMsgToWS called");
//   if (wss) {
//     console.log("Sending message to server");
//     const payload = {
//       action: "sendMessage",
//       message: "Hello From Client react app",
//     };
//     wss.send(JSON.stringify(payload));
//   }
// };
