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

// Ensure uploads directory exists (local dev only; Vercel filesystem is read-only)
const uploadsDir = path.join(__dirname, '../uploads');
try {
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }
} catch (e) {
    // Ignore on read-only filesystems (Vercel serverless)
}

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Mount routes on BOTH /api/* and /* so Vercel URL rewrites work 100% seamlessly
app.use('/api/zines', zineRoutes);
app.use('/zines', zineRoutes);

app.use('/api/questionnaire', questionnaireRoutes);
app.use('/questionnaire', questionnaireRoutes);

app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/admin', adminRoutes);
app.use('/admin', adminRoutes);

// Health check
app.get(['/api', '/'], (req, res) => {
    res.json({ message: 'MindZine API is running', status: 'ok' });
});

// Start server only when run directly (not on Vercel)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

// Export for Vercel serverless
module.exports = app;
