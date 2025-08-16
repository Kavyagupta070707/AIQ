import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";

const Dashboard = ({ user, authToken, onCreateQuiz, onShowQuiz }) => {
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
    <div className="min-h-screen flex flex-col items-center justify-start bg-background py-8">
      <div className="w-full max-w-4xl px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={onCreateQuiz}>Create New Quiz</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Quizzes Made By Me</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? "Loading..." : myQuizzes.length === 0 ? "No quizzes created yet." : (
                <ul className="space-y-2">
                  {myQuizzes.map((quiz) => (
                    <li key={quiz._id}>
                      <Button variant="link" onClick={() => onShowQuiz(quiz)}>{quiz.topic}</Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Quizzes Attended By Me</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? "Loading..." : attendedQuizzes.length === 0 ? "No quizzes attended yet." : (
                <ul className="space-y-2">
                  {attendedQuizzes.map((result) => (
                    result.topic ? (
                      <li key={result._id}>
                        <Button variant="link" onClick={() => onShowQuiz(result.quiz)}>{result.topic}</Button>
                      </li>
                    ) : null
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
