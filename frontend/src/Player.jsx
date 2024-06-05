import { useRapier, RigidBody } from '@react-three/rapier'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { useGLTF, useKeyboardControls } from '@react-three/drei'
import { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'
import useGame from './stores/useGame.jsx'
import { useFBX } from '@react-three/drei';
import { TextureLoader } from 'three';
import { revealRow } from './stores/useGame.jsx'



export default function Player()
{
    
    const [ subscribeKeys, getKeys ] = useKeyboardControls()
    const { rapier, world } = useRapier()
    const [ smoothedCameraPosition ] = useState(() => new THREE.Vector3(10, 10, 10))
    const [ smoothedCameraTarget ] = useState(() => new THREE.Vector3())
    const start = useGame((state) => state.start)
    const end = useGame((state) => state.end)
    const restart = useGame((state) => state.restart)
    const blocksCount = useGame((state) => state.blocksCount)
    const isSpeedBoostActive = useGame((state) => state.isSpeedBoostActive);
    const isSpeedReduced = useGame((state) => state.isSpeedReduced);
    const isPaused = useGame((state) => state.isPaused);
    const [simulationData, setSimulationData] = useState(null);

    const body = useRef();
    // Other player setup...

    const sessionId = 11;
    // Unique session ID for each game instance
    const lastRow = useRef(0);

    const { gl } = useThree(); // Get the WebGLRenderer from the current three.js context

    // State to hold recorded actions
    const [recordedActions, setRecordedActions] = useState([]);
    // console.log(recordedActions)

    useEffect(() => {
      async function loadJsonData() {
        try {
          const response = await fetch('./constants/playerActions.json');
          const data = await response.json();
          setSimulationData(data);
        } catch (error) {
          console.error('Error loading the JSON data: ', error);
        }
      }
  
      loadJsonData();
    }, []);
  
    

    const [simulationIndex, setSimulationIndex] = useState(0);

    // Effect hook for setting up the keydown event listener
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.code === "Space") {
                // Call your download function here
                downloadRecordedActions(recordedActions);
            }
        };

        // Add event listener
        window.addEventListener('keydown', handleKeyDown);

        // Cleanup function to remove the event listener
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [recordedActions]);
    
    const reset = () =>
    {
        body.current.setTranslation({ x: 2, y: 1, z: 7 })
        body.current.setLinvel({ x: 0, y: 0, z: 0 })
        body.current.setAngvel({ x: 0, y: 0, z: 0 })
    }

    useEffect(() =>
    {
        const unsubscribeReset = useGame.subscribe(
            (state) => state.phase,
            (value) =>
            {
                if(value === 'ready')
                    reset()
            }
        )

       

        const unsubscribeAny = subscribeKeys(
            () =>
            {
                start()
            }
        )

        return () =>
        {
            unsubscribeReset()
           
            unsubscribeAny()
        }
    }, [])

    useFrame((state, delta) =>
    {
        
        /**
         * Controls
         */

        if (isPaused) {
            // Optionally reset linear and angular velocity to 0 to stop all movement immediately
            body.current.setLinvel({ x: 0, y: 0, z: 0 });
            body.current.setAngvel({ x: 0, y: 0, z: 0 });
            return;
        }
        
        const { forward, backward, leftward, rightward } = getKeys()
        const frameNumber = state.clock.getElapsedTime() * gl.capabilities.getMaxAnisotropy(); // Frame number approximation

        const impulse = { x: 0, y: 0, z: 0 }
        const torque = { x: 0, y: 0, z: 0 }
        
        
        // Define base impulse and torque strengths
        const baseImpulseStrength = 0.6;
        const baseTorqueStrength = 0.2;

        // Define multipliers for boost and reduction
        const boostMultiplier = 3; // Increase speed
        const reductionMultiplier = 0.1; // Decrease speed
        

        

        // Calculate impulse and torque strengths
        let impulseStrength = baseImpulseStrength * 0.007;
        let torqueStrength = baseTorqueStrength * 0.007;

        if (isSpeedBoostActive && !isSpeedReduced) {
            impulseStrength *= boostMultiplier;
            torqueStrength *= boostMultiplier;
        } else if (isSpeedReduced && !isSpeedBoostActive) {
            impulseStrength *= reductionMultiplier;
            torqueStrength *= reductionMultiplier;
        }

        

        if(forward)
        {
            impulse.z -= impulseStrength
            torque.x -= torqueStrength
            setRecordedActions(prev => [...prev, { frameNumber, action: 'forward' }]);
        }

        if(rightward)
        {
            impulse.x += impulseStrength
            torque.z -= torqueStrength
            setRecordedActions(prev => [...prev, { frameNumber, action: 'right' }]);
        }

        if(backward)
        {
            impulse.z += impulseStrength
            torque.x += torqueStrength
            setRecordedActions(prev => [...prev, { frameNumber, action: 'backward' }]);
        }
        
        if(leftward)
        {
            impulse.x -= impulseStrength
            torque.z += torqueStrength
            setRecordedActions(prev => [...prev, { frameNumber, action: 'left' }]);
        }

        body.current.applyImpulse(impulse)
        body.current.applyTorqueImpulse(torque)

        

         //Make sure there is an action to simulate and we're within the bounds of the simulationData array.
    // if (simulationIndex < simulationData.length) {
    //     // Access the next action using simulationIndex.
    //     const nextAction = simulationData[simulationIndex];

    //     // Check if it's time to simulate the next action based on the frame number.
    //     if (frameNumber >= nextAction.frameNumber) {
    //         // You'll need to adjust the simulateAction function to include impulseStrength and torqueStrength calculation or handling.
    //         simulateAction(nextAction.action);

    //         // Move to the next action in the simulationData.
    //         setSimulationIndex(simulationIndex + 1);
    //     }
    // }

        

        /**
         * Camera
         */
        const bodyPosition = body.current.translation()
    
        const cameraPosition = new THREE.Vector3()
        cameraPosition.copy(bodyPosition)
        cameraPosition.z += 4.25
        cameraPosition.y += 0.95

        const cameraTarget = new THREE.Vector3()
        cameraTarget.copy(bodyPosition)
        cameraTarget.y += 0.25

        smoothedCameraPosition.lerp(cameraPosition, 5 * delta)
        smoothedCameraTarget.lerp(cameraTarget, 5 * delta)

        state.camera.position.copy(smoothedCameraPosition)
        state.camera.lookAt(smoothedCameraTarget)

        /**
        * Phases
        */
       
        const zPosition = body.current.translation().z;

        const currentRow = Math.floor(-zPosition/4.5); //when to reveal the obstacle
        // console.log(currentRow) // Assuming each unit in Z represents a row

        // Check if the player has moved to a new row
        if (currentRow > lastRow.current) {
            lastRow.current = currentRow; // Update the last row
            // Emit event to server to reveal the next row of obstacles
            revealRow(sessionId, currentRow);
        }
    
        

        if(bodyPosition.z < - (blocksCount * 4 + 2))
            end()

        if(bodyPosition.y < - 4)
            restart()
    })

    function simulateAction(action) {
        const impulse = { x: 0, y: 0, z: 0 }
        const torque = { x: 0, y: 0, z: 0 }
        let impulseStrength = 0.6 * 0.007; // Example default value
        let torqueStrength = 0.2 * 0.007; // Example default value
        switch (action) {
          case 'forward':
            impulse.z -= impulseStrength
            torque.x -= torqueStrength
            break;
          case 'right':
            impulse.x += impulseStrength
            torque.z -= torqueStrength
            break;
          case 'backward':
            impulse.z += impulseStrength
            torque.x += torqueStrength
            break;
          case 'left':
            impulse.x -= impulseStrength
            torque.z += torqueStrength
            break;
          // Handle other actions similarly
          default:
            console.log(`Unknown action: ${action}`);
        }
        body.current.applyImpulse(impulse)
        body.current.applyTorqueImpulse(torque)
      }
      

    const downloadRecordedActions = (actions) => {
        const blob = new Blob([JSON.stringify(actions, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'gameplay-actions.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    

    
    const ball = useFBX('/marble_high_poly.fbx');
    const texture = useLoader(TextureLoader, '/marbel-04.png');
    
    

    
      
    
    return (
    <>
        <RigidBody
        ref={ body }
        canSleep={ false }
        colliders="ball"
        restitution={ 0.2 }
        friction={ 1 } 
        linearDamping={ 0.5 }
        angularDamping={ 0.5 }
        position={ [ 2, 1, 7 ] }
    >
        
        {/* <primitive object={ball} scale={0.005} /> */}
        
        <mesh castShadow >
            <sphereGeometry args={[0.25, 18, 18]} />
            <meshStandardMaterial  attach="material" map={texture} />
            
        </mesh>
            
        
        </RigidBody>
    </>
    
)}