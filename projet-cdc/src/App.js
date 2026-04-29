import { useState, useEffect, useCallback } from 'react';
import './App.css';

const GRID_SIZE = 50;
const COLORS = [
  '#FFFFFF', '#000000', '#FF4500', '#FFA800',
  '#FFD635', '#00A368', '#3690EA', '#B44AC0',
];
const API_URL = process.env.REACT_APP_API_URL || '';

function App() {
  const [pixels, setPixels] = useState({});
  const [selectedColor, setSelectedColor] = useState(COLORS[2]);

  const fetchPixels = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/pixels`);
      const data = await res.json();
      const map = {};
      data.forEach(({ x, y, color }) => { map[`${x}-${y}`] = color; });
      setPixels(map);
    } catch (err) {
      console.error('Failed to fetch pixels:', err);
    }
  }, []);

  useEffect(() => {
    fetchPixels();
    const interval = setInterval(fetchPixels, 5000);
    return () => clearInterval(interval);
  }, [fetchPixels]);

  const placePixel = async (x, y) => {
    setPixels(prev => ({ ...prev, [`${x}-${y}`]: selectedColor }));
    try {
      await fetch(`${API_URL}/api/pixel`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ x, y, color: selectedColor }),
      });
    } catch (err) {
      console.error('Failed to place pixel:', err);
    }
  };

  return (
    <div className="App">
      <h1>🎨 Pixel War</h1>

      <div className="palette">
        {COLORS.map(color => (
          <button
            key={color}
            className={`color-btn ${selectedColor === color ? 'selected' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => setSelectedColor(color)}
          />
        ))}
      </div>

      <div className="grid" style={{
        gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
        gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
      }}>
        {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          return (
            <div
              key={`${x}-${y}`}
              className="pixel"
              style={{ backgroundColor: pixels[`${x}-${y}`] || '#FFFFFF' }}
              onClick={() => placePixel(x, y)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default App;
