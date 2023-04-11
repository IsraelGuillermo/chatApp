const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const cors = require('cors');
const PORT = process.env.PORT || 4040;
dotenv.config();

mongoose.connect(process.env.MONGO_URL);
const jwtSecret = process.env.JWT_SECRET;
const app = express();
app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL || 'http://localhost:5173/'
  })
);

app.get('/test', (req, res) => {
  res.json('test is working');
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const createdUser = await User.create({ username, password });
    jwt.sign({ userId: createdUser._id }, jwtSecret, {}, (err, token) => {
      if (err) throw err;
      res.cookie('token', token).status(201).json({
        _id: createdUser._id
      });
    });
  } catch (err) {
    if (err) throw err;
    res.status(500).json('error');
  }
});

app.listen(PORT, () => console.log(`server listening on port ${PORT}`));
