import express from 'express';
import cors from 'cors';
import { db } from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/projects', async (req, res) => {
  let conn;
  try {
    conn = await db.getConnection();
    const rows = await conn.query('SELECT id, title, description, created_at FROM projects ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  } finally {
    if (conn) conn.release();
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
