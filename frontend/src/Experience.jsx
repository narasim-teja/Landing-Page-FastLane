// Experience.jsx
import { Physics } from '@react-three/rapier'
import useGame from './stores/useGame.jsx'
import Lights from './Lights.jsx'
import { Level } from './Level.jsx'
import Player from './Player.jsx'
import { Perf } from "r3f-perf";
import { Billboard, OrbitControls } from '@react-three/drei'
import LevelEditor from './LevelEditor';
import Billboards from './Billboards.jsx'

export default function Experience() {
    const { segments, editorOpen, addSegment, openEditor } = useGame();
    

    

    return (
        <>
            <color args={["#bdedfc"]} attach="background" />
            <OrbitControls makeDefault />
            <Perf />

            <Physics debug={false}>
                <Lights />
                
                    {segments.map((segment, index) => (
                        <Level key={`level-${index}`}
                               obstacles={segment.obstacles}
                               onAddSegment={index === segments.length - 1 ? openEditor : undefined}
                               position={[0, 0, -(index * 30)]} />
                    ))}
                
                    
                
                <Player />
            </Physics>
        </>
    );
}
