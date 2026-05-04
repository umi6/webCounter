import React, { useState, useRef, useEffect } from "react";
import "./App.css";

type ScorePanelProps = {
  score: number;
  name: string;
  onIncrease: () => void;
  className: string;
  style?: React.CSSProperties;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  onTouchCancel: () => void;
};

const ScorePanel = ({
  score,
  name,
  onIncrease,
  className,
  style,
  onTouchStart,
  onTouchEnd,
  onTouchCancel,
}: ScorePanelProps) => {
  return (
    <div
      className={className}
      onClick={onIncrease}
      style={style}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchCancel}
    >
      <h1>{score}</h1>
      <p className="p">{name}</p>
    </div>
  );
};

const COLORS = [
  "#ff4d4f",
  "#40a9ff",
  "#73d13d",
  "#ffc53d",
  "#9254de",
  "#ff85c0",
  "#36cfc9",
  "#ff7a45",
  "#597ef7",
  "#e2de00",
];

function App() {
  const longPressActive = useRef(false);
  const ignoreNextClick = useRef(false);
  const longPressTimer = useRef<number | null>(null);

  const playerMin = 1;
  const playerMax = 12;
  const swipeThreshold = 50;

  const [scores, setScores] = useState<number[]>([0, 0]);
  const [names, setNames] = useState<string[]>(["Player 1", "Player 2"]);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchIndex, setTouchIndex] = useState<number | null>(null);

  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        window.clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
    };
  }, []);

  const incrementScore = (index: number) => {
    setScores((prev) => {
      const next = [...prev];
      next[index] += 1;
      return next;
    });
  };

  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    setTouchStart(e.touches[0].clientY);
    setTouchIndex(index);

    if (longPressTimer.current) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    longPressTimer.current = window.setTimeout(() => {
      ignoreNextClick.current = true;
      longPressActive.current = true;

      const currentName = names[index] ?? `Player ${index + 1}`;
      const value = window.prompt("名前を入力", currentName);

      if (value !== null) {
        setNames((prev) => {
          const next = [...prev];
          next[index] = value;
          return next;
        });
      }

      longPressActive.current = false;
      longPressTimer.current = null;
    }, 500);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (longPressTimer.current) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    if (longPressActive.current) {
      longPressActive.current = false;
      setTouchStart(null);
      setTouchIndex(null);
      return;
    }

    if (touchStart === null || touchIndex === null) return;

    const touchEnd = e.changedTouches[0].clientY;
    const diff = touchEnd - touchStart;

    if (diff > swipeThreshold) {
      setScores((prev) =>
        prev.map((s, i) => (i === touchIndex ? Math.max(0, s - 1) : s))
      );
    }

    setTouchStart(null);
    setTouchIndex(null);
  };

  const handleTouchCancel = () => {
    if (longPressTimer.current) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    longPressActive.current = false;
    setTouchStart(null);
    setTouchIndex(null);
  };

  const CountTimer = ()=>{


  }
  const updatePlayerCount = (newCount: number) => {
    if (newCount < playerMin || newCount > playerMax) return;

    setScores((prev) => {
      if (newCount > prev.length) {
        return [...prev, ...Array(newCount - prev.length).fill(0)];
      }
      return prev.slice(0, newCount);
    });

    setNames((prev) => {
      if (newCount > prev.length) {
        return [
          ...prev,
          ...Array(newCount - prev.length)
            .fill(0)
            .map((_, i) => `Player ${prev.length + i + 1}`),
        ];
      }
      return prev.slice(0, newCount);
    });
  };

  return (
    <div className="App">
      <div className="controls">
        <button
          onClick={() => updatePlayerCount(scores.length + 1)}
          disabled={scores.length >= playerMax}
        >
          +
        </button>
        <button
          onClick={() => updatePlayerCount(scores.length - 1)}
          disabled={scores.length <= playerMin}
        >
          -
        </button>
        <button
          onClick={()=> CountTimer()}>
            
        </button>
      </div>

      <div className={`score layout-${scores.length}`}>
        {scores.map((score, index) => (
          <ScorePanel
            key={index}
            score={score}
            name={names[index] ?? `Player ${index + 1}`}
            onIncrease={() => {
              if (ignoreNextClick.current) {
                ignoreNextClick.current = false;
                return;
              }
              if (longPressActive.current) return;
              incrementScore(index);
            }}
            className={`panel panel-${index}`}
            style={{ backgroundColor: COLORS[index % COLORS.length] }}
            onTouchStart={(e) => handleTouchStart(e, index)}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchCancel}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
