const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const zineRoutes = require('./routes/zineRoutes');
const questionnaireRoutes = require('./routes/questionnaireRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (Frontend & Uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/', express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api/zines', zineRoutes);
app.use('/api/questionnaire', questionnaireRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Fallback for frontend routing (if needed)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
