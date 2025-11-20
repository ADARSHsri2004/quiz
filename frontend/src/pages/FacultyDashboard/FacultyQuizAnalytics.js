import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function FacultyQuizAnalytics() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const [analyticsRes, subsRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/quizzes/${id}/analysis`),
          axios.get(`${process.env.REACT_APP_API_URL}/quizzes/${id}/submissions`)
        ]);
        setData(analyticsRes.data);
        setSubs(subsRes.data.submissions ?? []);
      } catch {
        setErr('Error loading analytics.');
      }
      setLoading(false);
    }
    fetchStats();
  }, [id]);

  if (loading) return <div className="text-blue-600 font-bold bg-blue-50 p-4 rounded">Loading...</div>;
  if (err) return <div className="text-red-600 bg-red-100 p-4 rounded font-bold">{err}</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-2xl font-bold mb-2">Quiz Analytics</h2>
        {data && (
          <div className="mb-4 space-y-1">
            <div><b>Highest score:</b> {data.highest}</div>
            <div><b>Lowest score:</b> {data.lowest}</div>
            <div><b>Average:</b> {data.avg}</div>
            <div><b>Total submissions:</b> {data.total}</div>
            <div className="mt-4"><b>Question Breakdown:</b>
              <ol className="list-decimal pl-6 mt-1">
                {data.questionWise && data.questionWise.map((q, i) =>
                  <li key={i}>{q.questionText} — <span className="text-green-700 font-bold">{q.correctPercent}% correct</span></li>
                )}
              </ol>
            </div>
          </div>
        )}
      </div>
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-bold mb-2">Submissions</h3>
        {subs.length === 0 ? <div className="text-gray-600 bg-yellow-50 p-2 rounded">No submissions yet.</div> : (
          <table className="w-full mt-3 text-left border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Student</th>
                <th>Email</th>
                <th>Score</th>
                <th>Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {subs.map((s,i)=>(
                <tr key={i} className="border-t">
                  <td className="p-2">{s.studentId?.name || 'N/A'}</td>
                  <td>{s.studentId?.email || 'N/A'}</td>
                  <td>{s.score}</td>
                  <td>{new Date(s.submittedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="mt-6"><button onClick={()=>navigate('/faculty')} className="bg-indigo-600 text-white px-6 py-2 rounded">Back to Dashboard</button></div>
    </div>
  );
}
