import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

function StudentDashboard() {
  const { token } = useContext(AuthContext);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const res = await axios.get('/quizzes/list', {
        headers: { Authorization: 'Bearer ' + token },
      });
      setQuizzes(res.data);
    };
    fetchQuizzes();
  }, [token]);

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4 font-bold">Available Quizzes</h2>
      <table className="w-full border rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Title</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map(q => (
            <tr key={q._id} className="border-t">
              <td className="p-2">{q.title}</td>
              <td>{q.description}</td>
              <td>
                <button className="bg-blue-500 text-white px-4 py-1 rounded mr-2">Take Quiz</button>
                <button className="bg-green-500 text-white px-4 py-1 rounded mr-2">Results</button>
                <button className="bg-yellow-500 text-white px-4 py-1 rounded">Analysis</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default StudentDashboard;
