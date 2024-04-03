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

    const body = useRef();
    // Other player setup...

    const sessionId = 11;
    // Unique session ID for each game instance
    const lastRow = useRef(0);

    const { gl } = useThree(); // Get the WebGLRenderer from the current three.js context

    // State to hold recorded actions
    const [recordedActions, setRecordedActions] = useState([]);
    console.log(recordedActions)

    const simulationData = useRef([
        {
          "frameNumber": 66.48480000019089,
          "action": "forward"
        },
        {
          "frameNumber": 66.6208000001909,
          "action": "forward"
        },
        {
          "frameNumber": 66.74400000000016,
          "action": "forward"
        },
        {
          "frameNumber": 66.88640000057237,
          "action": "forward"
        },
        {
          "frameNumber": 67.01600000000016,
          "action": "forward"
        },
        {
          "frameNumber": 67.15200000000017,
          "action": "forward"
        },
        {
          "frameNumber": 67.28319999980944,
          "action": "forward"
        },
        {
          "frameNumber": 67.41760000038165,
          "action": "forward"
        },
        {
          "frameNumber": 67.54880000019092,
          "action": "forward"
        },
        {
          "frameNumber": 67.68480000019092,
          "action": "forward"
        },
        {
          "frameNumber": 67.81760000038166,
          "action": "forward"
        },
        {
          "frameNumber": 67.9520000000002,
          "action": "forward"
        },
        {
          "frameNumber": 68.08319999980947,
          "action": "forward"
        },
        {
          "frameNumber": 68.21919999980946,
          "action": "forward"
        },
        {
          "frameNumber": 68.3504000005724,
          "action": "forward"
        },
        {
          "frameNumber": 68.48480000019094,
          "action": "forward"
        },
        {
          "frameNumber": 68.61760000038169,
          "action": "forward"
        },
        {
          "frameNumber": 68.75040000057243,
          "action": "forward"
        },
        {
          "frameNumber": 90.61919999981023,
          "action": "right"
        },
        {
          "frameNumber": 90.75200000000098,
          "action": "right"
        },
        {
          "frameNumber": 90.88480000019172,
          "action": "right"
        },
        {
          "frameNumber": 91.01760000038246,
          "action": "right"
        },
        {
          "frameNumber": 91.14719999981025,
          "action": "right"
        },
        {
          "frameNumber": 91.29600000000099,
          "action": "right"
        },
        {
          "frameNumber": 91.43360000038246,
          "action": "right"
        },
        {
          "frameNumber": 91.57280000019172,
          "action": "right"
        },
        {
          "frameNumber": 91.6864000005732,
          "action": "right"
        },
        {
          "frameNumber": 91.816000000001,
          "action": "right"
        },
        {
          "frameNumber": 91.95200000000101,
          "action": "right"
        },
        {
          "frameNumber": 92.08319999981028,
          "action": "right"
        },
        {
          "frameNumber": 92.21919999981029,
          "action": "right"
        },
        {
          "frameNumber": 92.35200000000103,
          "action": "right"
        },
        {
          "frameNumber": 92.48640000057324,
          "action": "right"
        },
        {
          "frameNumber": 92.61760000038251,
          "action": "right"
        },
        {
          "frameNumber": 92.75200000000105,
          "action": "right"
        },
        {
          "frameNumber": 97.42080000019195,
          "action": "left"
        },
        {
          "frameNumber": 97.55040000057342,
          "action": "left"
        },
        {
          "frameNumber": 97.68319999981048,
          "action": "left"
        },
        {
          "frameNumber": 97.81600000000122,
          "action": "left"
        },
        {
          "frameNumber": 97.95200000000122,
          "action": "left"
        },
        {
          "frameNumber": 98.08319999981049,
          "action": "left"
        },
        {
          "frameNumber": 98.21280000019196,
          "action": "left"
        },
        {
          "frameNumber": 98.34400000000123,
          "action": "left"
        },
        {
          "frameNumber": 98.48640000057344,
          "action": "left"
        },
        {
          "frameNumber": 98.61280000019197,
          "action": "left"
        },
        {
          "frameNumber": 98.75200000000123,
          "action": "left"
        },
        {
          "frameNumber": 98.8831999998105,
          "action": "left"
        },
        {
          "frameNumber": 99.01760000038271,
          "action": "left"
        },
        {
          "frameNumber": 99.15200000000125,
          "action": "left"
        },
        {
          "frameNumber": 99.28640000057347,
          "action": "left"
        },
        {
          "frameNumber": 99.41760000038273,
          "action": "left"
        },
        {
          "frameNumber": 99.55040000057348,
          "action": "left"
        },
        {
          "frameNumber": 99.68319999981054,
          "action": "left"
        },
        {
          "frameNumber": 105.00480000019213,
          "action": "forward"
        },
        {
          "frameNumber": 105.14560000038287,
          "action": "forward"
        },
        {
          "frameNumber": 105.28319999981066,
          "action": "forward"
        },
        {
          "frameNumber": 105.41760000038288,
          "action": "forward"
        },
        {
          "frameNumber": 105.5440000000014,
          "action": "forward"
        },
        {
          "frameNumber": 105.68800000000141,
          "action": "forward"
        },
        {
          "frameNumber": 105.81760000038288,
          "action": "forward"
        },
        {
          "frameNumber": 105.95200000000142,
          "action": "forward"
        },
        {
          "frameNumber": 106.08480000019216,
          "action": "forward"
        },
        {
          "frameNumber": 106.21600000000143,
          "action": "forward"
        },
        {
          "frameNumber": 106.35040000057364,
          "action": "forward"
        },
        {
          "frameNumber": 106.48160000038291,
          "action": "forward"
        },
        {
          "frameNumber": 106.61119999981071,
          "action": "forward"
        },
        {
          "frameNumber": 106.75200000000144,
          "action": "forward"
        },
        {
          "frameNumber": 112.75200000000166,
          "action": "forward"
        },
        {
          "frameNumber": 112.88319999981093,
          "action": "forward"
        },
        {
          "frameNumber": 113.01760000038314,
          "action": "forward"
        },
        {
          "frameNumber": 113.15040000057388,
          "action": "forward"
        },
        {
          "frameNumber": 113.28480000019242,
          "action": "forward"
        },
        {
          "frameNumber": 113.41760000038316,
          "action": "forward"
        },
        {
          "frameNumber": 113.53919999981096,
          "action": "forward"
        },
        {
          "frameNumber": 113.68480000019242,
          "action": "forward"
        },
        {
          "frameNumber": 113.81919999981096,
          "action": "forward"
        },
        {
          "frameNumber": 113.94880000019243,
          "action": "forward"
        },
        {
          "frameNumber": 114.08319999981097,
          "action": "forward"
        },
        {
          "frameNumber": 114.21600000000171,
          "action": "forward"
        },
        {
          "frameNumber": 114.35200000000171,
          "action": "forward"
        },
        {
          "frameNumber": 118.48480000019255,
          "action": "right"
        },
        {
          "frameNumber": 118.61760000038329,
          "action": "right"
        },
        {
          "frameNumber": 118.75040000057403,
          "action": "right"
        },
        {
          "frameNumber": 118.88480000019257,
          "action": "right"
        },
        {
          "frameNumber": 119.01919999981111,
          "action": "right"
        },
        {
          "frameNumber": 119.15200000000185,
          "action": "right"
        },
        {
          "frameNumber": 119.28160000038332,
          "action": "right"
        },
        {
          "frameNumber": 119.41760000038332,
          "action": "right"
        },
        {
          "frameNumber": 119.55040000057406,
          "action": "right"
        },
        {
          "frameNumber": 119.6848000001926,
          "action": "right"
        },
        {
          "frameNumber": 119.81760000038334,
          "action": "right"
        },
        {
          "frameNumber": 119.95040000057408,
          "action": "right"
        },
        {
          "frameNumber": 120.08480000019262,
          "action": "right"
        },
        {
          "frameNumber": 120.21600000000188,
          "action": "right"
        },
        {
          "frameNumber": 134.3600000000019,
          "action": "left"
        },
        {
          "frameNumber": 134.48319999981115,
          "action": "left"
        },
        {
          "frameNumber": 134.61760000038336,
          "action": "left"
        },
        {
          "frameNumber": 134.74880000019263,
          "action": "left"
        },
        {
          "frameNumber": 134.88480000019263,
          "action": "left"
        },
        {
          "frameNumber": 135.01760000038337,
          "action": "left"
        },
        {
          "frameNumber": 135.1504000005741,
          "action": "left"
        },
        {
          "frameNumber": 135.28319999981116,
          "action": "left"
        },
        {
          "frameNumber": 135.41760000038335,
          "action": "left"
        },
        {
          "frameNumber": 135.5504000005741,
          "action": "left"
        },
        {
          "frameNumber": 135.68319999981114,
          "action": "left"
        },
        {
          "frameNumber": 135.81760000038335,
          "action": "left"
        },
        {
          "frameNumber": 135.9504000005741,
          "action": "left"
        },
        {
          "frameNumber": 136.08319999981114,
          "action": "left"
        },
        {
          "frameNumber": 136.21760000038333,
          "action": "left"
        },
        {
          "frameNumber": 136.3488000001926,
          "action": "left"
        },
        {
          "frameNumber": 136.48640000057406,
          "action": "left"
        },
        {
          "frameNumber": 141.41760000038323,
          "action": "forward"
        },
        {
          "frameNumber": 141.5488000001925,
          "action": "forward"
        },
        {
          "frameNumber": 141.6848000001925,
          "action": "forward"
        },
        {
          "frameNumber": 141.81760000038324,
          "action": "forward"
        },
        {
          "frameNumber": 141.95200000000176,
          "action": "forward"
        },
        {
          "frameNumber": 142.083199999811,
          "action": "forward"
        },
        {
          "frameNumber": 142.21760000038321,
          "action": "forward"
        },
        {
          "frameNumber": 142.34880000019248,
          "action": "forward"
        },
        {
          "frameNumber": 142.483199999811,
          "action": "forward"
        },
        {
          "frameNumber": 142.61600000000172,
          "action": "forward"
        },
        {
          "frameNumber": 142.75200000000171,
          "action": "forward"
        },
        {
          "frameNumber": 142.88319999981096,
          "action": "forward"
        },
        {
          "frameNumber": 143.01600000000167,
          "action": "forward"
        },
        {
          "frameNumber": 143.1488000001924,
          "action": "forward"
        },
        {
          "frameNumber": 143.28319999981093,
          "action": "forward"
        },
        {
          "frameNumber": 143.41600000000167,
          "action": "forward"
        },
        {
          "frameNumber": 149.01919999981075,
          "action": "forward"
        },
        {
          "frameNumber": 149.1424000005737,
          "action": "forward"
        },
        {
          "frameNumber": 149.28319999981076,
          "action": "forward"
        },
        {
          "frameNumber": 149.4160000000015,
          "action": "forward"
        },
        {
          "frameNumber": 149.5424000005737,
          "action": "forward"
        },
        {
          "frameNumber": 149.68319999981077,
          "action": "forward"
        },
        {
          "frameNumber": 149.81119999981075,
          "action": "forward"
        },
        {
          "frameNumber": 149.94240000057368,
          "action": "forward"
        },
        {
          "frameNumber": 150.08480000019222,
          "action": "forward"
        },
        {
          "frameNumber": 157.55200000000116,
          "action": "forward"
        },
        {
          "frameNumber": 157.68319999981043,
          "action": "forward"
        },
        {
          "frameNumber": 157.8176000003826,
          "action": "forward"
        },
        {
          "frameNumber": 157.94880000019188,
          "action": "forward"
        },
        {
          "frameNumber": 158.0831999998104,
          "action": "forward"
        },
        {
          "frameNumber": 158.21600000000112,
          "action": "forward"
        },
        {
          "frameNumber": 158.35040000057333,
          "action": "forward"
        },
        {
          "frameNumber": 158.48319999981038,
          "action": "forward"
        },
        {
          "frameNumber": 158.61919999981038,
          "action": "forward"
        },
        {
          "frameNumber": 158.7504000005733,
          "action": "forward"
        },
        {
          "frameNumber": 158.88480000019183,
          "action": "forward"
        },
        {
          "frameNumber": 159.01600000000107,
          "action": "forward"
        },
        {
          "frameNumber": 159.15200000000107,
          "action": "forward"
        },
        {
          "frameNumber": 159.2831999998103,
          "action": "forward"
        },
        {
          "frameNumber": 159.41760000038252,
          "action": "forward"
        },
        {
          "frameNumber": 173.94240000057263,
          "action": "right"
        },
        {
          "frameNumber": 174.08480000019117,
          "action": "right"
        },
        {
          "frameNumber": 174.21440000057262,
          "action": "right"
        },
        {
          "frameNumber": 174.35040000057262,
          "action": "right"
        },
        {
          "frameNumber": 174.4816000003819,
          "action": "right"
        },
        {
          "frameNumber": 174.6160000000004,
          "action": "right"
        },
        {
          "frameNumber": 174.74880000019115,
          "action": "right"
        },
        {
          "frameNumber": 174.87519999980967,
          "action": "right"
        },
        {
          "frameNumber": 175.0160000000004,
          "action": "right"
        },
        {
          "frameNumber": 175.1504000005726,
          "action": "right"
        },
        {
          "frameNumber": 175.28160000038187,
          "action": "right"
        },
        {
          "frameNumber": 175.41760000038187,
          "action": "right"
        },
        {
          "frameNumber": 175.54719999980966,
          "action": "right"
        },
        {
          "frameNumber": 175.68319999980966,
          "action": "right"
        },
        {
          "frameNumber": 175.8144000005726,
          "action": "right"
        },
        {
          "frameNumber": 175.95040000057259,
          "action": "right"
        },
        {
          "frameNumber": 180.88960000038168,
          "action": "forward"
        },
        {
          "frameNumber": 181.01919999980944,
          "action": "forward"
        },
        {
          "frameNumber": 181.15200000000016,
          "action": "forward"
        },
        {
          "frameNumber": 181.29760000038164,
          "action": "forward"
        },
        {
          "frameNumber": 181.42240000057237,
          "action": "forward"
        },
        {
          "frameNumber": 181.55200000000016,
          "action": "forward"
        },
        {
          "frameNumber": 181.69919999980942,
          "action": "forward"
        },
        {
          "frameNumber": 181.84800000000016,
          "action": "forward"
        },
        {
          "frameNumber": 181.97600000000014,
          "action": "forward"
        },
        {
          "frameNumber": 182.15040000057235,
          "action": "forward"
        },
        {
          "frameNumber": 182.23200000000014,
          "action": "forward"
        },
        {
          "frameNumber": 182.3551999998094,
          "action": "forward"
        },
        {
          "frameNumber": 182.4911999998094,
          "action": "forward"
        },
        {
          "frameNumber": 182.6176000003816,
          "action": "forward"
        },
        {
          "frameNumber": 188.07200000000003,
          "action": "left"
        },
        {
          "frameNumber": 188.2176000003815,
          "action": "left"
        },
        {
          "frameNumber": 188.35040000057225,
          "action": "left"
        },
        {
          "frameNumber": 188.4831999998093,
          "action": "left"
        },
        {
          "frameNumber": 188.6176000003815,
          "action": "left"
        },
        {
          "frameNumber": 188.74880000019076,
          "action": "left"
        },
        {
          "frameNumber": 188.87840000057224,
          "action": "left"
        },
        {
          "frameNumber": 189.0096000003815,
          "action": "left"
        },
        {
          "frameNumber": 189.15040000057226,
          "action": "left"
        },
        {
          "frameNumber": 189.28160000038153,
          "action": "left"
        },
        {
          "frameNumber": 189.41600000000005,
          "action": "left"
        },
        {
          "frameNumber": 189.5488000001908,
          "action": "left"
        },
        {
          "frameNumber": 189.6848000001908,
          "action": "left"
        },
        {
          "frameNumber": 189.81600000000003,
          "action": "left"
        },
        {
          "frameNumber": 189.94880000019077,
          "action": "left"
        },
        {
          "frameNumber": 190.0831999998093,
          "action": "left"
        },
        {
          "frameNumber": 190.216,
          "action": "left"
        },
        {
          "frameNumber": 190.34880000019075,
          "action": "left"
        },
        {
          "frameNumber": 190.48319999980927,
          "action": "left"
        },
        {
            "frameNumber": 1633.3439999999946,
            "action": "right"
          },
          {
            "frameNumber": 1633.5439999999946,
            "action": "right"
          },
          {
            "frameNumber": 1633.6127999992316,
            "action": "right"
          },
          {
            "frameNumber": 1633.734399999613,
            "action": "right"
          },
          {
            "frameNumber": 1633.8799999999944,
            "action": "right"
          },
          {
            "frameNumber": 1634.0143999996128,
            "action": "right"
          },
          {
            "frameNumber": 1634.1439999999943,
            "action": "right"
          }
      ]).current;

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
        body.current.setTranslation({ x: 2, y: 1, z: -2 })
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

        

         // Make sure there is an action to simulate and we're within the bounds of the simulationData array.
    if (simulationIndex < simulationData.length) {
        // Access the next action using simulationIndex.
        const nextAction = simulationData[simulationIndex];

        // Check if it's time to simulate the next action based on the frame number.
        if (frameNumber >= nextAction.frameNumber) {
            // You'll need to adjust the simulateAction function to include impulseStrength and torqueStrength calculation or handling.
            simulateAction(nextAction.action);

            // Move to the next action in the simulationData.
            setSimulationIndex(simulationIndex + 1);
        }
    }

        

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

        const currentRow = Math.floor(-zPosition/4);
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
        position={ [ 2, 1, -2 ] }
    >
        
        {/* <primitive object={ball} scale={0.005} /> */}
        
        <mesh castShadow >
            <sphereGeometry args={[0.25, 18, 18]} />
            <meshStandardMaterial  attach="material" map={texture} />
            
        </mesh>
            
        
        </RigidBody>
    </>
    
)}