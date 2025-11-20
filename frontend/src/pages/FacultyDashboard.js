import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

function FacultyDashboard() {
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
      <h2 className="text-2xl mb-4 font-bold">My Quizzes</h2>
      <button className="bg-blue-500 text-white px-4 py-2 mb-4 rounded">Create New Quiz</button>
      <table className="w-full border rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map(q => (
            <tr key={q._id} className="border-t">
              <td className="p-2">{q.title}</td>
              <td>{q.description}</td>
              <td>{q.publishedStatus ? 'Published' : 'Draft'}</td>
              <td>
                <button className="bg-green-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                <button className="bg-red-500 text-white px-2 py-1 rounded mr-2">Delete</button>
                <button className="bg-yellow-400 text-black px-2 py-1 rounded mr-2">{q.publishedStatus ? 'Unpublish' : 'Publish'}</button>
                <button className="bg-indigo-500 text-white px-2 py-1 rounded">View Submissions</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default FacultyDashboard;
