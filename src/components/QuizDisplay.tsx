import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, QrCode, Users, Copy, Share2 } from "lucide-react";
import { toast } from "sonner";
import QRCodeGenerator from "./QRCodeGenerator";

 interface QuizDisplayProps {
  quiz: any;
  onBack: () => void;
}

const QuizDisplay = ({ quiz, onBack }: QuizDisplayProps) => {
  const navigate = useNavigate();
  const handleStartQuiz = () => {
    const quizId = quiz._id || quiz.id;
    navigate(`/quiz/${quizId}/take`);
  };
  const [showQRCode, setShowQRCode] = useState(false);
  const quizUrl = `${window.location.origin}/quiz/${quiz.id}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(quizUrl);
    toast.success("Quiz link copied to clipboard!");
  };

  const shareQuiz = () => {
    if (navigator.share) {
      navigator.share({
        title: `Quiz: ${quiz.topic}`,
        text: `Join this interactive quiz about ${quiz.topic}!`,
        url: quizUrl,
      });
    } else {
      copyToClipboard();
    }
  };
   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  const handlePrevious = () => {
    if (currentQuestionIndex >0) {
      setCurrentQuestionIndex(prev => prev -1);
    }
  };

  const question = quiz.questions[currentQuestionIndex];
  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Create Another Quiz
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Quiz Info */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Quiz Generated Successfully!
              </CardTitle>
              <p className="text-muted-foreground">
                Your quiz about <span className="font-semibold text-primary">{quiz.topic}</span> is ready to share
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Quiz Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{quiz.questions.length}</div>
                  <div className="text-sm text-muted-foreground">Questions</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-secondary">{quiz.participants.length}</div>
                  <div className="text-sm text-muted-foreground">Participants</div>
                </div>
              </div>

              {/* Share Options */}
              <div className="space-y-3">
                <Button
                  onClick={() => setShowQRCode(!showQRCode)}
                  variant="outline"
                  className="w-full"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  {showQRCode ? "Hide QR Code" : "Show QR Code"}
                </Button>

                <div className="flex gap-2">
                  <Button onClick={copyToClipboard} variant="outline" className="flex-1">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </Button>
                  <Button onClick={shareQuiz} variant="outline" className="flex-1">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Start Quiz */}
              <Button onClick={handleStartQuiz} variant="hero" className="w-full">
                <Users className="w-4 h-4 mr-2" />
                Attend Quiz
              </Button>
            </CardContent>
          </Card>

          {/* QR Code / Questions Preview */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-xl">
                {showQRCode ? "Scan to Join" : "Questions Preview"}
              </CardTitle>
            </CardHeader>

            <CardContent className="h-[350px] flex flex-col justify-between">
              {showQRCode ? (
                <div className="text-center space-y-4">
                  <QRCodeGenerator value={quizUrl} size={200} />
                  <p className="text-sm text-muted-foreground">
                    Participants can scan this QR code to join the quiz instantly
                  </p>
                  <div className="bg-muted rounded-lg p-3">
                    <code className="text-xs break-all">{quizUrl}</code>
                  </div>
                </div>
              ) : (
                <div className="space-y-4  " >
                  <div key={question.id} className="border rounded-lg p-4  h-[270px]">
                    <h4 className="font-semibold mb-2">
                      {currentQuestionIndex + 1}. {question.question}
                    </h4>
                    <div className="space-y-1">
                      {question.options.map((option: string, optIndex: number) => (
                        <div
                          key={optIndex}
                          className={`text-sm p-2 rounded ${optIndex === question.correctAnswer
                              ? "bg-primary/10 text-primary border border-primary/20"
                              : "bg-muted"
                            }`}
                        >

                          {String.fromCharCode(65 + optIndex)}. {option}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={handlePrevious}
                      disabled={currentQuestionIndex === 0}
                      className="bg-primary text-white px-4 py-2 rounded disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={currentQuestionIndex === quiz.questions.length - 1}
                      className="bg-primary text-white px-4 py-2 rounded disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
              
          </CardContent>
        </Card>
      </div>
    </div>
    </div >
  );
};

export default QuizDisplay;