import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ViewQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchQuiz() {
      setLoading(true);
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/quizzes/list`);
        const foundQuiz = data.quizzes.find(q => q._id === id);
        if (foundQuiz) {
          setQuiz(foundQuiz);
        } else {
          setError('Quiz not found');
        }
      } catch {
        setError('Failed to load quiz');
      }
      setLoading(false);
    }
    fetchQuiz();
  }, [id]);

  if (loading) return <div className="text-blue-600 font-bold bg-blue-50 p-4 rounded">Loading...</div>;
  if (error) return <div className="text-red-600 bg-red-100 p-4 rounded font-bold">{error}</div>;
  if (!quiz) return null;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="bg-white rounded-xl shadow p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-indigo-700">{quiz.title}</h1>
            <p className="text-gray-600 mt-1">{quiz.description || 'No description'}</p>
          </div>
          <div className="text-right">
            <div className={`inline-block px-3 py-1 rounded text-xs font-bold ${
              quiz.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {quiz.status}
            </div>
            <div className="text-sm text-gray-500 mt-1">{quiz.questions?.length || 0} questions</div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Questions</h2>
          {quiz.questions && quiz.questions.length > 0 ? (
            <div className="space-y-6">
              {quiz.questions.map((q, idx) => (
                <div key={idx} className="border-l-4 border-indigo-500 bg-indigo-50 p-4 rounded">
                  <div className="font-bold text-lg mb-3">
                    {idx + 1}. {q.questionText}
                  </div>
                  <div className="space-y-2">
                    {q.options && q.options.map((opt, optIdx) => (
                      <div 
                        key={optIdx} 
                        className={`p-3 rounded border-2 ${
                          optIdx === q.correctAnswer 
                            ? 'bg-green-100 border-green-500 text-green-800 font-bold' 
                            : 'bg-white border-gray-200 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{opt}</span>
                          {optIdx === q.correctAnswer && (
                            <span className="text-xs font-bold bg-green-600 text-white px-2 py-1 rounded">
                              Correct Answer ✓
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 bg-yellow-50 p-4 rounded">No questions added yet.</div>
          )}
        </div>

        <div className="mt-6 flex gap-2">
          <button 
            onClick={() => navigate(`/faculty/quizzes/${id}/edit`)}
            className="px-4 py-2 bg-indigo-600 text-white rounded font-bold hover:bg-indigo-700"
          >
            Edit Quiz
          </button>
          <button 
            onClick={() => navigate('/faculty')}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded font-bold hover:bg-gray-400"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

