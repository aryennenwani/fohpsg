const express = require('express');
const path = require('path');
const chatRoutes = require('./api/chat');
const therapyRoutes = require('./api/therapy');
const gratitudeRoutes = require('./api/gratitude');
const affirmationsRoutes = require('./api/affirmations');
const guidedTherapyRoutes = require('./api/guided-therapy');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chatbot.html'));
});

app.get('/therapy', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'therapy.html'));
});

app.get('/gratitude', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'gratitude.html'));
});

app.get('/affirmations', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'affirmations.html'));
});


app.use('/api', chatRoutes);
app.use('/api', therapyRoutes);
app.use('/api', gratitudeRoutes);
app.use('/api', affirmationsRoutes);
app.use('/api', guidedTherapyRoutes);

// Starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
