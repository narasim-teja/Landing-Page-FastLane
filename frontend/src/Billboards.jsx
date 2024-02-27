import * as THREE from 'three'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useMemo, useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Text, useGLTF } from '@react-three/drei'

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)

const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 'orangered' })

export default function Billboards({ position = [ -4, 1, -6 ] })
{
    const obstacle = useRef()
    // const [ timeOffset ] = useState(() => Math.random() * Math.PI * 2)

    // useFrame((state) =>
    // {
    //     const time = state.clock.getElapsedTime()

    //     const x = Math.sin(time + timeOffset) * 1.25
    //     obstacle.current.setNextKinematicTranslation({ x: position[0] + x, y: position[1] + 0.75, z: position[2] })
    // })

    return <group position={ position }>
        <RigidBody ref={ obstacle } type="kinematicPosition" position={ [ 0, 0.3, 0 ] } restitution={ 0.2 } friction={ 0 }>
            <mesh geometry={ boxGeometry } material={ obstacleMaterial } scale={ [ 1.5, 1.5, 0.3 ] } castShadow receiveShadow />
        </RigidBody>
    </group>
}