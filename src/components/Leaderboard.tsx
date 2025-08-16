import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, ArrowLeft, Share2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

interface LeaderboardProps {
  quiz: any;
  results: any;
  onBack: () => void;
  onNewQuiz: () => void;
}

const Leaderboard = ({ quiz, results, onBack, onNewQuiz }: LeaderboardProps) => {
  const [allResults, setAllResults] = useState<any[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/quiz/${quiz._id}/leaderboard`);
        // Add the current user's result if not present
        let leaderboard = res.data || [];
        const exists = leaderboard.some((r: any) => r.playerName === results.playerName && r.score === results.score);
        if (!exists) {
          leaderboard = [results, ...leaderboard];
        }
        setAllResults(leaderboard);
      } catch (err) {
        toast.error("Failed to load leaderboard");
        setAllResults([results]);
      }
    };
    if (quiz && quiz._id) fetchLeaderboard();
  }, [quiz, results]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-accent" />;
      case 2:
        return <Medal className="w-5 h-5 text-muted-foreground" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs font-bold">{rank}</div>;
    }
  };

  const getRankBadgeVariant = (rank: number) => {
    switch (rank) {
      case 1:
        return "default";
      case 2:
        return "secondary";
      case 3:
        return "outline";
      default:
        return "outline";
    }
  };

  const shareResults = () => {
    const text = `I just completed a quiz about ${quiz.topic} and scored ${results.score}/${results.totalQuestions}! 🎉`;
    
    if (navigator.share) {
      navigator.share({
        title: "Quiz Results",
        text: text,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(text);
      toast.success("Results copied to clipboard!");
    }
  };

  const userRank = allResults.findIndex(r => r.playerName === results.playerName) + 1;
  const percentageScore = Math.round((results.score / results.totalQuestions) * 100);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="w-full max-w-4xl px-4 flex flex-col items-center justify-start py-8">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-8 self-start"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Take Quiz Again
        </Button>

        <div className="grid lg:grid-cols-3 gap-8 w-full">
          {/* Personal Results */}
          <div className="lg:col-span-1 flex flex-col justify-start">
            <Card className="shadow-soft bg-gradient-card">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Your Results</CardTitle>
                <p className="text-muted-foreground">{quiz.topic}</p>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-primary">
                    {results.score}/{results.totalQuestions}
                  </div>
                  <div className="text-lg text-muted-foreground">
                    {percentageScore}% Correct
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2">
                  {getRankIcon(userRank)}
                  <Badge variant={getRankBadgeVariant(userRank)} className="text-sm">
                    Rank #{userRank}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <Button onClick={shareResults} variant="outline" className="w-full">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Results
                  </Button>
                  <Button onClick={onNewQuiz} variant="hero" className="w-full">
                    Create New Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Leaderboard */}
          <div className="lg:col-span-2 flex flex-col justify-start">
            <Card className="shadow-soft w-full">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-accent" />
                  Leaderboard
                </CardTitle>
                <p className="text-muted-foreground">
                  Live rankings for "{quiz.topic}" quiz
                </p>
              </CardHeader>
              <CardContent className="overflow-auto max-h-[60vh]">
                <div className="space-y-3">
                  {allResults.map((result, index) => {
                    const rank = index + 1;
                    const isCurrentUser = result.playerName === results.playerName;
                    return (
                      <div
                        key={`${result.playerName}-${index}`}
                        className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                          isCurrentUser 
                            ? 'bg-primary/5 border-primary shadow-soft' 
                            : 'bg-card hover:bg-muted'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {getRankIcon(rank)}
                          <div className="text-lg font-bold text-muted-foreground">
                            #{rank}
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="font-semibold flex items-center gap-2">
                            {result.playerName}
                            {isCurrentUser && (
                              <Badge variant="secondary" className="text-xs">You</Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Completed {new Date(result.completedAt).toLocaleTimeString()}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {result.score}/{result.totalQuestions}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {Math.round((result.score / result.totalQuestions) * 100)}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Stats Summary */}
                <div className="mt-8 grid grid-cols-3 gap-4 pt-6 border-t">
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">{allResults.length}</div>
                    <div className="text-sm text-muted-foreground">Participants</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-secondary">
                      {Math.round(allResults.reduce((sum, r) => sum + r.score, 0) / allResults.length * 10) / 10}
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-accent">
                      {Math.max(...allResults.map(r => r.score))}
                    </div>
                    <div className="text-sm text-muted-foreground">High Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;