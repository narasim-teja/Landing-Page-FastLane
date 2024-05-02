import { Server } from 'socket.io';
import { ethers } from 'ethers';
import * as sapphire from '@oasisprotocol/sapphire-paratime';
// import { StartGameEventHandler, PlayerProgressedRowEventHandler } from './gameManager.js';

import express from 'express';
import http from 'http';
import cors from 'cors';
import { Console } from 'console';
import('dotenv/config');

import abi from '../constants/spraguAbi.json' assert { type: 'json' };


const app = express();
const server = http.createServer(app);

let socketIOConnection;
let playerSessionToChainIdMapping = {};
let obstaclesInSession = [[]];

// Define the Socket.IO server attached to the HTTP server outside the function
const io = new Server(server, {
    cors: {
      origin: "*", // Adjust according to your frontend's origin, use specific origins in production
      methods: ["GET", "POST"]
    }
  });


export function EmitMessage(topic, ...message){
    socketIOConnection.emit(topic, ...message)
}

function StartSocketIOServer() {
    io.on('connection', async (socket) => {
        console.log("connection")
       
        socketIOConnection = socket;
        console.log('a user connected. Initializing event handlers');
        let sessionId = 11;
        let chainId =23295

        // Automatically load and send the first row's obstacles upon new connection
        try {
            const obstaclesForRowZero = await revealRowASYNC(chainId, sessionId, 0);
            socket.emit("client.revealRow", 0, obstaclesForRowZero);
        } catch (error) {
            console.error("Failed to load initial obstacles:", error);
        }
        
        socket.on('server.revealRow', async (chainId, sessionId, rowIndex) => {
            console.log(`Reveal row: sessionId=${sessionId}, rowIndex=${rowIndex}, chainId=${chainId}`);
            
            // Implement your logic here, for example:
            const obstaclesInRow = await revealRowASYNC(chainId,sessionId, rowIndex);
            console.log("Main",obstaclesInRow)
            socket.emit("client.revealRow", rowIndex, obstaclesInRow);
        });
    });
}


async function newSessionASYNC(chainId, sessionId) {
    try {
        
        console.log(`newSessionASYNC called with chainId: ${chainId}, sessionId: ${sessionId}`);
        playerSessionToChainIdMapping[sessionId] = chainId;
        obstaclesInSession[sessionId] = []; // Initialize as an array
        await getAllObstaclesASYNC(chainId, sessionId); // Pass sessionId if needed
        console.log(obstaclesInSession[sessionId]);
    } catch (error) {
        console.error("Failed to create new session:", error);
    }
}


async function revealRowASYNC(chainId, sessionId, rowIndex){
    try {

        if (!playerSessionToChainIdMapping[sessionId]) {
            console.log("rowIndex:", rowIndex)
            await newSessionASYNC(chainId, sessionId);
        }
        
        if (!obstaclesInSession[sessionId] || obstaclesInSession[sessionId].length === 0) {
            console.log("rowIndex:", rowIndex)
            console.error(`No obstacles found for sessionId: ${sessionId}`);
            return []; 
        }

       
    
        // Directly return the obstacle numbers for the requested row
        const obstaclesInRow = obstaclesInSession[sessionId][rowIndex] || [];
        console.log(`Obstacles for sessionId=${sessionId}, rowIndex=${rowIndex}:`, obstaclesInRow);
        return obstaclesInRow;

    } catch (error) {
        console.error("Error in revealRowASYNC:", error);
        return []
    }
    
}

async function getAllObstaclesASYNC(chainId, sessionId) {
    try {
        const signer = sapphire.wrap(new ethers.Wallet(process.env.TEST_TRACK_OWNER_PKEY))
            .connect(ethers.getDefaultProvider(sapphire.NETWORKS.testnet.defaultGateway));
        const contract = new ethers.Contract(process.env.OASIS_CONTRACT_ADDR, abi, signer);
        
        const rowCount = await contract.getRowCount(chainId);
        for (var i = 0; i < rowCount; i++) {
            const obstacles = await getObstaclesForSessionASYNC(chainId, i);
            obstaclesInSession[sessionId].push(obstacles);
        }
    } catch (error) {
        console.log("Error in getAllObstaclesASYNC:", error);
    }
}


async function getObstaclesForSessionASYNC(sessionId, row){
    try {
        console.log(`Attempting to retrieve chainId for sessionId: ${sessionId}`);
        console.log("Current mapping:", JSON.stringify(playerSessionToChainIdMapping, null, 2));
        const chainId = 23295
        

        const signer = sapphire
        .wrap(new ethers.Wallet(process.env.TEST_TRACK_OWNER_PKEY))
        .connect(ethers.getDefaultProvider(sapphire.NETWORKS.testnet.defaultGateway));

        console.log(chainId)
        
        const contract = new ethers.Contract(process.env.OASIS_CONTRACT_ADDR, abi, signer);
        
         // Await the promise resolution and log the result
         const obstaclesBigNumber = await contract.getObstaclesInRow(chainId, row);
         const obstacles = obstaclesBigNumber.map(bn => bn.toNumber());
         console.log("Obstacles (as numbers):", obstacles);

         
 
         return obstacles; // This is the resolved promise value
    } catch (error) {
        console.log("Error in getObstaclesForSessionASYNC: ", error)
    }
    
}

app.use(cors());
app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
  });
  
  server.listen(3000, () => {
    console.log('listening on *:3000');
    StartSocketIOServer(server);
    console.log("started")
  });   