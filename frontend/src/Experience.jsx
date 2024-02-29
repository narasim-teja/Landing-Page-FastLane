import { Physics } from '@react-three/rapier'
import useGame from './stores/useGame.jsx'
import Lights from './Lights.jsx'
import { Level } from './Level.jsx'
import Player from './Player.jsx'
import { Perf } from "r3f-perf";
import { Billboard, OrbitControls } from '@react-three/drei'
import Billboards from './Billboards.jsx'

export default function Experience()
{
    
    
    const { segments, addSegment, totalLength } = useGame();
    
    

    return <>

        <color args={ [ '#bdedfc' ] } attach="background" />
        <OrbitControls makeDefault />
        <Perf/>

        <Physics debug>
            <Lights />
            {segments.map((segment, index) => (
                    <Level 
                        key={`level-${index}`}
                        count={segment.blocksCount} 
                        position={[0, 0, -(index * 30)]} // Adjust based on your specific setup
                        onAddSegment={index === segments.length - 1 ? addSegment : undefined}
                    />
            ))}
            <Player />
            
        </Physics>

    </>
}