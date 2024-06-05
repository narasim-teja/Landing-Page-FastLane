import Experience from './Experience.jsx';
import { KeyboardControls } from '@react-three/drei';
// import Interface from './Interface.jsx';
import useGame from './stores/useGame';
import LevelEditor from './LevelEditor.jsx'; // Ensure this import is correct
import Spinner from './Spinner.jsx';
import { Canvas } from '@react-three/fiber';
import './style.css';
import React, { Suspense } from 'react';

import { io } from 'socket.io-client';


  

// const socket = io.connect("ws://10.31.1.210:3001");
// console.log(socket)
// socket.on("connect", ()=>{console.log("connected");
// socket.emit("server.revealRow",1337,1)})
// socket.on("client.revealRow", (rowId, obstaclesInRow) => {
//         console.log("Reveal data for row: " + rowId + " " + JSON.stringify(obstaclesInRow))
// });



// Define a functional component to encapsulate Zustand state usage and conditional rendering
function PlayMe() {
    const { editorOpen, addSegment, segments } = useGame(); // Use Zustand hook inside the component

    // Calculate if the LevelEditor should be shown
    const shouldShowEditor = editorOpen && segments[segments.length - 1].obstacles.length <= 10;

  
    return (
      <KeyboardControls
        map={[
          { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
          { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
          { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
          { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
        ]}
      >
          <Suspense fallback={<Spinner />}>
              <Canvas
              shadows
              camera={{
              fov: 45,
              near: 0.1,
              far: 200,
              position: [0, 4, 23] //0,4,23
              }}
          >
            
              <Experience />
          </Canvas>
          </Suspense>
          
        {/* Conditionally render LevelEditor based on editorOpen state */}
        {shouldShowEditor && <LevelEditor onObstaclesSelected={(selectedObstacles) => addSegment(selectedObstacles)}  />}
      </KeyboardControls>
    );
  }
export default PlayMe
