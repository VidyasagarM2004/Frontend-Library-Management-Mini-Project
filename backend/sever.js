const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/libraryDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// User Schema
const UserSchema = new mongoose.Schema({
    name: String,
    universityId: String,
    password: String
});
const User = mongoose.model('User', UserSchema);

// Register Route
app.post('/api/register', async (req, res) => {
    const { name, universityId, password } = req.body;
    try {
        const existingUser = await User.findOne({ universityId });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        const newUser = new User({ name, universityId, password });
        await newUser.save();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Login Route
app.post('/api/login', async (req, res) => {
    const { universityId, password } = req.body;
    try {
        const user = await User.findOne({ universityId, password });
        if (user) {
            res.json({ success: true });
        } else {
            res.status(400).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Serve frontend
app.use(express.static(path.join(__dirname, '../frontend')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
