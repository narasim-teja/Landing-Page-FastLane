import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

const defaultObstacles = ["WhaleObstacle", "TextObstacle", "PoopObstacle", "GreenCandle_1"];


export default create(subscribeWithSelector((set) =>
{
    return {
        segments: [{ obstacles: defaultObstacles.slice() }], // Clone the array to avoid reference issues
        
        editorOpen: false,
      
        addSegment: (obstaclesConfig) =>
            set((state) => ({
                segments: [...state.segments, { obstacles: obstaclesConfig }],
                editorOpen: false, // Close the editor after adding a segment
            })),
    
        openEditor: () => set(() => ({ editorOpen: true })),
       
       
        /**
         * Time
         */
        startTime: 0,
        endTime: 0,

        /**
         * Phases
         */
        phase: 'ready',

        start: () =>
        {
            set((state) =>
            {
                if(state.phase === 'ready')
                    return { phase: 'playing', startTime: Date.now() }

                return {}
            })
        },

        restart: () =>
        {
            set((state) =>
            {
                if(state.phase === 'playing' || state.phase === 'ended')
                    return { phase: 'ready' }

                return {}
            })
        },

        end: () =>
        {
            set((state) =>
            {
                if(state.phase === 'playing')
                    return { phase: 'ended', endTime: Date.now() }

                
                return {  };
            })
        },

        
    }
}))