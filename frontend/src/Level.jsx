import * as THREE from 'three'
import { Float, Text, useFBX, useGLTF } from "@react-three/drei"
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import {useAnimations} from '@react-three/drei'
import { useEffect, useMemo, useRef, useState } from "react"
import { useFrame } from '@react-three/fiber'
import useGame from './stores/useGame.jsx'
import { Perf } from "r3f-perf";
import { useObstacleComponentById } from './useObstacleComponentById';

// const OBSTACLE_COMPONENT_MAP = {
//    "1": WhaleObstacle,
//    "2": TextObstacle,
//    "3": PoopObstacle,
//    "4": GreenCandle_1,
//     // CrystalObstacle_1,
//   };


  

export function BlockStart({position=[0,0,0]}){
    
    return<group position={position} >
        {/* <mesh receiveShadow position={[0,-0.1,0]} >
            <boxGeometry args={[5,0.2,5]} />
            <meshStandardMaterial color="limegreen" />
        </mesh> */}
        
    </group>
     
}


export function WhaleObstacle({ position = [0, 0, 0] }) {
    const originalWhale = useFBX('/gold_coin_spork_1_raised.fbx');
    // Clone the object for a unique instance
    const whale = useMemo(() => originalWhale.clone(), [originalWhale]);
    const { activateSpeedBoost } = useGame();

    const [isGameReady, setGameReady] = useState(false);

    useEffect(() => {
        // Example condition to set the game as ready, could be based on player movement or a timer
        const timer = setTimeout(() => setGameReady(true), 1000); // Wait for 1 second after load
        return () => clearTimeout(timer);
    }, []);

    const handleCollisionExit = () => {
        if (isGameReady) {
            console.log("activating speed activation.");
            activateSpeedBoost();
        }
    };

    return (
        <group position={position}>
            {/* <mesh receiveShadow position={[0, -0.1, 0]}>
                <boxGeometry args={[5, 0.2, 5]} />
                <meshStandardMaterial color="greenyellow" />
            </mesh> */}
            <RigidBody 
                colliders="hull" 
                restitution={0.2} 
                friction={1}
                onCollisionExit={handleCollisionExit}
                

            > 
                    <primitive object={whale} scale={0.007} position={[-2.9,0,0]} />   
            </RigidBody>
            
            
        </group>
    );
}



export function TextObstacle({position=[0,0,0]}){

    const originalWagmi = useFBX('/wagmi_sml.fbx')
    const obref = useRef()

    const wagmi = useMemo(() => originalWagmi.clone(), [originalWagmi])

    

    // useFrame((state) =>
    // {
    //     if(obref.current) {
    //     const time = state.clock.getElapsedTime()

    //     const x = Math.sin(time ) * 1.1
    //     obref.current.setNextKinematicTranslation({ x: position[0] + x, y: position[1] +0.50 , z: position[2] })
    //     }
    // })
    
    return<group position={position} >
        {/* <mesh receiveShadow position={[0,-0.1,0]} >
            <boxGeometry args={[5,0.2,5]} />
            <meshStandardMaterial color="greenyellow" />
        </mesh> */}

        <RigidBody ref={ obref } type="kinematicPosition"  restitution={ 0.2 } friction={ 0 } >
            <primitive object={wagmi} scale={0.01} position={[-1.6,0.25,0]} />
        </RigidBody>
    </group>
     
}

// export function SpawnObs({col,row,obstacleId}){
       
//         const position = useMemo(() => [col , 0.5, -row * 5], [col, row]);
        
//         const originalPoop = useFBX('/poop_final.fbx')
        
    
//         const poop = useMemo(() => originalPoop.clone(), [originalPoop])
    
//         const { activateSpeedReduction } = useGame();
    
//         const [isGameReady, setGameReady] = useState(false);
    
//         useEffect(() => {
//             // Example condition to set the game as ready, could be based on player movement or a timer
//             const timer = setTimeout(() => setGameReady(true), 1000); // Wait for 1 second after load
//             return () => clearTimeout(timer);
//         }, []);
    
//         const handleCollisionExit = () => {
//             if (isGameReady) {
//                 console.log("activating speed reduction.");
//                 activateSpeedReduction();
//             }
//         };
      
//         return<group position={position} >
//             {/* <mesh receiveShadow position={[0,-0.1,0]} >
//                 <boxGeometry args={[5,0.2,5]} />
//                 <meshStandardMaterial color="greenyellow" />
//             </mesh> */}
    
//             <RigidBody 
//                 colliders="hull" 
//                 restitution={0.2} 
//                 friction={1} 
//                 onCollisionExit={handleCollisionExit}  
//             >
//                 <primitive object={poop} scale={0.004} position={[0,0,0]} rotation-x={-Math.PI/2} />
//             </RigidBody>
            
         
//      </group>
         
// }

export function ObstacleSpawner  ({ row, col, obstacleId })  {
    const ObstacleComponent = useObstacleComponentById(obstacleId);
    if (!ObstacleComponent) return null;

    const position = [col , 0, -row * 5]; // Adjust based on your coordinate system
    return <ObstacleComponent position={position} />;
};



export function PoopObstacle({position=[0,0,0]}){
    // const { scene, animations } = useGLTF('/poop_final.gltf'); // Assuming the file is now a GLTF

    const originalPoop = useFBX('/poop_final.fbx')

    const poop = useMemo(() => originalPoop.clone(), [originalPoop])

    const { activateSpeedReduction } = useGame();

    const [isGameReady, setGameReady] = useState(false);

    useEffect(() => {
        // Example condition to set the game as ready, could be based on player movement or a timer
        const timer = setTimeout(() => setGameReady(true), 1000); // Wait for 1 second after load
        return () => clearTimeout(timer);
    }, []);

    const handleCollisionExit = () => {
        if (isGameReady) {
            console.log("activating speed reduction.");
            activateSpeedReduction();
        }
    };
  
    return<group position={position} >
        {/* <mesh receiveShadow position={[0,-0.1,0]} >
            <boxGeometry args={[5,0.2,5]} />
            <meshStandardMaterial color="greenyellow" />
        </mesh> */}

        <RigidBody 
            colliders="hull" 
            restitution={0.2} 
            friction={1} 
            onCollisionExit={handleCollisionExit}  
        >
            <primitive object={poop} scale={0.007} position={[1,0.8,1.6]} rotation-x={-Math.PI/2} />
        </RigidBody>
        
     
    </group>
     
}

export function GreenCandle_1({position=[0,0,0]}){
    

    const originalGreen_1 = useFBX('/green_candle_1.fbx')
    const obstacleRef = useRef()

    const green_1 = useMemo(() => originalGreen_1.clone(), [originalGreen_1])
    

    useFrame((state) => {
        if (obstacleRef.current) {
            
            const time = state.clock.getElapsedTime();
            // Create a new THREE.Quaternion for rotation
            const rotation = new THREE.Quaternion();
            rotation.setFromEuler(new THREE.Euler(0, time, 0)); 
            obstacleRef.current.setNextKinematicRotation(rotation);
        }
    });
  
    return<group position={position} >
        {/* <mesh receiveShadow position={[0,-0.1,0]} >
            <boxGeometry args={[5,0.2,5]} />
            <meshStandardMaterial color="greenyellow" />
        </mesh> */}
        <RigidBody ref={ obstacleRef } type="kinematicPosition" restitution={ 0.2 } friction={ 1 }> 

            <primitive object={green_1} scale={0.005} position={[2.1,0.2,0]} rotation-z={Math.PI/2}  />
        </RigidBody>
        
    </group>
     
}

// export function CrystalObstacle_1({ position = [0, 0, 0] }) {
//     const originalCrystal = useFBX('/crystals_part1.fbx');
    
//     // Clone the object for a unique instance
//     const crystal = useMemo(() => originalCrystal.clone(), [originalCrystal]);
//     console.log(crystal)
    
//     return (
//         <group position={position}>
//             {/* <mesh receiveShadow position={[0, -0.1, 0]}>
//                 <boxGeometry args={[5, 0.2, 5]} />
//                 <meshStandardMaterial color="greenyellow" />
//             </mesh> */}
//             <RigidBody 
//                 colliders="trimesh" 
//                 restitution={0.2} 
//                 friction={1}
//             > 
//                     <primitive object={crystal} scale={0.003} position={[0,0,0]} />   
//             </RigidBody>
            
//         </group>
//     );
// }

export function BlockEnd({position=[0,0,0]}){
    return<group position={position} >
        <Text
            font="/bebas-neue-v9-latin-regular.woff"
            scale={ 1 }
            position={ [ 0, 1.25, -1 ] }
        >
            Checkpoint
            <meshBasicMaterial toneMapped={ false } />
        </Text>
        <mesh receiveShadow position={[2,0,-3]} >
            <boxGeometry args={[5,0.1,5]} />
            <meshStandardMaterial color="limegreen" />
        </mesh>

        {/*Contuie button*/}

        {/* <mesh position={[2,2,-1]} rotation-x={Math.PI/2}
            
         >
           
            <boxGeometry args={[1.2,0.1,0.47]}  />
            <meshStandardMaterial color="green" />
        </mesh>
        <mesh position={[2,2,-1]} rotation-x={Math.PI/2}>
            <Text
                font="/bebas-neue-v9-latin-regular.woff"
                scale={ 0.19 }
                maxWidth={ 6 }
                lineHeight={ 0.75 }
                rotation-x={-Math.PI/2}
                position={[0.04,0.06,0]}
                
            >
                Click to Continue to the next segment!
                <meshBasicMaterial toneMapped={ false } />
            </Text>
        </mesh> */}

        {/*New segment road */}

        {/* <mesh position={[2,1,-1]} rotation-x={Math.PI/2}
            onClick={() => console.log("hee")}
         >
           
            <boxGeometry args={[1.2,0.1,0.47]}  />
            <meshStandardMaterial color="green" />
        </mesh> */}
        {/* <mesh position={[2,1,-1]} rotation-x={Math.PI/2}>
            <Text
                font="/bebas-neue-v9-latin-regular.woff"
                scale={ 0.19 }
                maxWidth={ 6 }
                lineHeight={ 0.75 }
                rotation-x={-Math.PI/2}
                position={[0.04,0.06,0]}
                
            >
                Click to build the segment!
                <meshBasicMaterial toneMapped={ false } />
            </Text>
        </mesh> */}

    </group>
     
}

function Bounds({length=5, onClick}) {

    
    const originalCorridor = useFBX('/cooridor.fbx');

    const corridor = useMemo(() => originalCorridor.clone(), [originalCorridor])

    const { activatePause } = useGame();

    const handleCheckpointEnter = () => {
        activatePause()
        
         onClick()
        
        
        
    }


    return <>
        
        <RigidBody type="fixed" colliders="trimesh" restitution={ 0.2 } friction={ 1 }  >
            
        <primitive object={corridor} scale={[0.014,0.01, (0.00668 * length)]} position={[2,-0.21,-(2 * length) -3]}  />
        <CuboidCollider
                type="fixed"
                args={ [ 2.5, 0, 2.5 ] }
                position={ [ 2, 0, - (5 * length) -3 ] }
                restitution={ 0.2}
                friction={ 1 }
                onCollisionEnter={handleCheckpointEnter}
            />
            
        </RigidBody>
    </>
    
}




export  function Level({obstaclesArray, onAddSegment, position }) {
    const obstacles = obstaclesArray.obstacles || [];
    // console.log(obstacles)

    return(
        <group position={position}>
        
            {obstacles.map((obstacleId, index) => {
                if (obstacleId === 0) return null; // Skip if no obstacle
                const row = Math.floor(index / 5);
                const col = index % 5;
                return <ObstacleSpawner key={index} row={row} col={col} obstacleId={obstacleId.toString()} />;
            })}
          <BlockStart position={[0, 0, 0]} />
          <BlockEnd position={[0, 0, -((4 + 1) * 5)]}  />
          <Bounds length={4 + 1} onClick={onAddSegment} />
          
        </group>
      );
    

} 