import * as THREE from 'three'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useMemo, useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Text, useGLTF } from '@react-three/drei'
import { useFBX } from '@react-three/drei';

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)


const floor2Material = new THREE.MeshStandardMaterial({ color: 'greenyellow' })

5
function Bounds({ length  })
{
    console.log("lenth",length)
    const corridor = useFBX('/cooridor.fbx');
    

    return <>
        {/* <primitive object={corridor} scale={0.05} position={ [ 0, 0, - (length * 2) + 2 ] } /> */}
        <RigidBody type="fixed" colliders="trimesh" restitution={ 0.2 } friction={ 0 }  >
            
        <primitive object={corridor} scale={0.05} position={ [ 0, 0, -(length * 2) +2 ] } />
            
        </RigidBody>
    </>
}

function Checkpoint({ position = [ 0, 1.05, -44 ] }) {
    

    
    

    return <group position={ position }>
        
        <RigidBody type="fixed" colliders="cuboid" restitution={ 0.2 } friction={ 0 }  >
            
        <mesh geometry={ boxGeometry } material={ floor2Material }  scale={ [ 14, 0.2, 14 ] }  receiveShadow />
            
        </RigidBody>
        
    </group>
}

export function Level({count})
{ 
    return <>
        <Bounds key={count} length={ count } />
        {/* <Checkpoint  /> */}
    </>
}