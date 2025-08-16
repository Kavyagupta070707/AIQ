import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import usermodel from './models/user.js';
import authRoutes from './routes/auth.js';
import Quiz from './models/quiz.js';
import Result from './models/result.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/auth', authRoutes);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/aiquiz', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

// User endpoints (legacy/demo)
app.post('/user', async (req, res) => {
    let user = req.body;
    await usermodel.create(user);
    res.status(201).send({ message: "User created successfully" });
});

app.get('/user', async (req, res) => {
    let users = await usermodel.find();
    res.status(200).send(users);
});

// --- Quiz Endpoints ---
// Create a new quiz
app.post('/api/quiz', async (req, res) => {
    try {
        const { topic, questions, createdBy } = req.body;
        const quiz = await Quiz.create({
            topic,
            questions,
            createdBy,
            createdAt: new Date(),
            participants: []
        });
        res.status(201).json(quiz);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get quizzes created by a user
app.get('/api/quiz', async (req, res) => {
    try {
        const { createdBy } = req.query;
        if (!createdBy) return res.status(400).json({ error: 'createdBy is required' });
        const quizzes = await Quiz.find({ createdBy });
        res.json(quizzes);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get quizzes attended by a user (results)
app.get('/api/results', async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ error: 'userId is required' });
        const results = await Result.find({ userId }).populate('quizId');
        res.json(results);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get quiz by ID
app.get('/api/quiz/:id', async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
        res.json(quiz);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// --- Result Endpoints ---
// Submit quiz result
app.post('/api/quiz/:id/submit', async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
        const { userId, playerName, score, totalQuestions, answers, completedAt } = req.body;
        const result = await Result.create({
            quizId: quiz._id,
            userId,
            topic: quiz.topic,
            playerName,
            score,
            totalQuestions,
            answers,
            completedAt
        });
        console.log('Result saved:', result);
        res.status(201).json(result);
    } catch (err) {
        console.error('Error saving result:', err);
        res.status(400).json({ error: err.message });
    }
});

// Get leaderboard for a quiz
app.get('/api/quiz/:id/leaderboard', async (req, res) => {
    try {
        const results = await Result.find({ quizId: req.params.id })
            .sort({ score: -1, completedAt: 1 })
            .limit(50);
        res.json(results);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});