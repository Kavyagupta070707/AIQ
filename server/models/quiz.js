import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  questions: [
    {
      id: Number,
      question: String,
      options: [String],
      correctAnswer: Number
    }
  ],
  createdAt: { type: Date, default: Date.now },
  participants: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;
