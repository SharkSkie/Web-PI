const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

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
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ── API Routes ──
// Vercel strips /api prefix when routing to /api/index.js
// So we mount on BOTH /api/... and /... to handle both cases
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/zines', zineRoutes);
app.use('/zines', zineRoutes);

app.use('/api/questionnaire', questionnaireRoutes);
app.use('/questionnaire', questionnaireRoutes);

app.use('/api/admin', adminRoutes);
app.use('/admin', adminRoutes);

// Health check — confirms backend is live
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'MindZine API is running ✅', timestamp: new Date().toISOString() });
});
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'MindZine API is running ✅', timestamp: new Date().toISOString() });
});
app.get('/api', (req, res) => {
    res.json({ status: 'ok', message: 'MindZine API is running ✅' });
});

// Start server only when run directly (not on Vercel)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

// Export for Vercel serverless
module.exports = app;
