import React, { useState } from 'react';
import './LevelEditor.css'

const obstacleOptions = [
    { label: "None", value: null },
    { label: "Whale Obstacle", value: "WhaleObstacle" },
    { label: "Text Obstacle", value: "TextObstacle" },
    { label: "Poop Obstacle", value: "PoopObstacle" },
    { label: "Green Candle", value: "GreenCandle_1" },
];

export default function LevelEditor  ({ onObstaclesSelected })  {
  const [selections, setSelections] = useState(Array(4).fill("None"));

  const handleChange = (index, value) => {
    const newSelections = [...selections];
    newSelections[index] = value;
    setSelections(newSelections);
    
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onObstaclesSelected(selections.filter(selection => selection !== "None"));
  };

  return (
    <div className="level-editor">
      <form onSubmit={handleSubmit}>
        {Array.from({ length: 4 }).map((_, index) => (
          <select key={index} value={selections[index]} onChange={(e) => handleChange(index, e.target.value)}>
            {obstacleOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
              
            ))}
          </select>
        ))}
        <button type="submit">Create Segment</button>
      </form>
    </div>
  );
};
