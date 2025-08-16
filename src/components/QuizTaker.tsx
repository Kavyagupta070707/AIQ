import axios from "axios";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Clock, Users } from "lucide-react";
import { toast } from "sonner";

interface QuizTakerProps {
  quiz: any;
  onBack: () => void;
  onComplete: (results: any) => void;
}

const QuizTaker =  ({ quiz, onBack, onComplete }: QuizTakerProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]); // allow null for unanswered
  const [playerName, setPlayerName] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  if (!quiz) {
    return <div className="flex items-center justify-center min-h-screen">Loading quiz...</div>;
  }

  // selectedAnswer is derived from answers[currentQuestion]
  const selectedAnswer = answers[currentQuestion] ?? null;

  const startQuiz = () => {
    if (!playerName.trim()) {
      toast.error("Please enter your name to start");
      return;
    }
    // Initialize answers array with nulls
    setAnswers(Array(quiz.questions.length).fill(null));
    setCurrentQuestion(0);
    setHasStarted(true);
    toast.success(`Welcome ${playerName}! Let's begin!`);
  };

  const selectAnswer = (answerIndex: number) => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[currentQuestion] = answerIndex;
      return updated;
    });
  };

  const nextQuestion = async () => {
    if (selectedAnswer === null) {
      toast.error("Please select an answer");
      return;
    }
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz completed
      const score = answers.reduce((total, answer, index) => {
        return total + (answer === quiz.questions[index].correctAnswer ? 1 : 0);
      }, 0);
      const results = {
        playerName,
        score,
        totalQuestions: quiz.questions.length,
        answers,
        completedAt: new Date().toISOString()
      };
      try {
        // Try to get userId from localStorage (if logged in)
        let userId = null;
        try {
          const userStr = localStorage.getItem('user');
          if (userStr) {
            const userObj = JSON.parse(userStr);
            userId = userObj._id;
          }
        } catch {}
        await axios.post(`http://localhost:3000/api/quiz/${quiz._id}/submit`, {
          quizId: quiz._id,
          
          playerName,
          userId,
          topic: quiz.topic,
          score,
          totalQuestions: quiz.questions.length,
          answers,
          completedAt: new Date().toISOString()
        });
        toast.success(`Quiz completed! You scored ${score}/${quiz.questions.length}`);
        onComplete(results);
      } catch (err) {
        if (err.response && err.response.data && err.response.data.error) {
          toast.error(`Failed to submit results: ${err.response.data.error}`);
        } else {
          toast.error("Failed to submit results to backend");
        }
        console.error("Failed to submit results to backend", err);
      }
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-full max-w-3xl px-4 flex flex-col items-center justify-center">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-8 self-start"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Card className="shadow-soft w-full">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">
                Quiz: {quiz.topic}
              </CardTitle>
              <p className="text-muted-foreground">
                {quiz.questions.length} questions • Multiple choice
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="playerName" className="text-base font-medium">
                  Your Name
                </Label>
                <Input
                  id="playerName"
                  placeholder="Enter your name..."
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="text-lg py-3"
                />
              </div>
              <Button 
                onClick={startQuiz}
                variant="hero"
                size="lg"
                className="w-full"
              >
                Start Quiz
              </Button>
              <div className="bg-muted rounded-lg p-4 space-y-2">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Quiz Info
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• {quiz.questions.length} multiple choice questions</li>
                  <li>• Each question has 4 possible answers</li>
                  <li>• Take your time, no time limit</li>
                  <li>• Results will be shown at the end</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="w-full max-w-5xl px-4 flex flex-row items-center justify-center py-8 gap-8">
        {/* Circular Progress Section */}
        <div className="hidden md:flex flex-col items-center justify-center w-1/4 max-w-[140px] h-full">
          <div className="mb-4 text-base font-semibold text-primary text-center truncate max-w-[120px]">
            {playerName}
          </div>
          <div style={{ width: 100, height: 100 }}>
            <CircularProgressbar
              value={progress}
              text={`${currentQuestion + 1}/${quiz.questions.length}`}
              styles={buildStyles({
                textColor: '#6366f1',
                pathColor: '#6366f1',
                trailColor: '#e5e7eb',
                textSize: '1.1rem',
                strokeLinecap: 'round',
              })}
            />
          </div>
          <div className="mt-4 text-sm font-medium text-muted-foreground text-center">
            Progress
          </div>
        </div>
        {/* Quiz Card Section */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <Card className="shadow-soft w-full">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                {question.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Answer Options */}
              <div className="space-y-3">
                {question.options.map((option: string, index: number) => (
                  <Button
                    key={index}
                    variant={selectedAnswer === index ? "default" : "outline"}
                    className="w-full justify-start p-6 h-auto text-left"
                    onClick={() => selectAnswer(index)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-base">{option}</span>
                    </div>
                  </Button>
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="pt-6 flex gap-4">
                <Button 
                  onClick={prevQuestion}
                  disabled={currentQuestion === 0}
                  variant="outline"
                  size="lg"
                  className="w-1/2"
                >
                  Previous
                </Button>
                <Button 
                  onClick={nextQuestion}
                  disabled={selectedAnswer === null}
                  variant="hero"
                  size="lg"
                  className="w-1/2"
                >
                  {currentQuestion < quiz.questions.length - 1 ? "Next" : "Finish Quiz"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
export default QuizTaker;