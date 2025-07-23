import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface QuizCreatorProps {
  onBack: () => void;
  onQuizGenerated: (quiz: any) => void;
}

const QuizCreator = ({ onBack, onQuizGenerated }: QuizCreatorProps) => {
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQuiz = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic for your quiz");
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock AI-generated quiz
    const mockQuiz = {
      id: Math.random().toString(36).substr(2, 9),
      topic,
      questions: [
        {
          id: 1,
          question: `What is the most important concept in ${topic}?`,
          options: [
            "Fundamental principle",
            "Basic structure", 
            "Core methodology",
            "Primary framework"
          ],
          correctAnswer: 0
        },
        {
          id: 2,
          question: `Which best describes ${topic}?`,
          options: [
            "Complex system",
            "Simple process",
            "Innovative approach", 
            "Traditional method"
          ],
          correctAnswer: 2
        },
        {
          id: 3,
          question: `What is a key benefit of understanding ${topic}?`,
          options: [
            "Improved efficiency",
            "Better outcomes",
            "Enhanced knowledge",
            "All of the above"
          ],
          correctAnswer: 3
        }
      ],
      createdAt: new Date().toISOString(),
      participants: []
    };

    setIsGenerating(false);
    toast.success("Quiz generated successfully!");
    onQuizGenerated(mockQuiz);
  };

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="shadow-soft">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Create Your Quiz
            </CardTitle>
            <p className="text-muted-foreground">
              Enter any topic and let AI generate engaging questions for you
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="topic" className="text-base font-medium">
                Quiz Topic
              </Label>
              <Input
                id="topic"
                placeholder="e.g., Machine Learning, History of Rome, Climate Change..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="text-lg py-3"
                disabled={isGenerating}
              />
            </div>

            <Button 
              onClick={generateQuiz}
              disabled={isGenerating || !topic.trim()}
              variant="hero"
              size="lg"
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating Quiz...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate AI Quiz
                </>
              )}
            </Button>

            {/* Preview of what will be generated */}
            <div className="bg-muted rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-sm">What you'll get:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 3-5 AI-generated questions</li>
                <li>• Multiple choice options</li>
                <li>• Unique QR code for sharing</li>
                <li>• Real-time participation tracking</li>
                <li>• Instant leaderboard results</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizCreator;