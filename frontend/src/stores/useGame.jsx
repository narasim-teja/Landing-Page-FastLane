import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export default create(subscribeWithSelector((set) =>
{
    return {
        segments: [{ blocksCount: 4 }], // Initialize with one segment
        totalLength: 0, // Keep track of the total length/offset

        addSegment: () =>
            set((state) => ({
                segments: [...state.segments, { blocksCount: 4 }],
                totalLength: state.totalLength + 30, // Assuming each segment adds 30 units
        })),
       
        
        

        
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