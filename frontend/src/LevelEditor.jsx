import React, { useState } from 'react';
import { useSelector } from 'react-redux'
import './LevelEditor.css';

const obstacleOptions = [
  { label: "None", value: null, image: "/StoreImages/none.png" },
  { label: "Whale Obstacle", value: "1", image: "/StoreImages/whale_file-02.png" },
  { label: "Text Obstacle", value: "2", image: "/StoreImages/wagmi_obstacle.png" },
  { label: "Poop Obstacle", value: "3", image: "/StoreImages/poop_obstacle.webp" },
  { label: "Green Candle", value: "4", image: "/StoreImages/candle_obstacle.webp" },
];

// Assuming a fixed number of columns (5 for this example)
const numberOfColumns = 5;

export default function LevelEditor({ onObstaclesSelected }) {
    const provider = useSelector(state => state.provider.connection)
    const fastlane = useSelector(state => state.fastlane.contract)
    const userAccount = useSelector(state => state.provider.account)
  const [selections, setSelections] = useState(Array(4).fill({ obstacle: null, column: null }));

  const mint = async () => {
    const signer = provider.getSigner()
    let transaction = await fastlane.connect(signer).mintSegment(userAccount)
    await transaction.wait()
}

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
    await mint()
    onObstaclesSelected(resultArray);
    
   
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
