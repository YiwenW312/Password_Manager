const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const passwordRoutes = require('./routes/passwordRoutes');
const shareRequestRoutes = require('./routes/shareRequestRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();
app.use(express.json()); 

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Could not connect to MongoDB", err));

app.use('/api/passwords', passwordRoutes);
app.use('/api/share-requests', shareRequestRoutes);
app.use('/api/users', userRoutes);

const apiRoutes = require('./routes/passwordRoutes');
app.use('/api', apiRoutes);

const { authenticateToken } = require('./authMiddleware');
app.get('/passwords', authenticateToken);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Err500: Something broke!');
});

// Handle 404
app.use((req, res, next) => {
  res.status(404).send("Err404: Sorry can't find that!");
});