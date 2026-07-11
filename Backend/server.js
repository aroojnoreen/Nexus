const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 1. Initialize Express Application
const app = express();
const PORT = process.env.PORT || 5000;

// 2. Load Environment Variables Locally
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// 3. Global Middleware Configurations
app.use(cors());
app.use(express.json());

// 4. Connect to MongoDB Cloud Database
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully!'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// 5. Sample Base Route
app.get('/', (req, res) => {
    res.send('Nexus Backend API is running smoothly...');
});

// 6. Core Application Routing Modules
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/pitches', require('./routes/pitchRoutes'));

// Week 2: Meetings & Documents Chamber Operations
app.use('/api/week2', require('./routes/week2Routes'));

// 7. Bind the Server Listener
let server;
if (process.env.NODE_ENV !== 'production') {
    // Standard persistent server for local development
    server = app.listen(PORT, () => {
        console.log(`🚀 Server is blasting off on port ${PORT}`);
    });
} else {
    // Clean HTTP server wrapper required for Vercel Serverless environment
    const http = require('http');
    server = http.createServer(app);
}

// 8. WebRTC Live Signaling Engine Integration (Socket.io)
// Only initialize Socket.io if running locally (not on serverless cloud functions)
if (process.env.NODE_ENV !== 'production' && server) {
    const io = require('socket.io')(server, {
        cors: { origin: "*" }
    });

    io.on('connection', (socket) => {
        // Event: User joins a video calling space room
        socket.on('join-room', (roomId, userId) => {
            socket.join(roomId);
            socket.to(roomId).emit('user-connected', userId);

            socket.on('disconnect', () => {
                socket.to(roomId).emit('user-disconnected', userId);
            });
        });
    });
}

// 9. Export the app instance for Vercel Serverless Handler
module.exports = app;