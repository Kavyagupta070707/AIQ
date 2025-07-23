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

const QuizTaker = ({ quiz, onBack, onComplete }: QuizTakerProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [playerName, setPlayerName] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const startQuiz = () => {
    if (!playerName.trim()) {
      toast.error("Please enter your name to start");
      return;
    }
    setHasStarted(true);
    toast.success(`Welcome ${playerName}! Let's begin!`);
  };

  const selectAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const nextQuestion = () => {
    if (selectedAnswer === null) {
      toast.error("Please select an answer");
      return;
    }

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    setSelectedAnswer(null);

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz completed
      const score = newAnswers.reduce((total, answer, index) => {
        return total + (answer === quiz.questions[index].correctAnswer ? 1 : 0);
      }, 0);

      const results = {
        playerName,
        score,
        totalQuestions: quiz.questions.length,
        answers: newAnswers,
        completedAt: new Date().toISOString()
      };

      toast.success(`Quiz completed! You scored ${score}/${quiz.questions.length}`);
      onComplete(results);
    }
  };

  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-background py-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <Card className="shadow-soft">
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
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              {playerName}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              Question {currentQuestion + 1} of {quiz.questions.length}
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="shadow-soft">
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

            {/* Next Button */}
            <div className="pt-6">
              <Button 
                onClick={nextQuestion}
                disabled={selectedAnswer === null}
                variant="hero"
                size="lg"
                className="w-full"
              >
                {currentQuestion < quiz.questions.length - 1 ? "Next Question" : "Finish Quiz"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizTaker;