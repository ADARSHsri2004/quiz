import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await signup(name, email, password, role);
      navigate('/login');
    } catch (err) {
      setError('Signup failed');
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form className="bg-white p-6 rounded shadow-md w-80" onSubmit={handleSubmit}>
        <h2 className="mb-4 text-xl font-bold">Signup</h2>
        <input className="mb-2 w-full border px-2 py-1" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
        <input className="mb-2 w-full border px-2 py-1" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        <input className="mb-2 w-full border px-2 py-1" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
        <select className="mb-2 w-full border px-2 py-1" value={role} onChange={e => setRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
        </select>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <button className="bg-green-500 text-white py-2 w-full rounded" type="submit">Signup</button>
      </form>
    </div>
  );
}
export default Signup;
