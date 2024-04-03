import React from 'react'

import { Canvas, useFrame, useThree } from "@react-three/fiber";

import { motion } from "framer-motion-3d";
import { useEffect, useRef, useState } from "react";

import { useAnimations, useFBX,  } from '@react-three/drei'

import { db } from './config/firestore'; // Adjust the import path as necessary
import { collection, addDoc } from 'firebase/firestore';


const Section = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false); // Tracks whether the email has been successfully submitted

  // General email validation function
  const validateEmail = (email) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleJoinWaitlist = async () => {
    // Assuming you have a validation function
    if (validateEmail(email)) {
      try {
        await addDoc(collection(db, "waitlistEmails"), {
          email: email,
          timestamp: new Date() // Optional: add a timestamp
        });
        alert('Thank you, we will keep you updated!');
        setEmail(''); // Clear the email field after successful submission
      } catch (error) {
        console.error("Error adding document: ", error);
        alert('There was an error submitting your email. Please try again.');
      }
    } else {
      alert('Please enter a valid email address.');
    }
  };
    
  return (
    <>
    <h1 className="text-4xl md:text-6xl font-extrabold leading-snug mt-32 md:mt-44 text-custom-gray  ">
      Welcome to FastLane
        <br />
        
        
      </h1>
      <span className="text-xl md:text-3xl font-extrabold leading-snug  md:mt-0 text-custom-gray px-1  ">Race the Chain, Own the Road</span>
      
      
      {!submitted ? ( // Conditionally render based on the 'submitted' state
        <div className="mt-8 md:mt-16 flex-col md:flex-row justify-center items-center space-x-0 md:space-x-4 space-y-2 md:space-y-0">
          <motion.input
            type="email"
            placeholder="Enter your Email..."
            className="w-auto md:w-auto py-4 px-8 rounded-lg font-bold text-lg text-gray-700"
            style={{ backgroundColor: 'rgba(255,255,255,0.5)' }}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <motion.button
            className="bg-indigo-600 text-white py-4 px-8 rounded-lg font-bold text-lg"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            onClick={handleJoinWaitlist}
          >
            JOIN WAITLIST
          </motion.button>
        </div>
      ) : (
        <p className="text-xl md:text-3xl font-bold text-purple-400 mt-4">Thank you, we will keep you updated!</p> // Display thank you message
      )}

    </>
      
    
  )
};

const Scene = () => {
  const { viewport, size } = useThree();
  const isMobile = size.width < 768; // Consider a screen width under 768px as mobile

  // Default position and scale for desktop
  let position = [4, -1, -1.5];
  let rotation = [0.2, -0.7, 0.2];
  let scale = 0.035;
  const fbx = useFBX('./RollerTrack/RollerTrack.fbx');
  
  // Extract animations from the FBX file
  // The useAnimations hook takes two parameters: the animations array and the group (or scene)
  const { actions, names } = useAnimations(fbx.animations, fbx);

  useEffect(() => {
    // Play the desired animation by name. Ensure the name matches an animation name from the FBX file.
    // You can log 'names' to see all available animation names.
    if (actions[names[0]]) { // This assumes you want to play the first animation available
      actions[names[0]].play();
    }
  }, [actions, names]);

  // Adjust position and scale for mobile devices
  if (isMobile) {
    scale = 0.015; // Example scale adjustment for mobile
    position = [1, -3.5, -3]; // Example position adjustment for mobile
    // Rotation could be adjusted similarly if needed
  }

      return (
        <>
          <primitive
            object={ fbx }
            scale={[scale, scale, scale]}
            position={position}
            rotation={rotation}
          
      />
      <ambientLight intensity={1.5} />
        </>
      )
      

}



const LandingPage = () => {
  return (
    // Container that fills the entire viewport and positions its children
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Canvas filling the container */}
      <Canvas shadows camera={{ position: [0, 3, 10], fov: 42 }} style={{ width: '100%', height: '100%' }}>
        <color attach="background" args={["#e6e7ff"]} />
        <Scene/>
        
      </Canvas>

      {/* Overlay content centered */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 30,
        
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // Center horizontally
        justifyContent: 'center', // Center vertically
        pointerEvents: 'none', // Allows interaction with the 3D scene below
      }}>
        {/* Enable pointer events for interactive elements only */}
        <div style={{ pointerEvents: 'auto' }}>
          <Section />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

