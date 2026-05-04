import React, { useState } from "react";
import "./App.css";
// 画面をタップしてスコアを増やすコンポーネント
type ScorePanelProps = {
  score: number;
  onIncrease: () => void;
  className: string;
  style?: React.CSSProperties;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
};

// スコアを表示し、タップでスコアを増やすパネルコンポーネント
const ScorePanel = ({
  score,
  onIncrease,
  className,
  style,
  onTouchStart,
  onTouchEnd,
}: ScorePanelProps) => {
  return (
    <div
      className={className}
      onClick={onIncrease}
      style={style}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <h1>{score}</h1>
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
  const playerMin = 1;
  const playerMax = 12;
  const swipeThreshold = 50; // スワイプとみなす距離の閾値（ピクセル）

  const [scores, setScores] = useState<number[]>([0, 0]);

  // 指定したプレイヤーのスコアを1増やす関数
  const incrementScore = (index: number) => {
    setScores((prev) => {
      const next = [...prev];
      next[index] += 1;
      return next;
    });
  };
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchIndex, setTouchIndex] = useState<number | null>(null);

  // タップ開始時のY座標とタップされたパネルのインデックスを保存
  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    setTouchStart(e.touches[0].clientY);
    setTouchIndex(index);
  };

// タップ終了時にスワイプの距離を計算し、一定以上ならスコアを1減らす
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null || touchIndex === null) return;
    const touchEnd = e.changedTouches[0].clientY;
    const diff = touchEnd - touchStart;
    if (diff > swipeThreshold) {
      setScores((prev) =>
        prev.map((s, i) => (i === touchIndex ? Math.max(0, s - 1) : s)),
      );
    }
    setTouchStart(null);
    setTouchIndex(null);
  };

  const updatePlayerCount = (newCount: number) => {
    if (newCount < playerMin || newCount > playerMax) return;

    setScores((prev) => {
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
        {/* プレイヤー数を増減させるボタン */}
        <button
          onClick={() => updatePlayerCount(scores.length - 1)}
          disabled={scores.length <= playerMin}
        >
          -
        </button>

        <button
          onClick={() => updatePlayerCount(scores.length + 1)}
          disabled={scores.length >= playerMax}
        >
          +
        </button>
      </div>

      {/* スコアパネル*/}
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
            onTouchStart={(e) => handleTouchStart(e, index)}
            onTouchEnd={handleTouchEnd}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
