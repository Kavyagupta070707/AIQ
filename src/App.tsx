import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import axios from "axios";
// Wrapper to fetch quiz by id from backend for /quiz/:id/take
function QuizTakerWrapper({ onComplete }: { onComplete: (results: any) => void }) {
  const { id } = useParams();
  const [quiz, setQuiz] = useState<any>(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!id) return;
    axios.get(`http://localhost:3000/api/quiz/${id}`)
      .then(res => setQuiz(res.data))
      .catch(() => navigate("/dashboard"));
  }, [id, navigate]);
  const handleComplete = (results: any) => {
    onComplete(results);
    navigate('/leaderboard');
  };
  if (!quiz) return <div className="flex items-center justify-center min-h-screen">Loading quiz...</div>;
  return <QuizTaker quiz={quiz} onBack={() => navigate('/quiz')} onComplete={handleComplete} />;
}
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import QuizCreator from "@/components/QuizCreator";
import QuizDisplay from "@/components/QuizDisplay";
import QuizTaker from "@/components/QuizTaker";
import Leaderboard from "@/components/Leaderboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [authToken, setAuthToken] = useState<string | null>(() => localStorage.getItem('authToken'));
  const [user, setUser] = useState<any>(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  });
  const [currentQuiz, setCurrentQuiz] = useState<any>(null);
  const [quizResults, setQuizResults] = useState<any>(null);
  // useNavigate can't be used outside Router, so use window.location for redirects in handlers

  useEffect(() => {
    if (authToken) localStorage.setItem('authToken', authToken);
    else localStorage.removeItem('authToken');
  }, [authToken]);
  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  const handleLoginSuccess = (token: string, userObj: any) => {
    setAuthToken(token);
    setUser(userObj);
    window.location.href = '/dashboard';
  };
  const handleLogout = () => {
    setAuthToken(null);
    setUser(null);
    window.location.href = '/';
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="absolute top-4 right-4 flex gap-2">
            {user ? (
              <>
                <span className="text-sm">Hello, {user.username}</span>
                <button onClick={handleLogout} className="text-blue-600 underline text-sm">Logout</button>
              </>
            ) : null}
          </div>
          <Routes>
            <Route path="/" element={<HeroSection onLogin={() => window.location.href='/login'} onSignup={() => window.location.href='/signup'} onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/login" element={<LoginPage onSignupRedirect={() => window.location.href='/signup'} onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/signup" element={<SignupPage onLoginRedirect={() => window.location.href='/login'} />} />
            <Route path="/dashboard" element={user ? <Dashboard user={user} authToken={authToken} onCreateQuiz={() => window.location.href='/create'} onShowQuiz={setCurrentQuiz} /> : <Navigate to="/login" />} />
            <Route path="/create" element={user ? <QuizCreator onBack={() => window.location.href='/dashboard'} onQuizGenerated={setCurrentQuiz} /> : <Navigate to="/login" />} />
            <Route path="/quiz" element={currentQuiz ? <QuizDisplay quiz={currentQuiz} onBack={() => window.location.href='/dashboard'} /> : <Navigate to="/dashboard" />} />
            <Route path="/take" element={currentQuiz ? <QuizTaker quiz={currentQuiz} onBack={() => window.location.href='/quiz'} onComplete={setQuizResults} /> : <Navigate to="/dashboard" />} />
            <Route path="/quiz/:id/take" element={<QuizTakerWrapper onComplete={setQuizResults} />} />
            <Route path="/leaderboard" element={currentQuiz && quizResults ? <Leaderboard quiz={currentQuiz} results={quizResults} onBack={() => window.location.href='/take'} onNewQuiz={() => window.location.href='/create'} /> : <Navigate to="/dashboard" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
