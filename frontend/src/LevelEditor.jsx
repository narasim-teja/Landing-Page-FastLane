import React, { useState } from 'react';
import './LevelEditor.css'

const obstacleOptions = [
  { label: "None", value: null, image: "/StoreImages/none.png" }, // Placeholder or transparent image for "None"
  { label: "Whale Obstacle", value: "WhaleObstacle", image: "/StoreImages/whale_file-02.png" },
  { label: "Text Obstacle", value: "TextObstacle", image: "/StoreImages/wagmi_obstacle.png" },
  { label: "Poop Obstacle", value: "PoopObstacle", image: "/StoreImages/poop_obstacle.webp" },
  { label: "Green Candle", value: "GreenCandle_1", image: "/StoreImages/candle_obstacle.webp" },
  { label: "Crystal 1", value: "CrystalObstacle_1", image: "/StoreImages/crystal_1.webp" },
  { label: "Crystal 2", value: "CyrstalObstacle_2", image: "/StoreImages/crystal_2.webp" },
];

export default function LevelEditor({ onObstaclesSelected }) {
  const [selections, setSelections] = useState(Array(4).fill(obstacleOptions[0].value));

  const handleChange = (index, value) => {
      const newSelections = [...selections];
      newSelections[index] = value;
      setSelections(newSelections);
  };

  const handleSubmit = (e) => {
      e.preventDefault();
      onObstaclesSelected(selections.filter(selection => selection !== obstacleOptions[0].value));
  };

  return (
      <div className="level-editor">
          <form onSubmit={handleSubmit}>
              <p className="editor-instruction">
                  Select the obstacles in order for the next segment:
              </p>
              {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="obstacle-selection">
                      {/* Adding a label before each obstacle selection */}
                      <div className="obstacle-label">Obstacle {index + 1}:</div>
                      {obstacleOptions.map((option) => (
                          <label key={option.value} className="obstacle-option">
                              <input
                                  type="radio"
                                  name={`obstacle-${index}`}
                                  value={option.value}
                                  checked={selections[index] === option.value}
                                  onChange={() => handleChange(index, option.value)}
                              />
                              <img src={option.image} alt={option.label} className="obstacle-image" />
                          </label>
                      ))}
                  </div>
              ))}
              <button type="submit" className="create-segment-button">Create Segment</button>
          </form>
      </div>
  );
};
