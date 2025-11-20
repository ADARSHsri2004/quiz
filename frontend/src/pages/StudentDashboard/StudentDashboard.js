import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import axios from 'axios';

export default function StudentDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [submissions, setSubmissions] = useState({}); // { quizId: { score, submittedAt } }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/quizzes/list`);
        const quizzesData = res.data.quizzes;
        setQuizzes(quizzesData);
        
        // Fetch submission status for each quiz
        const submissionData = {};
        await Promise.all(
          quizzesData.map(async (quiz) => {
            try {
              const resultRes = await axios.get(`${process.env.REACT_APP_API_URL}/quizzes/${quiz._id}/myresult`);
              if (resultRes.data.score !== null) {
                submissionData[quiz._id] = {
                  score: resultRes.data.score,
                  totalQuestions: resultRes.data.totalQuestions,
                  submittedAt: resultRes.data.submittedAt
                };
              }
            } catch {
              // No submission found for this quiz
            }
          })
        );
        setSubmissions(submissionData);
      } catch {}
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-3">Welcome, {user?.name}</h1>
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">Available Quizzes</h2>
        {loading ? (
          <div>Loading...</div>
        ) : quizzes.length === 0 ? (
          <div className="text-gray-600">No quizzes open.</div>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 px-3">Title</th>
                <th>Description</th>
                <th>Questions</th>
                <th>Status</th>
                <th>Your Score</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map(q=>{
                const submission = submissions[q._id];
                const isSubmitted = !!submission;
                return (
                  <tr key={q._id} className="border-t hover:bg-gray-50">
                    <td className="py-2 px-3 font-medium">{q.title}</td>
                    <td className="text-gray-600">{q.description || '-'}</td>
                    <td>{q.questions?.length || 0} questions</td>
                    <td>
                      <span className={`rounded px-2 py-1 text-xs font-bold ${
                        q.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {q.status}
                      </span>
                    </td>
                    <td>
                      {isSubmitted ? (
                        <div>
                          <span className="font-bold text-indigo-700">{submission.score}</span>
                          {submission.totalQuestions && (
                            <span className="text-gray-500">/{submission.totalQuestions}</span>
                          )}
                          <div className="text-xs text-gray-500">
                            {Math.round((submission.score / (submission.totalQuestions || 1)) * 100)}%
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">Not taken</span>
                      )}
                    </td>
                    <td>
                      {isSubmitted ? (
                        <button 
                          className="inline-block px-3 py-1 bg-green-600 text-white rounded font-bold mr-2"
                          onClick={() => navigate(`/takequiz/${q._id}/result`)}
                        >View Result</button>
                      ) : (
                        <button 
                          className="inline-block px-3 py-1 bg-indigo-600 text-white rounded font-bold"
                          onClick={() => navigate(`/takequiz/${q._id}`)}
                        >Take Quiz</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
