import app from "./app.js";
import { connectToDatabase, disconnectFromBase } from "./db/connection.js";
import { WebSocket } from "ws";
const PORT = process.env.PORT || 5000;
export const ws = new WebSocket(process.env.WEBSOCKET_URL);
connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server Open & Connected to Database");
      connectWebSocket();
    });
  })
  .catch((err) => {
    console.log(err);
    disconnectFromBase();
  });
  const payload = {
    action: "sendMessage",
    message: "TAKEOFF",
  };
const connectWebSocket = async () => {
  try {
    console.log("ws function called in server side")

    // ws.addEventListener("error", (error) => {
    //   console.error("WebSocket error from server side.:", error);
    //   //   setIsWebSocketOpen(false);
    // });

    ws.addEventListener("open", () => {
      console.log("WebSocket connection opened from server side.");
      // ws.send(JSON.stringify(payload));
      // console.log("sent message to gs");
    });
    
    ws.addEventListener("message", (event: any) => {
      if (event.data) {
        // setErrorMessage("Data streaming paused");
        console.log("Receiving event.data in server side.:");
        // console.log("event is ",event,"typeof ",event.message);
        // const parseData=JSON.parse(event);
        // console.log("parseData",parseData);
        // console.log("parseData.message",parseData.message,typeof parseData.message);
        console.log("EVENT DATA",event.data,typeof event.data);
        const spd=event.data.split("guest:");
        let lastVal=spd[spd.length-1];
        lastVal=lastVal.trim();
        console.log("lastVal",lastVal);
        // console.log("event,data.message",event.data.message,typeof event.data.message)


        // const d=event.data;
        // if(d.message==='GroundStationConnected'){
        //   gsSock=ws;
        //   console.log("Ground Station connected",ws);
        // }
        // console.log("sent message to react client");
        // ws.send(JSON.stringify(payload));
      }
    });

    // ws.addEventListener("close", () => {
    //   console.log("WebSocket connection closed from server side..");
    //   //   setIsWebSocketOpen(false);
    // });
    // throw new Error("Random error")
  } catch (error: any) {
    console.error("Error in Sockets part in server side.:", error.message);
  }
};
