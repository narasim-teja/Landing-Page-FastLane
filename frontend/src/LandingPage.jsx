import React from 'react'
import { motion } from "framer-motion";



const Section = (props) => {
    const { children, mobileTop } = props;
  
    return (
      <motion.section
        className={`
    h-screen w-screen p-8 max-w-screen-2xl mx-auto
    flex flex-col items-start
    ${mobileTop ? "justify-start md:justify-center" : "justify-center"}
    `}
        initial={{
          opacity: 0,
          y: 50,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
          transition: {
            duration: 1,
            delay: 0.6,
          },
        }}
      >
        {children}
      </motion.section>
    );
  };

const LandingPage = () => {
   
  return (
    <>
    <h1 className="text-3xl md:text-6xl font-extrabold leading-snug mt-8 md:mt-0 text-custom-gray  ">
      Welcome to Win-Me
        <br />
        
        
      </h1>
      <span className="text-3xl md:text-6xl font-extrabold leading-snug  md:mt-0 text-custom-gray bg-white px-1 italic ">Race, Collect, Own</span>
      <motion.p
        className="bg-white text-xl font-bold text-custom-voilet mt-4"
        initial={{
          opacity: 0,
          y: 25,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 1,
          delay: 0.5,
        }}
      >
        Dive into a dynamic world of gaming, challenges, and rewards
        
      </motion.p>
      <motion.button
        
        className={`bg-indigo-600 text-white py-4 px-8 
      rounded-lg font-bold text-lg mt-4 md:mt-16`}
        initial={{
          opacity: 0,
          y: 25,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 1,
          delay: 1,
        }}
      >
        JOIN WAITLIST
      </motion.button>
    </>
      
    
  )
}

export default LandingPage
