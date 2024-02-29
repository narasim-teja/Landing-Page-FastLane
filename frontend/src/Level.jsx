import * as THREE from 'three'
import { Float, Text, useFBX, useGLTF } from "@react-three/drei"
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import {useAnimations} from '@react-three/drei'
import { useEffect, useMemo, useRef } from "react"
import { useFrame } from '@react-three/fiber'

export function BlockStart({position=[0,0,0]}){
    return<group position={position} >
        {/* <mesh receiveShadow position={[0,-0.1,0]} >
            <boxGeometry args={[5,0.2,5]} />
            <meshStandardMaterial color="limegreen" />
        </mesh> */}
    </group>
     
}

export function WhaleObstacle({ position = [0, 0, 0] }) {
    const originalWhale = useFBX('/sporkWhale_1.fbx');
    // Clone the object for a unique instance
    const whale = useMemo(() => originalWhale.clone(), [originalWhale]);

    return (
        <group position={position}>
            {/* <mesh receiveShadow position={[0, -0.1, 0]}>
                <boxGeometry args={[5, 0.2, 5]} />
                <meshStandardMaterial color="greenyellow" />
            </mesh> */}
            <Float speed={3} rotationIntensity={1} floatIntensity={1} floatingRange={[0, 0.5]}>
                <primitive object={whale} scale={0.005} position={[-1,0,0]} />
            </Float>
        </group>
    );
}



export function TextObstacle({position=[0,0,0]}){
    console.log('Rendering TextObstacle at position', position);
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

export function PoopObstacle({position=[0,0,0]}){
    // const { scene, animations } = useGLTF('/poop_final.gltf'); // Assuming the file is now a GLTF

    const originalPoop = useFBX('/poop_final.fbx')

    const poop = useMemo(() => originalPoop.clone(), [originalPoop])

    
  
    return<group position={position} >
        {/* <mesh receiveShadow position={[0,-0.1,0]} >
            <boxGeometry args={[5,0.2,5]} />
            <meshStandardMaterial color="greenyellow" />
        </mesh> */}

        <RigidBody colliders="hull" restitution={0.2} friction={1} >
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

export function BlockEnd({position=[0,0,0], onClick}){
    return<group position={position} >
        <Text
            font="/bebas-neue-v9-latin-regular.woff"
            scale={ 1 }
            position={ [ -1, 1.25, 2 ] }
        >
            Checkpoint
            <meshBasicMaterial toneMapped={ false } />
        </Text>
        <mesh receiveShadow position={[0,0,0]} >
            <boxGeometry args={[5,0.2,5]} />
            <meshStandardMaterial color="limegreen" />
        </mesh>

        {/*Contuie button*/}

        <mesh position={[2,2,-1]} rotation-x={Math.PI/2}
            onClick={onClick}
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
        </mesh>

        {/*New segment road */}

        <mesh position={[2,1,-1]} rotation-x={Math.PI/2}
            onClick={() => console.log("hee")}
         >
           
            <boxGeometry args={[1.2,0.1,0.47]}  />
            <meshStandardMaterial color="green" />
        </mesh>
        <mesh position={[2,1,-1]} rotation-x={Math.PI/2}>
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
        </mesh>

    </group>
     
}

function Bounds({length=5}) {

    
    const originalCorridor = useFBX('/cooridor.fbx');

    const corridor = useMemo(() => originalCorridor.clone(), [originalCorridor])


    return <>
        
        <RigidBody type="fixed" colliders="trimesh" restitution={ 0.2 } friction={ 1 }  >
            
        <primitive object={corridor} scale={[0.014,0.01, (0.00668 * length)]} position={[0,-0.21,-(2 * length)]}  />
        <CuboidCollider
                type="fixed"
                args={ [ 2.5, 0.1, 2.5 ] }
                position={ [ 0, 0, - 5 * length ] }
                restitution={ 0.2 }
                friction={ 1 }
            />
            
        </RigidBody>
    </>
    
}


export  function Level({count=4, types=[WhaleObstacle, TextObstacle, PoopObstacle, GreenCandle_1 ], onAddSegment, position}) {

    const blocks = useMemo(() => {
        const blocks = []
        const typesLength = types.length
        for(let i=0; i<count; i++) {
            const typeIndex = i % typesLength
            const type = types[typeIndex]
            blocks.push(type)
        }
        return blocks
    }, [])
    

    // Calculate the Z position for BlockEnd, assuming each block takes up 5 units in Z
    const blockEndZPosition = -((count +1) * 5);

    return (
        <group position={position}>
            <BlockStart position={[0, 0, 0]} />
            {blocks.map((Block, index) => (
                <Block key={index} position={[0, 0, -(index + 1) * 5]} />
            ))}
            <BlockEnd position={[0, 0, blockEndZPosition]} onClick={onAddSegment}  />
            <Bounds length={count + 1} />
        </group>
    );

} 