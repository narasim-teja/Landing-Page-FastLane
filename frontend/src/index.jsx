import './style.css';
import React, { Suspense } from 'react'; // Ensure React is imported when using JSX
import ReactDOM from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import Experience from './Experience.jsx';
import { KeyboardControls } from '@react-three/drei';
// Import Interface if needed, commented out for now
// import Interface from './Interface.jsx';
import useGame from './stores/useGame';
import LevelEditor from './LevelEditor.jsx'; // Ensure this import is correct
import Spinner from './Spinner.jsx';


const root = ReactDOM.createRoot(document.querySelector('#root'));

// Define a functional component to encapsulate Zustand state usage and conditional rendering
function App() {
  const { editorOpen, addSegment } = useGame(); // Use Zustand hook inside the component

  return (
    <KeyboardControls
      map={[
        { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
        { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
        { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
        { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
      ]}
    >
        <Suspense fallback={<Spinner />}>
            <Canvas
            shadows
            camera={{
            fov: 45,
            near: 0.1,
            far: 200,
            position: [0, 4, 23] //0,4,23
            }}
        >
            <Experience />
        </Canvas>
        </Suspense>
        
      {/* Conditionally render LevelEditor based on editorOpen state */}
      {editorOpen && <LevelEditor onObstaclesSelected={addSegment} />}
    </KeyboardControls>
  );
}

// Render the App component instead of directly placing JSX in root.render
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
