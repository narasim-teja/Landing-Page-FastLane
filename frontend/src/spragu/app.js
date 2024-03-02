import { Server } from 'socket.io';
import { ethers } from 'ethers';
import * as sapphire from '@oasisprotocol/sapphire-paratime';
// import { StartGameEventHandler, PlayerProgressedRowEventHandler } from './gameManager.js';

import express from 'express';
import http from 'http';

const app = express();
const server = http.createServer(app);

let socketIOConnection;
let playerSessionToChainIdMapping = [];
let obstaclesInSession = [[]];


export function EmitMessage(topic, ...message){
    socketIOConnection.emit(topic, ...message)
}

export function StartSocketIOServer(expressServer){
    new Server(expressServer).on('connection', (socket) => {
        socketIOConnection = socket;
        console.log('a user connected. Initializing event handlers');
        socketIOConnection.on('server.revealRow', async (sessionId, rowIndex)=> revealRowASYNC(sessionId, rowIndex));
    });
}

async function newSessionASYNC(chainId, sessionId)
{
    playerSessionToChainIdMapping[sessionId] = chainId;
    obstaclesInSession[sessionId] = await getAllObstaclesASYNC(chainId);
}

async function revealRowASYNC(sessionId, rowIndex)
{
    if(!playerSessionToChainIdMapping[sessionId])
        await newSessionASYNC(chainId, sessionId);
    
        let obstaclesInRow = [5];
        obstaclesInRow[0] = obstaclesInSession[sessionId][rowIndex];
        obstaclesInRow[1] = obstaclesInSession[sessionId][rowIndex + 1];
        obstaclesInRow[2] = obstaclesInSession[sessionId][rowIndex + 2];
        obstaclesInRow[3] = obstaclesInSession[sessionId][rowIndex + 3];
        obstaclesInRow[4] = obstaclesInSession[sessionId][rowIndex + 4];
        return obstaclesInRow;
}

async function getAllObstaclesASYNC(chainId){
    const rowCount = await contract.getRowCount(chainId);
    for(var i = 0; i < rowCount; i++)
        obstaclesInSession[i] = await getObstaclesForSessionASYNC(chainId, i);
}

async function getObstaclesForSessionASYNC(sessionId, row){
    const chainId = playerSessionToChainIdMapping[sessionId];
    const signer = sapphire
      .wrap(new ethers.Wallet(process.env.TEST_TRACK_OWNER_PKEY))
      .connect(ethers.getDefaultProvider(sapphire.NETWORKS.testnet.defaultGateway));
    
      const contract = new ethers.Contract(process.env.OASIS_CONTRACT_ADDR, abi, signer);
      return await contract.getObstaclesInRow(chainId, row);
}


app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
  });
  
  server.listen(3000, () => {
    console.log('listening on *:3000');
    StartSocketIOServer(server);
  });   