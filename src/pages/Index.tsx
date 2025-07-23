import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import QuizCreator from "@/components/QuizCreator";
import QuizDisplay from "@/components/QuizDisplay";
import QuizTaker from "@/components/QuizTaker";
import Leaderboard from "@/components/Leaderboard";

type AppState = 'home' | 'create' | 'display' | 'quiz' | 'leaderboard';

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('home');
  const [currentQuiz, setCurrentQuiz] = useState<any>(null);
  const [quizResults, setQuizResults] = useState<any>(null);

  const handleGetStarted = () => {
    setCurrentState('create');
  };

  const handleBack = () => {
    setCurrentState('home');
    setCurrentQuiz(null);
    setQuizResults(null);
  };

  const handleQuizGenerated = (quiz: any) => {
    setCurrentQuiz(quiz);
    setCurrentState('display');
  };

  const handleStartQuiz = () => {
    setCurrentState('quiz');
  };

  const handleQuizComplete = (results: any) => {
    setQuizResults(results);
    setCurrentState('leaderboard');
  };

  const handleNewQuiz = () => {
    setCurrentState('create');
    setCurrentQuiz(null);
    setQuizResults(null);
  };

  switch (currentState) {
    case 'create':
      return (
        <QuizCreator 
          onBack={handleBack}
          onQuizGenerated={handleQuizGenerated}
        />
      );
    case 'display':
      return (
        <QuizDisplay 
          quiz={currentQuiz}
          onBack={handleBack}
          onStartQuiz={handleStartQuiz}
        />
      );
    case 'quiz':
      return (
        <QuizTaker 
          quiz={currentQuiz}
          onBack={() => setCurrentState('display')}
          onComplete={handleQuizComplete}
        />
      );
    case 'leaderboard':
      return (
        <Leaderboard 
          quiz={currentQuiz}
          results={quizResults}
          onBack={() => setCurrentState('quiz')}
          onNewQuiz={handleNewQuiz}
        />
      );
    default:
      return <HeroSection onGetStarted={handleGetStarted} />;
  }
};

export default Index;
