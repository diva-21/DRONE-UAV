import {connect, disconnect} from "mongoose";

// export const  ws = new WebSocket(process.env.WEBSOCKET_URL);
export async function connectToDatabase() {
  try {
    await connect(process.env.MONGODB_URL);
    // connection for websocket
    // const payload={
    //   "action":"sendMessage",
    //   "message":"Hello From Server app"
    // }
    
    // ws.on('connection', function connection(ws) {
    //   console.log('A new client Connected!');
    //   ws.send(JSON.stringify(payload));
    
    //   ws.on('message', function incoming(message) {
    //     console.log('received: %s', message);
    
    //     ws.clients.forEach(function each(client) {
    //       if (client !== ws && client.readyState === WebSocket.OPEN) {
    //         client.send(message);
    //       }
    //     });
        
    //   });
    // });
    // ws.on('connection', (w) => {
    //   console.log('A new client Connected!');
    //   ws.send(JSON.stringify(payload));
    
    //   ws.on('message', (message: string) => {
    //     console.log(`Received: ${message}`);
    //     // Echo the received message back to the client
    //     ws.send(`Server says: ${message}`);
    //   });
    
    //   ws.on('close', () => {
    //     console.log('Client disconnected');
    //   });
    // });

  } catch (error) {
    console.log(error);
    throw new Error("Cannot connect to MongoDB");
  }
}

export async function disconnectFromBase() {
  try {
    await disconnect();
    // ws.addEventListener("close", () => {
    //   console.log("WebSocket connection closed.");
    // });
  } catch (error) {
    console.log(error);
    throw new Error("Cannot disconnect from MongoDB");
  }
}