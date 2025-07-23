import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, ArrowLeft, Key } from "lucide-react";
import { toast } from "sonner";
import OpenAI from "openai";

interface QuizCreatorProps {
  onBack: () => void;
  onQuizGenerated: (quiz: any) => void;
}

const QuizCreator = ({ onBack, onQuizGenerated }: QuizCreatorProps) => {
  const [topic, setTopic] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openai_api_key', apiKey.trim());
      toast.success("API key saved successfully!");
    }
  };

  const generateQuiz = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic for your quiz");
      return;
    }

    if (!apiKey.trim()) {
      toast.error("Please enter your OpenAI API key");
      return;
    }

    setIsGenerating(true);
    
    try {
      const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
      });

      const prompt = `Create a quiz about "${topic}" with exactly 10 multiple choice questions. Each question should have 4 options. Return the response in this exact JSON format:
      {
        "questions": [
          {
            "question": "Question text here?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": 0
          }
        ]
      }
      
      Make sure the questions are educational, varied in difficulty, and cover different aspects of the topic. The correctAnswer should be the index (0-3) of the correct option.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4.1-2025-04-14",
        messages: [
          {
            role: "system",
            content: "You are a quiz generator. Always respond with valid JSON in the exact format requested."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const responseText = completion.choices[0].message.content;
      const quizData = JSON.parse(responseText || "{}");
      
      if (!quizData.questions || quizData.questions.length !== 10) {
        throw new Error("Invalid quiz format received");
      }

      const quiz = {
        id: Math.random().toString(36).substr(2, 9),
        topic,
        questions: quizData.questions.map((q: any, index: number) => ({
          id: index + 1,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer
        })),
        createdAt: new Date().toISOString(),
        participants: []
      };

      setIsGenerating(false);
      toast.success("Quiz generated successfully!");
      onQuizGenerated(quiz);
      
    } catch (error) {
      setIsGenerating(false);
      console.error("Error generating quiz:", error);
      toast.error("Failed to generate quiz. Please check your API key and try again.");
    }
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
              <Label htmlFor="apiKey" className="text-base font-medium">
                OpenAI API Key
              </Label>
              <div className="flex gap-2">
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="flex-1"
                  disabled={isGenerating}
                />
                <Button 
                  onClick={saveApiKey}
                  variant="outline"
                  disabled={isGenerating || !apiKey.trim()}
                >
                  <Key className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Your API key is stored locally and never sent to our servers
              </p>
            </div>

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
              disabled={isGenerating || !topic.trim() || !apiKey.trim()}
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
                <li>• 10 AI-generated questions</li>
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