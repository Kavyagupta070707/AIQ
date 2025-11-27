import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle, BookOpen, Trophy, Calendar, Users, Target } from "lucide-react";
import axios from "axios";

const Dashboard = ({ user, authToken, onCreateQuiz, onShowQuiz, onNavigate }) => {
  const [myQuizzes, setMyQuizzes] = useState([]);
  const [attendedQuizzes, setAttendedQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [createdRes, attendedRes] = await Promise.all([
          axios.get(`http://localhost:3000/api/quiz?createdBy=${user._id}`, {
            headers: { Authorization: `Bearer ${authToken}` }
          }),
          axios.get(`http://localhost:3000/api/results?userId=${user._id}`, {
            headers: { Authorization: `Bearer ${authToken}` }
          })
        ]);
        setMyQuizzes(createdRes.data);
        setAttendedQuizzes(attendedRes.data);
      } catch (err) {
        setMyQuizzes([]);
        setAttendedQuizzes([]);
      } finally {
        setLoading(false);
      }
    };
    if (user && authToken) fetchData();
  }, [user, authToken]);

  return (
    <>
      {(!user) && <div className="flex items-center justify-center min-h-screen">Please log in to view the dashboard.</div>}
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-8">
      <div className="w-full max-w-6xl px-4">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Welcome back, {user?.username}!
              </h1>
              <p className="text-muted-foreground mt-2">Manage your quizzes and track your progress</p>
            </div>
            <Button onClick={onCreateQuiz} size="lg" className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600">
              <PlusCircle className="w-5 h-5 mr-2" />
              Create New Quiz
            </Button>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card className="border-none shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Quizzes Created</p>
                    <p className="text-3xl font-bold mt-2">{myQuizzes.length}</p>
                  </div>
                  <BookOpen className="w-12 h-12 text-purple-200 opacity-80" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg bg-gradient-to-br from-pink-500 to-pink-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-pink-100 text-sm font-medium">Quizzes Attended</p>
                    <p className="text-3xl font-bold mt-2">{attendedQuizzes.length}</p>
                  </div>
                  <Trophy className="w-12 h-12 text-pink-200 opacity-80" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Avg Score</p>
                    <p className="text-3xl font-bold mt-2">
                      {attendedQuizzes.length > 0 
                        ? Math.round(attendedQuizzes.reduce((acc, r) => acc + (r.score / r.totalQuestions * 100), 0) / attendedQuizzes.length)
                        : 0}%
                    </p>
                  </div>
                  <Target className="w-12 h-12 text-orange-200 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quizzes Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg border-none">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                <CardTitle className="text-purple-900">My Created Quizzes</CardTitle>
              </div>
              <CardDescription>Click on any quiz to view details and share</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
              ) : myQuizzes.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">No quizzes created yet.</p>
                  <Button onClick={onCreateQuiz} variant="link" className="mt-2">
                    Create your first quiz
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {myQuizzes.map((quiz) => {
                    const handleCreatedQuizClick = () => {
                      console.log('Clicked quiz:', quiz);
                      onShowQuiz(quiz);
                      onNavigate('/quiz');
                    };
                    
                    return (
                      <div 
                        key={quiz._id} 
                        className="group p-4 rounded-lg border hover:border-purple-300 hover:bg-purple-50/50 transition-all cursor-pointer"
                        onClick={handleCreatedQuizClick}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg group-hover:text-purple-600 transition-colors">
                              {quiz.topic}
                            </h3>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(quiz.createdAt).toLocaleDateString()}
                              </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {quiz.participantCount || quiz.participants?.length || 0} participants
                            </span>
                            </div>
                          </div>
                          <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                            {quiz.questions?.length || 0} Qs
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg border-none">
            <CardHeader className="bg-gradient-to-r from-pink-50 to-orange-50">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-pink-600" />
                <CardTitle className="text-pink-900">My Quiz Results</CardTitle>
              </div>
              <CardDescription>View your performance on attended quizzes</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                </div>
              ) : attendedQuizzes.length === 0 ? (
                <div className="text-center py-8">
                  <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">No quizzes attended yet.</p>
                  <p className="text-sm text-muted-foreground mt-1">Take a quiz to see your results here!</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {attendedQuizzes.map((result) => {
                    const handleQuizClick = async () => {
                      try {
                        const quizRes = await axios.get(`http://localhost:3000/api/quiz/${result.quizId}`, {
                          headers: { Authorization: `Bearer ${authToken}` }
                        });
                        onShowQuiz(quizRes.data);
                        onNavigate('/quiz');
                      } catch (err) {
                        console.error('Failed to fetch quiz:', err);
                      }
                    };
                    
                    const percentage = Math.round((result.score / result.totalQuestions) * 100);
                    const getScoreColor = (pct: number) => {
                      if (pct >= 80) return 'text-green-600 bg-green-100';
                      if (pct >= 60) return 'text-blue-600 bg-blue-100';
                      if (pct >= 40) return 'text-orange-600 bg-orange-100';
                      return 'text-red-600 bg-red-100';
                    };
                    
                    return result.topic ? (
                      <div 
                        key={result._id} 
                        className="group p-4 rounded-lg border hover:border-pink-300 hover:bg-pink-50/50 transition-all cursor-pointer"
                        onClick={handleQuizClick}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg group-hover:text-pink-600 transition-colors">
                              {result.topic}
                            </h3>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(result.completedAt || Date.now()).toLocaleDateString()}
                              </span>
                              <span>
                                Score: {result.score}/{result.totalQuestions}
                              </span>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(percentage)}`}>
                            {percentage}%
                          </div>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </>
  );
};

export default Dashboard;
