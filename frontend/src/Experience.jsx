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
    const blocksCount = useGame((state) => state.blocksCount)
    const blocksSeed = useGame(state => state.blocksSeed)
    
    

    return <>

        <color args={ [ '#bdedfc' ] } attach="background" />
        <OrbitControls makeDefault />
        <Perf/>

        <Physics debug={false}>
            <Lights />
            {/* <Billboards position={[-4, 1, -6]}/>
            <Billboards position={[-4, 1, -10]}/>
            <Billboards position={[-4, 1, -16]}/>
            <Billboards position={[-4, 1, -22]}/>
            <Billboards position={[-4, 1, -28]}/>
            <Billboards position={[-4, 1, -38]}/> */}
            <Level count={ blocksCount } seed={ blocksSeed } />
            <Player />
        </Physics>

    </>
}