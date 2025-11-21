require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const cookieParser = require("cookie-parser");

const app = express();
connectDB();

// Correct CORS – only ONE time
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));


app.use(express.json());
app.use(cookieParser());

app.use('/auth', require('./routes/auth'));
app.use('/quizzes', require('./routes/quiz'));

app.get('/', (req, res) => res.send('Quiz API running'));

module.exports = app;
