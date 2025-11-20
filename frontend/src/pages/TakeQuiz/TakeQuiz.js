import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from '../../components/Modal/Modal';
import Timer from '../../components/Timer/Timer';

export default function TakeQuiz() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(()=>{
    async function fetchQuiz() {
      setLoading(true);
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/quizzes/${id}/take`);
        if (!data.questions || data.questions.length === 0) {
          setError('This quiz has no questions yet. Please contact the instructor.');
          setLoading(false);
          return;
        }
        setQuiz(data);
        setAnswers(Array(data.questions.length).fill(null));
      } catch (e) { 
        setError(e?.response?.data?.message || 'Quiz not found or unavailable'); 
      }
      setLoading(false);
    }
    fetchQuiz();
  },[id]);

  const handleChange = (qIdx, optIdx) => {
    const update = [...answers]; update[qIdx] = optIdx; setAnswers(update);
  };
  const handleSubmit = async () => {
    setSubmitting(true); setError('');
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/quizzes/${id}/submit`, {
        answers: answers.map((ans,i)=>({questionIndex:i, selectedOption:ans}))
      });
      setModalOpen(false);
      navigate(`/takequiz/${id}/result`, { state: { score: data.score } }); // Navigate with score
    } catch (e) { setError(e?.response?.data?.message || 'Could not submit quiz'); }
    setSubmitting(false);
  };
  if (loading) return <div className="text-blue-600 font-bold bg-blue-50 p-4 rounded">Loading...</div>;
  if (!quiz) return <div className="text-red-500 bg-red-50 p-4 rounded">{error || 'Quiz not available'}</div>;
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-2 text-indigo-700">{quiz.title}</h1>
      <p className="mb-6 text-gray-500">{quiz.description}</p>
      <div className="mb-4 flex items-center justify-between">
        <Timer totalSeconds={quiz.durationSeconds || 600} onEnd={()=>setModalOpen(true)} />
        <button disabled={answers.some(a=>a===null) || submitting} onClick={()=>setModalOpen(true)} className="bg-green-600 text-white px-4 py-2 rounded font-bold shadow">Submit Quiz</button>
      </div>
      <form className="flex flex-col gap-4">
        {quiz.questions && quiz.questions.length > 0 ? (
          quiz.questions.map((q, idx)=>(
            <div key={idx} className="border-b pb-4">
              <div className="font-bold text-lg mb-1">{idx+1}. {q.questionText}</div>
              <div className="flex flex-col gap-2">
                {q.options && q.options.length > 0 ? (
                  q.options.map((opt,i)=>(
                    <label key={i} className="flex items-center cursor-pointer gap-2">
                      <input type="radio" name={`q${idx}`} checked={answers[idx]===i} onChange={()=>handleChange(idx,i)} disabled={submitting} />
                      <span>{opt}</span>
                    </label>
                  ))
                ) : (
                  <div className="text-red-500 text-sm">No options available for this question</div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-red-500 bg-red-50 p-4 rounded">This quiz has no questions.</div>
        )}
      </form>
      <Modal open={modalOpen} onClose={()=>setModalOpen(false)}>
        <div className="text-center">
          <h2 className="font-bold text-xl mb-3">Submit Quiz?</h2>
          <div className="mb-6 text-gray-600">Are you sure you want to submit? This cannot be undone.</div>
          <button onClick={handleSubmit} className="bg-green-600 text-white font-bold px-6 py-2 rounded mr-2">Yes, Submit</button>
          <button onClick={()=>setModalOpen(false)} className="bg-gray-300 font-bold px-6 py-2 rounded">Cancel</button>
        </div>
      </Modal>
      {error && <div className="text-red-600 bg-red-100 mt-4 p-3 rounded shadow-lg font-bold border border-red-300">{error}</div>}
    </div>
  );
}
