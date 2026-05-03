import React, { useState } from "react";
import "./App.css";
type ScorePanelProps = {
  score: number;
  onIncrease: () => void;
  className: string;
  style?: React.CSSProperties;
};

const ScorePanel = ({score, onIncrease, className, style }: ScorePanelProps) => {
  return (
    <div className={className} onClick={onIncrease} style={style}>
      <h1>{score}</h1>
    </div>
  );
};

const COLORS = ["#ff4d4f", "#40a9ff", "#73d13d", "#ffc53d", "#9254de", "#ff85c0", "#36cfc9", "#ff7a45", "#597ef7", "#e2de00"];

function App() {
  const [scores, setScores] = useState<number[]>([0, 0]);
  const incrementScore = (index: number) => {
    setScores((prev) => {
      const next = [...prev];
      next[index] += 1;
      return next;
    });
  };
  const updatePlayerCount = (newCount: number) => {
  if (newCount < 1 || newCount > 10) return; 

  setScores(prev => {
    if (newCount > prev.length) {
      return [...prev, ...Array(newCount - prev.length).fill(0)];
    } else {
      return prev.slice(0, newCount);
    }
  });
};

  return (
    <div className="App">
      <div className="controls">
        <button onClick={()=>updatePlayerCount(scores.length-1)} disabled={scores.length <= 1}>-</button>
        <button onClick={()=>updatePlayerCount(scores.length+1)} disabled={scores.length >= 12}>+</button>
      </div>
      <div className={`score layout-${scores.length}`}>
        {scores.map((score, index) => (
          <ScorePanel
            key={index}
            score={score}
            onIncrease={() => {
              incrementScore(index);
            }}
            className={`panel panel-${index}`}
            style={{ backgroundColor: COLORS[index % COLORS.length] }}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
