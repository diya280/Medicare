const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(cors({
    // origin: ["http://localhost:4200", "http://localhost:4201"],
    // origin: [""],
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// app.use('/public', express.static(path.join(__dirname, 'public')));
app.use("/public/images", express.static(path.join(__dirname, "public/images")));

const userRoutes = require('./Router/userRoutes');
app.use('/api', userRoutes);

const jwtSecret = process.env.JWT_SECRET;


const port = process.env.PORT || 8080;

async function startServer() {
    try {
        await require('./conn')();

        app.listen(port, () => {
            console.log('Server running on port:', port);
        });
    } catch (error) {
        console.error('Application startup failed:', error);
        process.exit(1);
    }
}

startServer();

