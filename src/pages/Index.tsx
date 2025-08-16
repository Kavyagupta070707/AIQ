
import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate, useParams } from "react-router-dom";
import axios from "axios";
// Wrapper to fetch quiz by id from backend for /quiz/:id/take
function QuizTakerWrapper({ onComplete }: { onComplete: (results: any) => void }) {
  const { id } = useParams();
  const [quiz, setQuiz] = React.useState<any>(null);
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!id) return;
    axios.get(`http://localhost:3000/api/quiz/${id}`)
      .then(res => setQuiz(res.data))
      .catch(() => navigate("/dashboard"));
  }, [id, navigate]);
  if (!quiz) return <div className="flex items-center justify-center min-h-screen">Loading quiz...</div>;
  return <QuizTaker quiz={quiz} onBack={() => navigate('/quiz')} onComplete={onComplete} />;
}
import HeroSection from "@/components/HeroSection";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import Dashboard from "./Dashboard";
import QuizCreator from "@/components/QuizCreator";
import QuizDisplay from "@/components/QuizDisplay";
import QuizTaker from "@/components/QuizTaker";
import Leaderboard from "@/components/Leaderboard";
const Index = () => {
  const [authToken, setAuthToken] = useState<string | null>(() => localStorage.getItem('authToken'));
  const [user, setUser] = useState<any>(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  });
  const [currentQuiz, setCurrentQuiz] = useState<any>(null);
  const [quizResults, setQuizResults] = useState<any>(null);
  const navigate = useNavigate();

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
    navigate('/dashboard');
  };
  const handleLogout = () => {
    setAuthToken(null);
    setUser(null);
    navigate('/');
  };

  return (
    <>
      <div className="absolute top-4 right-4 flex gap-2">
        {user ? (
          <>
            <span className="text-sm">Hello, {user.username}</span>
            <button onClick={handleLogout} className="text-blue-600 underline text-sm">Logout</button>
          </>
        ) : null}
      </div>
      <Routes>
        <Route path="/" element={<HeroSection onLogin={() => navigate('/login')} onSignup={() => navigate('/signup')} onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/login" element={<LoginPage onSignupRedirect={() => navigate('/signup')} onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/signup" element={<SignupPage onLoginRedirect={() => navigate('/login')} />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} authToken={authToken} onCreateQuiz={() => navigate('/create')} onShowQuiz={setCurrentQuiz} /> : <Navigate to="/login" />} />
        <Route path="/create" element={user ? <QuizCreator onBack={() => navigate('/dashboard')} onQuizGenerated={setCurrentQuiz} /> : <Navigate to="/login" />} />
        <Route path="/quiz" element={currentQuiz ? <QuizDisplay quiz={currentQuiz} onBack={() => navigate('/dashboard')} /> : <Navigate to="/dashboard" />} />
        <Route path="/take" element={currentQuiz ? <QuizTaker quiz={currentQuiz} onBack={() => navigate('/quiz')} onComplete={setQuizResults} /> : <Navigate to="/dashboard" />} />
        <Route path="/quiz/:id/take" element={<QuizTakerWrapper onComplete={setQuizResults} />} />
        <Route path="/leaderboard" element={currentQuiz && quizResults ? <Leaderboard quiz={currentQuiz} results={quizResults} onBack={() => navigate('/take')} onNewQuiz={() => navigate('/create')} /> : <Navigate to="/dashboard" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default Index;


