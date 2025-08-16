import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, ArrowLeft, Key } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import OpenAI from "openai";

interface QuizCreatorProps {
  onBack: () => void;
  onQuizGenerated: (quiz: any) => void;
}

const QuizCreator = ({ onBack, onQuizGenerated }: QuizCreatorProps) => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  // Get Gemini API key from .env file
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
  const [isGenerating, setIsGenerating] = useState(false);

  // Removed localStorage and input logic for API key

  const generateQuiz = async (e) => {
    if (!topic.trim()) {
      toast.error("Please enter a topic for your quiz");
      return;
    }

    if (!apiKey.trim()) {
      toast.error("OpenAI API key is missing. Please set VITE_OPENAI_API_KEY in your .env file.");
      return;
    }

    setIsGenerating(true);
    try {
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

      // Gemini API endpoint for text generation
      const geminiEndpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

      const response = await fetch(`${geminiEndpoint}?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            { parts: [{ text: prompt }] }
          ]
        })
      });

      if (!response.ok) {
        let errorBody = "";
        try {
          errorBody = await response.text();
        } catch {}
        console.error(`Gemini API error (${response.status}):`, errorBody);
        if (response.status === 429) {
          toast.error("You have exceeded your Gemini quota or rate limit. Please check your usage, wait a few minutes, or upgrade your plan.");
        } else if (response.status === 401) {
          toast.error("Invalid Gemini API key. Please check your key and try again.");
        } else {
          toast.error("Failed to generate quiz. Please check your Gemini API key and try again.");
        }
        setIsGenerating(false);
        return;
      }
      const data = await response.json();
      // Gemini returns text in data.candidates[0].content.parts[0].text
      const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      let quizData: any = {};
      try {
        // Remove markdown code block markers if present
        let cleanText = responseText.trim();
        if (cleanText.startsWith('```json')) {
          cleanText = cleanText.replace(/^```json/, '').replace(/```$/, '').trim();
        } else if (cleanText.startsWith('```')) {
          cleanText = cleanText.replace(/^```/, '').replace(/```$/, '').trim();
        }
        quizData = JSON.parse(cleanText);
      } catch (e) {
        console.error("Failed to parse Gemini response as JSON", responseText);
        toast.error("Sorry, the quiz could not be generated. Please try again or change your topic.");
        setIsGenerating(false);
        return;
      }

      if (!quizData.questions || quizData.questions.length !== 10) {
        toast.error("Sorry, the quiz format was invalid. Please try again or change your topic.");
        setIsGenerating(false);
        return;
      }

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const quiz = {
        topic,
        questions: quizData.questions.map((q: any, index: number) => ({
          id: index + 1,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer
        })),
        createdAt: new Date().toISOString(),
        participants: [],
        createdBy: user?._id
      };
      e.preventDefault();
      try {
        const res = await axios.post("http://localhost:3000/api/quiz", quiz);
        setIsGenerating(false);
        toast.success("Quiz generated successfully!");
        onQuizGenerated(res.data);
        navigate('/quiz');
      } catch (err) {
        setIsGenerating(false);
        console.error(err);
        toast.error("Failed to save quiz to backend");
      }
    } catch (error) {
      setIsGenerating(false);
      console.error("Error generating quiz:", error);
      toast.error("Failed to generate quiz. Please check your Gemini API key and try again.");
    }
  };

  return (
    <div className="bg-purple-300 min-h-screen h-screen w-full flex items-center justify-center bg-background">
      <div className="w-full max-w-2xl px-4 flex flex-col items-center justify-center">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-8 self-start"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="shadow-soft w-full">
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