import React, { useState } from 'react';
import { ethers } from 'ethers';
import './LevelEditor.css';
import abi from './constants/spraguAbi.json';

const obstacleOptions = [
  { label: "None", value: null, image: "/StoreImages/none.png" },
  { label: "Whale Obstacle", value: "1", image: "/StoreImages/whale_file-02.png" },
  { label: "Text Obstacle", value: "2", image: "/StoreImages/wagmi_obstacle.png" },
  { label: "Poop Obstacle", value: "3", image: "/StoreImages/poop_obstacle.webp" },
  { label: "Green Candle", value: "4", image: "/StoreImages/candle_obstacle.webp" },
];

const numberOfColumns = 5;
const numberOfRows = 8;  // Adjusted number of rows

const contractAddress = import.meta.env.REACT_APP_OASISCONTRACT_ADDR || '0x8e5b50E5376f246F35880D934A17d8A349bE312a';
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(contractAddress, abi, signer);

export default function LevelEditor({ onObstaclesSelected }) {
  const [selections, setSelections] = useState(Array(numberOfRows).fill({ obstacle: null, column: null }));

  const handleObstacleChange = (index, value) => {
    const newSelections = selections.map((sel, i) => 
      i === index ? { ...sel, obstacle: value } : sel
    );
    setSelections(newSelections);
  };

  const handleColumnChange = (index, column) => {
    const newSelections = selections.map((sel, i) => 
      i === index ? { ...sel, column: column } : sel
    );
    setSelections(newSelections);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultArray = Array(numberOfColumns * numberOfRows).fill(0);
    selections.forEach((sel, index) => {
      if (sel.obstacle !== null && sel.column !== null) {
        resultArray[sel.column + (index * numberOfColumns)] = parseInt(sel.obstacle);
      }
    });

    // Append 10 zeros to the resultArray
    const extendedResultArray = resultArray.concat(Array(10).fill(0));

    try {
      const chainId = 23295;
      await contract.addSegment(chainId, extendedResultArray);
      onObstaclesSelected(extendedResultArray);
    } catch (error) {
      console.error('Error submitting obstacles to the blockchain:', error);
    }
  };

  return (
    <div className="level-editor">
      <form onSubmit={handleSubmit}>
        <p className="editor-instruction">Select the obstacles in order for the next segment:</p>
        {Array.from({ length: numberOfRows }).map((_, index) => (
          <div key={index} className="obstacle-selection">
            <div className="obstacle-label">Obstacle {index + 1}:</div>
            {obstacleOptions.map((option) => (
              <label key={option.value} className="obstacle-option">
                <input
                  type="radio"
                  name={`obstacle-${index}`}
                  value={option.value}
                  checked={selections[index].obstacle === option.value}
                  onChange={() => handleObstacleChange(index, option.value)}
                />
                <img src={option.image} alt={option.label} className="obstacle-image" />
              </label>
            ))}
            <div className="column-selection">
              {Array.from({ length: numberOfColumns }).map((_, colIndex) => (
                <label key={colIndex}>
                  <input
                    type="checkbox"
                    checked={selections[index].column === colIndex}
                    onChange={() => handleColumnChange(index, colIndex)}
                  />
                  {colIndex + 1}
                </label>
              ))}
            </div>
          </div>
        ))}
        <button type="submit" className="create-segment-button">Create Segment</button>
      </form>
    </div>
  );
}
