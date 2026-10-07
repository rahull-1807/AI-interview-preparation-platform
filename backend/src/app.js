const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('node:path');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (req, res) => {
    const connected = mongoose.connection.readyState === 1;
    res.status(connected ? 200 : 503).json({ status: connected ? 'ok' : 'database unavailable' });
});


// require all the routes here 
const authRouter = require('./routes/auth.routes');
const interviewRouter = require('./routes/interview.routes');

// using the router here
app.use('/api/auth', authRouter)
app.use('/api/interview', interviewRouter)

app.use('/api', (req, res) => {
    res.status(404).json({ message: 'API endpoint not found' });
});

if (process.env.NODE_ENV === 'production') {
    const frontendPath = path.resolve(__dirname, '../../frontend/dist');
    app.use(express.static(frontendPath));
    // Express 5 requires a named wildcard; braces include the home page.
    app.get('/{*path}', (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.json({ message: 'Server is running successfully!' });
    });
}

module.exports = app;
