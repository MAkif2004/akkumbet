import express from 'express';
import cors from 'cors';
import { db } from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/projects', async (req, res, next) => {
  let conn;
  try {
    conn = await db.getConnection();
    const rows = await conn.query('SELECT id, title, description, created_at FROM projects ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching projects:', err);
    // Delegate to centralized error handler to control what gets sent to clients
    next(err);
  } finally {
    if (conn) conn.release();
  }
});

// Centralized error handler logs full error server-side but only returns a generic message to clients
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);

  // In development it's useful to return the message; in production keep it generic
  if (process.env.NODE_ENV && process.env.NODE_ENV !== 'production') {
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }

  return res.status(500).json({ error: 'Internal server error' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
