import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import axios from 'axios';

export default function FacultyDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuizzes() {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/quizzes/list`);
        setQuizzes(res.data.quizzes);
      } catch {}
      setLoading(false);
    }
    fetchQuizzes();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-3">Welcome, {user?.name}</h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3 mb-8">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-3xl font-bold text-indigo-700">{quizzes.length}</span>
          <span className="text-gray-500">Your Quizzes</span>
        </div>
        {/* Add analytics cards for score/analytics/etc */}
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">Manage Quizzes</h2>
        {loading ? (
            <div>Loading...</div>
          ) : quizzes.length === 0 ? (
            <div className="text-gray-600">No quizzes yet.</div>
          ) : (
            <table className="w-full table-auto">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 px-3">Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Questions</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map(q=>(
                  <tr key={q._id} className="border-t hover:bg-gray-50">
                    <td className="py-2 px-3">{q.title}</td>
                    <td>{q.description}</td>
                    <td>
                      <span className={`rounded px-2 py-1 text-xs font-bold 
                        ${q.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {q.status}
                      </span>
                    </td>
                    <td>{q.questions?.length || 0}</td>
                    <td>
                      <button 
                        className="inline-block px-3 py-1 bg-purple-50 rounded text-purple-700 font-bold mr-2"
                        onClick={() => navigate(`/faculty/quizzes/${q._id}`)}
                      >View</button>
                      <button 
                        className="inline-block px-3 py-1 bg-indigo-50 rounded text-indigo-700 font-bold mr-2"
                        onClick={() => navigate(`/faculty/quizzes/${q._id}/edit`)}
                      >Edit</button>
                      <button 
                        className="inline-block px-3 py-1 bg-red-50 rounded text-red-600 font-bold mr-2"
                        onClick={async () => {
                          if (!window.confirm('Are you sure you want to delete this quiz? This cannot be undone.')) return;
                          try {
                            await axios.delete(`${process.env.REACT_APP_API_URL}/quizzes/${q._id}/delete`);
                            setQuizzes(quizzes => quizzes.filter(z => z._id !== q._id));
                          } catch {
                            alert('Failed to delete quiz.');
                          }
                        }}
                      >Delete</button>
                      <button 
                        className={`inline-block px-3 py-1 ${q.status === 'published' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'} rounded font-bold mr-2`}
                        onClick={async () => {
                          try {
                            await axios.patch(`${process.env.REACT_APP_API_URL}/quizzes/${q._id}/publish`);
                            setQuizzes(quizzes => quizzes.map(z => z._id === q._id ? { ...z, status: z.status === 'published' ? 'draft' : 'published'} : z));
                          } catch {
                            alert('Failed to change publish status.');
                          }
                        }}
                      >
                        {q.status === 'published' ? 'Unpublish' : 'Publish'}
                      </button>  
                      <button
                        className="inline-block px-3 py-1 bg-blue-100 text-blue-700 font-bold rounded"
                        onClick={() => navigate(`/faculty/quizzes/${q._id}/analytics`)}
                      >Analytics</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        )}
      </div>
    </div>
  );
}
