/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import alanBtn from "@alan-ai/alan-sdk-web";
interface AlanCommand {
  [key: string]: any;
}
const alanKey =
  "1ef6d5fb7aeabe7269caaefaeb1e8a972e956eca572e1d8b807a3e2338fdd0dc/stage";

function Test() {
  const [voiceResponse, setVoiceResponse] = React.useState<string>("");
  console.log("voiceResponse", voiceResponse);

  
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
  //     alanInstance.remove();
  //   };
  // }, []);

  return (
    <div>
      <div>Response is {voiceResponse}</div>
    </div>
  );
}

export default Test;
