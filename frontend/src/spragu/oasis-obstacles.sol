// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.0;

// contract OasisObstacle {
//     // uint256[] public obstacleIndices;
//     mapping(address => bool) public owners;
//     mapping(uint256 => uint256[]) public chainObstacles;
//     uint256 constant COLUMNS = 5;

//     modifier onlyOwner() {
//         require(owners[msg.sender], "Caller is not an owner");
//         _;
//     }

//     constructor() {
//         owners[msg.sender] = true;
        
//         // Initial obstacles now effectively at rowIndex 0.
//         uint256[] memory StartObstacles = new uint256[](5);
//         StartObstacles[0] = 0;
//         StartObstacles[1] = 0;
//         StartObstacles[2] = 3;
//         StartObstacles[3] = 0;
//         StartObstacles[4] = 0;
//         addRow(23295, StartObstacles);

//         // Initial obstacles now effectively at rowIndex 1.
//         uint256[] memory initialObstacles = new uint256[](5);
//         initialObstacles[0] = 0;
//         initialObstacles[1] = 0;
//         initialObstacles[2] = 2;
//         initialObstacles[3] = 0;
//         initialObstacles[4] = 0;
//         addRow(23295, initialObstacles);

//         // Adding predefined obstacles for rowIndex 2.
//         uint256[] memory secondRowObstacles = new uint256[](5);
//         secondRowObstacles[0] = 0;
//         secondRowObstacles[1] = 0;
//         secondRowObstacles[2] = 0;
//         secondRowObstacles[3] = 1;
//         secondRowObstacles[4] = 0;
//         addRow(23295, secondRowObstacles);

//         // Adding predefined obstacles for rowIndex 3.
//         uint256[] memory thirdRowObstacles = new uint256[](5);
//         thirdRowObstacles[0] = 0;
//         thirdRowObstacles[1] = 4;
//         thirdRowObstacles[2] = 0;
//         thirdRowObstacles[3] = 0;
//         thirdRowObstacles[4] = 0;
//         addRow(23295, thirdRowObstacles);

//         // Adding predefined obstacles for rowIndex 4.
//         uint256[] memory fourthRowObstacles = new uint256[](5);
//         fourthRowObstacles[0] = 0;
//         fourthRowObstacles[1] = 0;
//         fourthRowObstacles[2] = 0;
//         fourthRowObstacles[3] = 0;
//         fourthRowObstacles[4] = 4;
//         addRow(23295, fourthRowObstacles);
//     }


//     function addSegment(uint256 chainId, uint256[] memory obstacleIds) public {
//         require(obstacleIds.length >= 20, "Insufficient obstacle IDs provided.");

//         uint256[] memory row0 = new uint256[](5);
//         uint256[] memory row1 = new uint256[](5);
//         uint256[] memory row2 = new uint256[](5);
//         uint256[] memory row3 = new uint256[](5);

//         for (uint256 i = 0; i < 5; ++i) {
//             row0[i] = obstacleIds[i];
//             row1[i] = obstacleIds[i + 5];
//             row2[i] = obstacleIds[i + 10];
//             row3[i] = obstacleIds[i + 15];
            
//         }

//         addRow(chainId, row0);
//         addRow(chainId, row1);
//         addRow(chainId, row2);
//         addRow(chainId, row3);
       
//     }


//     function addRow(uint256 chainId, uint256[] memory obstacleIds) public
//     {
//         addObstacle(chainId,obstacleIds[0]);
//         addObstacle(chainId,obstacleIds[1]);
//         addObstacle(chainId,obstacleIds[2]);
//         addObstacle(chainId,obstacleIds[3]);
//         addObstacle(chainId,obstacleIds[4]);
//     }

//     function addObstacle(uint256 chainId, uint256 obstacleId) public {
//         chainObstacles[chainId].push(obstacleId);
//     }

//     function addOwner(address newOwner) public {
//         owners[newOwner] = true;
//     }

//     function getRowCount(uint256 chainId) public view returns (uint256) {
//         uint256 length = chainObstacles[chainId].length;
//         return (length + COLUMNS - 1) / COLUMNS; // Rounds up to account for partial rows
//     }


//     function removeOwner(address ownerToRemove) public {
//         require(msg.sender != ownerToRemove, "Cannot remove self as owner");
//         owners[ownerToRemove] = false;
//     }

//     function getObstaclesInRow(uint256 chainId, uint256 rowIndex) public view onlyOwner  returns (uint256[] memory) {
//     require(rowIndex < getRowCount(chainId) * COLUMNS, "Row index out of bounds");

//     uint256[] memory obstaclesInRow = new uint256[](COLUMNS);
//     for(uint i = 0; i < COLUMNS; i++) {
//         obstaclesInRow[i] = chainObstacles[chainId][rowIndex * COLUMNS + i];
//     }
//     return obstaclesInRow;
//     }

// }