import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, ArrowLeft, Share2, Users, Target } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const LeaderboardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<any>(null);
  const [allResults, setAllResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [quizRes, leaderboardRes] = await Promise.all([
          axios.get(`http://localhost:3000/api/quiz/${id}`),
          axios.get(`http://localhost:3000/api/quiz/${id}/leaderboard`)
        ]);
        setQuiz(quizRes.data);
        setAllResults(leaderboardRes.data || []);
      } catch (err) {
        console.error("Failed to load leaderboard:", err);
        toast.error("Failed to load leaderboard");
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id, navigate]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold">{rank}</div>;
    }
  };

  const shareLeaderboard = () => {
    const text = `Check out the leaderboard for the ${quiz?.topic} quiz! 🏆`;
    
    if (navigator.share) {
      navigator.share({
        title: "Quiz Leaderboard",
        text: text,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Quiz not found</p>
      </div>
    );
  }

  const avgScore = allResults.length > 0 
    ? Math.round(allResults.reduce((sum, r) => sum + (r.score / r.totalQuestions * 100), 0) / allResults.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent flex items-center gap-3">
                <Trophy className="w-10 h-10 text-yellow-500" />
                Leaderboard
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Rankings for <span className="font-semibold text-purple-600">{quiz.topic}</span> quiz
              </p>
            </div>
            <Button onClick={shareLeaderboard} variant="outline" size="lg">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-none shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Total Participants</p>
                    <p className="text-3xl font-bold mt-2">{allResults.length}</p>
                  </div>
                  <Users className="w-12 h-12 text-purple-200 opacity-80" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg bg-gradient-to-br from-pink-500 to-pink-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-pink-100 text-sm font-medium">Average Score</p>
                    <p className="text-3xl font-bold mt-2">{avgScore}%</p>
                  </div>
                  <Target className="w-12 h-12 text-pink-200 opacity-80" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">High Score</p>
                    <p className="text-3xl font-bold mt-2">
                      {allResults.length > 0 ? Math.max(...allResults.map(r => r.score)) : 0}/{quiz.questions?.length || 0}
                    </p>
                  </div>
                  <Trophy className="w-12 h-12 text-orange-200 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Leaderboard */}
        <Card className="shadow-lg border-none">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="text-2xl font-bold">Rankings</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {allResults.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-lg text-muted-foreground">No participants yet</p>
                <p className="text-sm text-muted-foreground mt-2">Be the first to take this quiz!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {allResults.map((result, index) => {
                  const rank = index + 1;
                  const percentage = Math.round((result.score / result.totalQuestions) * 100);
                  
                  const getScoreColor = (pct: number) => {
                    if (pct >= 80) return 'text-green-600 bg-green-50';
                    if (pct >= 60) return 'text-blue-600 bg-blue-50';
                    if (pct >= 40) return 'text-orange-600 bg-orange-50';
                    return 'text-red-600 bg-red-50';
                  };

                  const getRankBg = (rank: number) => {
                    if (rank === 1) return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300';
                    if (rank === 2) return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300';
                    if (rank === 3) return 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-300';
                    return 'bg-white hover:bg-gray-50';
                  };

                  return (
                    <div
                      key={`${result._id}-${index}`}
                      className={`flex items-center gap-4 p-5 rounded-lg border-2 transition-all ${getRankBg(rank)}`}
                    >
                      <div className="flex items-center gap-3 min-w-[60px]">
                        {getRankIcon(rank)}
                        <div className="text-xl font-bold text-muted-foreground">
                          #{rank}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-lg truncate flex items-center gap-2">
                          {result.playerName}
                          {rank <= 3 && (
                            <Badge 
                              variant="secondary" 
                              className={rank === 1 ? 'bg-yellow-500 text-white' : ''}
                            >
                              {rank === 1 ? '🥇 Winner' : rank === 2 ? '🥈 2nd' : '🥉 3rd'}
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Completed {new Date(result.completedAt).toLocaleDateString()} at {new Date(result.completedAt).toLocaleTimeString()}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          {result.score}/{result.totalQuestions}
                        </div>
                        <div className={`text-sm font-semibold px-2 py-1 rounded ${getScoreColor(percentage)}`}>
                          {percentage}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeaderboardPage;
