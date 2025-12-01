require('dotenv').config();
const express = require('express');
const { init, closePool } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(express.json()); // FIXED

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;

init()
  .then(() => {
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch(err => {
    console.error('Failed to init DB pool', err);
    process.exit(1);
  });

process.on('SIGINT', async () => {
  console.log('Shutting down...');
  await closePool();
  process.exit(0);
});
