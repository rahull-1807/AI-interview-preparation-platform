const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(cookieParser());

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ message: "Server is running successfully!" });
});


// require all the routes here 
const authRouter = require('./routes/auth.routes');
const interviewRouter = require('./routes/interview.routes');

// using the router here
app.use('/api/auth', authRouter)
app.use('/api/interview', interviewRouter)

module.exports = app;
