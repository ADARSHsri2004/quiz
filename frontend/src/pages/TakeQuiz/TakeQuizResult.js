import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function TakeQuizResult() {
  const { id } = useParams();
  const location = useLocation();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchResult() {
      setLoading(true);
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/quizzes/${id}/myresult`);
        if (data.score === null) {
          setError('No submission found for this quiz.');
          setLoading(false);
          return;
        }
        // If we have score from navigation state, use it but still fetch full details
        if (location.state?.score && !data.questions) {
          // If backend doesn't return questions yet, use what we have
          setResult({
            score: location.state.score,
            totalQuestions: data.totalQuestions || location.state.totalQuestions
          });
        } else {
          setResult(data);
        }
      } catch (e) {
        setError(e?.response?.data?.message || 'Could not load result!');
      }
      setLoading(false);
    }
    fetchResult();
  }, [id, location.state]);

  if (loading) return <div className="text-blue-600 font-bold bg-blue-50 p-4 rounded">Loading...</div>;
  if (error) return <div className="text-red-600 bg-red-100 p-4 rounded font-bold">{error}</div>;
  if (!result) return null;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="bg-white rounded-xl shadow p-8 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-center">{result.quizTitle || 'Quiz Result'}</h2>
        <div className="text-center mb-6">
          <div className="mb-3">
            <span className="text-5xl font-bold text-indigo-700">{result.score}</span>
            {result.totalQuestions && <span className="text-2xl text-gray-500">/{result.totalQuestions}</span>}
            <div className="text-lg mt-2 text-gray-700">Your score</div>
            {result.totalQuestions && (
              <div className="text-sm text-gray-500 mt-1">
                {Math.round((result.score / result.totalQuestions) * 100)}% correct
              </div>
            )}
          </div>
        </div>

        {result.questions && result.questions.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Question Review</h3>
            <div className="space-y-6">
              {result.questions.map((q, idx) => (
                <div key={idx} className={`border-l-4 p-4 rounded ${q.isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                  <div className="font-bold text-lg mb-2">
                    {idx + 1}. {q.questionText}
                  </div>
                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isCorrect = optIdx === q.correctAnswer;
                      const isStudentAnswer = optIdx === q.studentAnswer;
                      let bgColor = 'bg-white';
                      let borderColor = 'border-gray-200';
                      let textColor = 'text-gray-700';
                      
                      if (isCorrect) {
                        bgColor = 'bg-green-100';
                        borderColor = 'border-green-500';
                        textColor = 'text-green-800';
                      }
                      if (isStudentAnswer && !isCorrect) {
                        bgColor = 'bg-red-100';
                        borderColor = 'border-red-500';
                        textColor = 'text-red-800';
                      }
                      
                      return (
                        <div key={optIdx} className={`p-3 rounded border-2 ${bgColor} ${borderColor} ${textColor}`}>
                          <div className="flex items-center justify-between">
                            <span>{opt}</span>
                            <div className="flex gap-2">
                              {isCorrect && <span className="text-xs font-bold bg-green-600 text-white px-2 py-1 rounded">Correct</span>}
                              {isStudentAnswer && !isCorrect && <span className="text-xs font-bold bg-red-600 text-white px-2 py-1 rounded">Your Answer</span>}
                              {isStudentAnswer && isCorrect && <span className="text-xs font-bold bg-blue-600 text-white px-2 py-1 rounded">Your Answer ✓</span>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="text-center">
        <button onClick={() => navigate('/student')} className="px-6 py-2 bg-indigo-600 rounded text-white font-bold hover:bg-indigo-700 transition">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
