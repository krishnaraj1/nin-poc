const express = require('express');
const { Level } = require('level');

const app = express();
const port = 3000;

// Initialize and create a LevelDB
const db = new Level('mydb', { valueEncoding: 'json' });

app.use(express.json());

// Create/Put endpoint
app.post('/data/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const value = req.body;
    await db.put(key, value);
    res.status(201).json({ message: 'Data stored successfully', key, value });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read/Get key
app.get('/data/:key', async (req, res) => {
    try {
      const { key } = req.params;
      const value = await db.get(key);
      res.json({ key, value });
    } catch (err) {
      res.status(404).json({ error: 'Key not found' });
    }
  });
/*
// Delete key
app.delete('/data/:key', async (req, res) => {
  try {
    const { key } = req.params;
    await db.del(key);
    res.json({ message: 'Data deleted successfully', key });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
*/
// List all keys
app.get('/data', async (req, res) => {
  try {
    const keys = [];
    for await (const key of db.keys()) {
      keys.push(key);
    }
    res.json({ keys });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}); 

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await db.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await db.close();
  process.exit(0);
});