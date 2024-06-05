import * as THREE from 'three'
import {  Environment, Float, Text, useFBX, useGLTF } from "@react-three/drei"
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
        <RigidBody type="fixed" colliders="trimesh" restitution={0.2} friction={1}>
            <mesh receiveShadow position={[0,-0.1,0]} >
                <boxGeometry args={[5,0.2,5]} />
                <meshStandardMaterial color="limegreen" />
            </mesh>
        </RigidBody>
        
        
    </group>
     
}


export function WhaleObstacle({ position = [0, 0, 0] }) {
    const originalWhale = useFBX('/gold_coin_spork_1_raised.fbx');
    const whale = useMemo(() => originalWhale.clone(), [originalWhale]);
    const { activateSpeedBoost } = useGame();

    const [isGameReady, setGameReady] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setGameReady(true), 1000); // Ensure consistent timing
        return () => clearTimeout(timer);
    }, []);

    const handleCollisionExit = () => {
        if (isGameReady) {
            console.log("activating speed activation.");
            activateSpeedBoost();
        }
    };

    // Helper function to quantize values
    const quantize = (value) => Math.round(value * 1000) / 1000;

    // Apply quantization to position and scale
    const quantizedPosition = position.map(quantize);
    const quantizedScale = quantize(0.007);

    return (
        <group position={quantizedPosition}>
            <RigidBody 
                colliders="hull" 
                restitution={0.2} 
                friction={1}
                onCollisionExit={handleCollisionExit}
            > 
                <primitive object={whale} scale={quantizedScale} position={[-2, 0, 0].map(quantize)} />
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
        <RigidBody 
            colliders="hull" 
            restitution={0.2} 
            friction={1} 
            onCollisionExit={handleCollisionExit}  
        >
            <primitive object={poop} scale={0.007} position={[0,0.8,1.6]} rotation-x={-Math.PI/2} />
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
        <RigidBody ref={ obstacleRef } type="kinematicPosition" restitution={ 0.2 } friction={ 1 }> 
            <primitive object={green_1} scale={0.005} position={[2.1,0.2,0]} rotation-z={Math.PI/2}  />
        </RigidBody>  
    </group>  
}

export function BlockEnd({position=[0,0,0]}){
    return<group position={position} >
        <Text
            font="/bebas-neue-v9-latin-regular.woff"
            scale={ 1 }
            position={ [ 0, 1.25, 2 ] }
        >
            Checkpoint
            <meshBasicMaterial toneMapped={ false } />
        </Text>
        <mesh receiveShadow position={[2,0,2]} >
            <boxGeometry args={[5,0.1,5]} />
            <meshStandardMaterial color="limegreen" />
        </mesh>

    </group>
     
}

function Bounds({length=9, onClick}) {
    const originalCorridor = useFBX('/Road_Plane.fbx');
    const corridor = useMemo(() => originalCorridor.clone(), [originalCorridor]);
    const { activatePause } = useGame();

    const handleCheckpointEnter = () => {
        activatePause();
        onClick();
    }

    // Quantizing scale and position values to 3 decimal places
    const quantize = (value) => Math.round(value * 1000) / 1000;
    const scale = [quantize(0.014), quantize(0.01), quantize(0.00668 * length)];
    const position = [quantize(2), quantize(-0.21), quantize(-(2 * length) +0.05)];

    return <>
        <RigidBody type="fixed" colliders="trimesh" restitution={0.2} friction={1}>
        
            <primitive object={corridor} scale={scale} position={position} />
            <CuboidCollider
                type="fixed"
                args={[2.5, 0, 2.5]}
                position={[2, 0, - (5 * length) +2]}
                restitution={0.2}
                friction={1}
                onCollisionEnter={handleCheckpointEnter}
            />
        </RigidBody>
    </>
}





export function Level({obstaclesArray, onAddSegment, position,}) {
    const obstacles = obstaclesArray.obstacles || [];

    

    // Quantize position
    const quantize = (value) => Math.round(value * 1000) / 1000;
    const quantizedPosition = position.map(quantize);

    return(
        <group position={quantizedPosition}>
            {obstacles.map((obstacleId, index) => {
                if (obstacleId === 0) return null; // Skip if no obstacle
                const row = Math.floor(index / 5);
                const col = index % 5;
                // Pass quantized position to ObstacleSpawner
                return <ObstacleSpawner key={index} row={row} col={col} obstacleId={obstacleId.toString()} />;
            })}
            <BlockStart position={[2, 0.1, 7]} />
            <BlockEnd position={[0, 0, -((8 + 1) * 4.99)]}  />
            <Bounds length={8 + 1} onClick={onAddSegment} />
            <Environment preset='dawn' background/>
        </group>
    );
}

