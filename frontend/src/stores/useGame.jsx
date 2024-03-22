import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

import { io } from 'socket.io-client';

// Connect to the WebSocket server
const socket = io.connect("http://localhost:3000");

console.log(socket)

  



const initialObstaclesData = [
    ];

    export function revealRow(sessionId,currentRow){
       
        socket.emit("server.revealRow", 23295,sessionId, currentRow);
        console.log("currentRow: " + currentRow)
        console.log("sessionId:current " + sessionId)

    }

const useGame = create(subscribeWithSelector((set, get) => ({
    segments: [{ obstacles: initialObstaclesData.slice(0,4) }],
    editorOpen: false,

    

    // Action to append a new row of obstacles to the current segment
    appendObstaclesRow: (obstaclesInRow) => set((state) => {
        // Assuming we're always updating the first (and currently only) segment
        const updatedObstacles = [...state.segments[0].obstacles, ...obstaclesInRow];
        const updatedSegments = [{ obstacles: updatedObstacles }];
        return { segments: updatedSegments };
    }),

    addSegment: (newObstaclesArray) => {
        // First, update the state
        set((state) => ({
            segments: [...state.segments, { obstacles: newObstaclesArray }],
            editorOpen: false,
        }));

        // Then, use the get function to access the updated state and emit the socket event
        const { segments } = get();
        const currentSegment = segments[segments.length - 1]; // Get the latest segment
        socket.emit("server.addSegment",59140, currentSegment.obstacles);
    },

    openEditor: () => set(() => ({ editorOpen: true })),

    isSpeedBoostActive: false,
        activateSpeedBoost: () => set(() => ({
            isSpeedBoostActive: true,
            // Reset after 3 seconds
            speedBoostTimeout: setTimeout(() => {
                set({ isSpeedBoostActive: false });
            }, 3000),
        })),
        // deactivateSpeedBoost: () => set((state) => {
        //     clearTimeout(state.speedBoostTimeout);
        //     return { isSpeedBoostActive: false };
        // }),

        isSpeedReduced: false,
  
        // Action to activate speed reduction
        activateSpeedReduction: () => set((state) => ({
            isSpeedReduced: true,
            // Reset speed after 3 seconds
            speedReductionTimeout: setTimeout(() => {
                set({ isSpeedReduced: false });
            }, 4000),
        })),

        
        isPaused: false,
        // Action to pause the game
        activatePause: () => set((state) => ({
            isPaused: true,
            // Reset speed after 1 seconds
            speedPauseTimeout: setTimeout(() => {
                set({ isPaused: false });
            }, 1000),
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


})));

// WebSocket event listeners
socket.on("connect", () => {
    console.log("WebSocket connected");
    // Example emit, adjust according to your actual initial data fetch needs

});


socket.on("client.revealRow", (rowId, obstaclesInRow) => {
    console.log(`Raw event data for row ${rowId}:`, obstaclesInRow);
    if (obstaclesInRow) {
        console.log(`Reveal data for row: ${rowId}, Data: ${JSON.stringify(obstaclesInRow)}`);
        useGame.getState().appendObstaclesRow(obstaclesInRow);
    } else {
        console.error(`No obstacles data received for row ${rowId} ,Data: ${JSON.stringify(obstaclesInRow)}.`);
        // Handle the case where no data is received (e.g., request data again or use fallback data)
    }
});

export default useGame;