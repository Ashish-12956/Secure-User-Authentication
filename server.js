require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
app.use(express.json());

// Serve static frontend files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// In-Memory Database (Replace with MongoDB/PostgreSQL in production)
const users = [];
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_123';

// --- Authentication Routes ---

app.post('/api/register', async (req, res) => {
    try {
        const { username, password, role } = req.body;
        if (users.find(u => u.username === username)) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = { id: Date.now().toString(), username, password: hashedPassword, role: role || 'user' };
        users.push(newUser);
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = users.find(u => u.username === username);
        if (!user) return res.status(400).json({ message: 'Invalid credentials.' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: 'Invalid credentials.' });

        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Logged in successfully', token });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// --- Middleware ---

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied. Please log in.' });

    jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
        if (err) return res.status(403).json({ message: 'Session expired. Please log in again.' });
        req.user = decodedUser;
        next();
    });
};

// --- Protected Routes ---

app.get('/api/dashboard', authenticateToken, (req, res) => {
    res.json({ 
        message: 'Successfully accessed protected route!', 
        user: req.user 
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));