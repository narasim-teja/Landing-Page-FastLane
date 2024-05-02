import React, { useState } from 'react';
import { ethers } from 'ethers';
import './LevelEditor.css';
import abi from './constants/spraguAbi.json' 

const obstacleOptions = [
  { label: "None", value: null, image: "/StoreImages/none.png" },
  { label: "Whale Obstacle", value: "1", image: "/StoreImages/whale_file-02.png" },
  { label: "Text Obstacle", value: "2", image: "/StoreImages/wagmi_obstacle.png" },
  { label: "Poop Obstacle", value: "3", image: "/StoreImages/poop_obstacle.webp" },
  { label: "Green Candle", value: "4", image: "/StoreImages/candle_obstacle.webp" },
];

// Assuming a fixed number of columns (5 for this example)
const numberOfColumns = 5;

const contractAddress = import.meta.env.REACT_APP_OASISCONTRACT_ADDR // Replace with your contract's address
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(contractAddress, abi, signer);

export default function LevelEditor({ onObstaclesSelected }) {
    
  const [selections, setSelections] = useState(Array(4).fill({ obstacle: null, column: null }));

  

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
    const resultArray = Array(numberOfColumns * 4).fill(0);
    selections.forEach((sel, index) => {
      if (sel.obstacle !== null && sel.column !== null) {
        resultArray[sel.column + (index * numberOfColumns)] = parseInt(sel.obstacle);
      }
    });
    try {
      // Assuming `addSegment` takes chainId and the obstacles array as arguments
      const chainId = 23295; // Adjust this as necessary
      await contract.addSegment(chainId, resultArray);
      onObstaclesSelected(resultArray);
    } catch (error) {
      console.error('Error submitting obstacles to the blockchain:', error);
    }
  
    
   
  };

  return (
    <div className="level-editor">
      <form onSubmit={handleSubmit}>
        <p className="editor-instruction">
            Select the obstacles in order for the next segment:
        </p>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="obstacle-selection">
            <div className="obstacle-label">Obstacle {index + 1}:</div>
            {obstacleOptions.map((option, optIndex) => (
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
