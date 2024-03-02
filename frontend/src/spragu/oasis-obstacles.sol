// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract OasisObstacle {
    // uint256[] public obstacleIndices;
    mapping(address => bool) public owners;
    mapping(uint256 => uint256[]) public chainObstacles;
    uint256 constant COLUMNS = 5;

    modifier onlyOwner() {
        require(owners[msg.sender], "Caller is not an owner");
        _;
    }

    constructor() {
        owners[msg.sender] = true;
        
    }

    function  addSegment(uint256 chainId, uint256[] memory obstacleIds)
    {
        uint256[] memory row0 = [obstacleIds[0], obstacleIds[1], obstacleIds[2], obstacleIds[3], obstacleIds[4]];
        uint256[] memory row1 = [obstacleIds[5], obstacleIds[6], obstacleIds[7], obstacleIds[8], obstacleIds[9]];
        uint256[] memory row2 = [obstacleIds[10], obstacleIds[11], obstacleIds[12], obstacleIds[13], obstacleIds[14]];
        uint256[] memory row3 = [obstacleIds[15], obstacleIds[16], obstacleIds[17], obstacleIds[18], obstacleIds[19]];

        addRow(chainId, row0); 
        addRow(chainId, row1); 
        addRow(chainId, row2); 
        addRow(chainId, row3); 
    }

    function addRow(uint256 chainId, uint256[] memory obstacleIds) public
    {
        addObstacle(chainId,obstacleIds[0]);
        addObstacle(chainId,obstacleIds[1]);
        addObstacle(chainId,obstacleIds[2]);
        addObstacle(chainId,obstacleIds[3]);
        addObstacle(chainId,obstacleIds[4]);
    }

    function addObstacle(uint256 chainId, uint256 obstacleId) public {
        chainObstacles[chainId].push(obstacleId);
    }

    function addOwner(address newOwner) public {
        owners[newOwner] = true;
    }

    function getRowCount(uint256 chainId) public view returns (uint256) {
        return chainObstacles[chainId].length / COLUMNS;
    }

    function removeOwner(address ownerToRemove) public {
        require(msg.sender != ownerToRemove, "Cannot remove self as owner");
        owners[ownerToRemove] = false;
    }

        function getObstaclesInRow(uint256 chainId, uint256 rowIndex) public view onlyOwner returns (uint256[] memory) {
            uint256[] memory obstaclesInRow = new uint256[](COLUMNS);
            obstaclesInRow[0] = chainObstacles[chainId][rowIndex];
            obstaclesInRow[1] = chainObstacles[chainId][rowIndex + 1];
            obstaclesInRow[2] = chainObstacles[chainId][rowIndex + 2];
            obstaclesInRow[3] = chainObstacles[chainId][rowIndex + 3];
            obstaclesInRow[4] = chainObstacles[chainId][rowIndex + 4];
            return obstaclesInRow;
    }
}