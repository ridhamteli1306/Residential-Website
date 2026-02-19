const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./database');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const authRoutes = require('./routes/authRoutes');
const unitRoutes = require('./routes/unitRoutes');
const visitRoutes = require('./routes/visitRoutes');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/visits', visitRoutes);

// Routes placeholder
app.get('/', (req, res) => {
  res.send('Terrazas de Guacuco API is running');
});

// Sync database and start server
sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to sync database:', err);
});
