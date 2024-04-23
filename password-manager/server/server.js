require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const passwordRoutes = require('./routes/passwordRoutes');
const shareRequestRoutes = require('./routes/shareRequestRoutes');
const { authenticateToken } = require('./authMiddleware');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully.'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cookieParser());

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/passwords', authenticateToken, passwordRoutes);
app.use('/api/share-requests', authenticateToken, shareRequestRoutes);
app.use(express.static(path.join(__dirname, 'build')));

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Error' });
});

// Handle 404 - Keep this as a last route
app.use((req, res, next) => {
  res.status(404).json({ message: 'server: 404 Not found' });
});

// Start server
const PORT = process.env.PORT || 3000;

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
