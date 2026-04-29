const express = require('express');
const cors = require('cors');
const { pool, initDB } = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Get all pixels
app.get('/api/pixels', async (req, res) => {
  try {
    const result = await pool.query('SELECT x, y, color FROM pixels');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Place a pixel
app.put('/api/pixel', async (req, res) => {
  const { x, y, color } = req.body;

  if (x == null || y == null || !color) {
    return res.status(400).json({ error: 'x, y, and color are required' });
  }

  try {
    await pool.query(
      `INSERT INTO pixels (x, y, color) VALUES ($1, $2, $3)
       ON CONFLICT (x, y) DO UPDATE SET color = $3`,
      [x, y, color]
    );
    res.json({ x, y, color });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

initDB().then(() => {
  app.listen(PORT, () => console.log(`API running on port ${PORT}`));
});
