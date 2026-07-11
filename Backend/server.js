const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Middleware Configurations
app.use(cors());
app.use(express.json());

// 2. Connect to MongoDB Cloud Database
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully!'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// 3. Sample Base Route
app.get('/', (req, res) => {
    res.send('Nexus Backend API is running smoothly...');
});

// 4. Core Application Routing Modules
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/pitches', require('./routes/pitchRoutes'));

// Week 2: Meetings & Documents Chamber Operations
app.use('/api/week2', require('./routes/week2Routes'));

// Bind the listener only if we are running locally, not on Vercel's production platform
let server;
if (process.env.NODE_ENV !== 'production') {
    server = app.listen(PORT, () => {
        console.log(`🚀 Server is blasting off on port ${PORT}`);
    });
} else {
    // On Vercel, we still need a server instance created for Socket.io to bind safely
    const http = require('http');
    server = http.createServer(app);
}

// 6. WebRTC Live Signaling Engine Integration (Socket.io)
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
module.exports = app;