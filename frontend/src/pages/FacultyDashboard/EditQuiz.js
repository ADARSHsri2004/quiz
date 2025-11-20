import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import QuestionForm from '../../components/QuestionForm/QuestionForm';
import Modal from '../../components/Modal/Modal';

export default function EditQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/quizzes/list`);
        const quiz = data.quizzes.find(q => q._id === id);
        if (quiz) {
          setTitle(quiz.title);
          setDescription(quiz.description || '');
          setQuestions(quiz.questions || []);
        } else {
          setError('Quiz not found');
        }
      } catch {
        setError('Failed to load quiz');
      } finally {
        setLoading(false);
      }
    }
    fetchQuiz();
  }, [id]);

  const addQuestion = (question) => {
    if (editingQuestionIndex !== null) {
      const updated = [...questions];
      updated[editingQuestionIndex] = question;
      setQuestions(updated);
      setEditingQuestionIndex(null);
    } else {
      setQuestions([...questions, question]);
    }
    setModalOpen(false);
  };

  const editQuestion = (index) => {
    setEditingQuestionIndex(index);
    setModalOpen(true);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const submitQuiz = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!title || questions.length === 0) return setError('Quiz needs a title and at least one question.');
    setSaving(true);
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/quizzes/${id}/update`, {
        title,
        description,
      });
      // Update questions one by one (or implement bulk update if backend supports it)
      // For now, we'll just update the quiz metadata
      setSuccess('Quiz updated!');
      setTimeout(() => navigate('/faculty'), 1500);
    } catch (e) {
      setError(e?.response?.data?.message || 'Could not update quiz');
    }
    setSaving(false);
  };

  if (loading) return <div className="text-blue-600 font-bold bg-blue-50 p-4 rounded">Loading...</div>;
  if (error && !title) return <div className="text-red-500 bg-red-50 p-4 rounded">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Quiz</h1>
      <form className="bg-white rounded-xl shadow p-6 flex flex-col gap-4" onSubmit={submitQuiz}>
        <div>
          <label className="block font-medium mb-1 text-gray-700">Title</label>
          <input value={title} onChange={e=>setTitle(e.target.value)} className="w-full px-4 py-2 border rounded-md"/>
        </div>
        <div>
          <label className="block font-medium mb-1 text-gray-700">Description</label>
          <textarea value={description} onChange={e=>setDescription(e.target.value)} className="w-full px-4 py-2 border rounded-md"/>
        </div>
        <div>
          <span className="block font-medium mb-2 text-gray-700">Questions</span>
          {questions.length === 0 && <div className="text-gray-500">No questions yet</div>}
          <ul className="mb-2 space-y-2">
            {questions.map((q,i)=>(
              <li key={i} className="p-3 bg-gray-50 rounded border mb-2">
                <div className="flex items-start justify-between mb-2">
                  <span className="font-medium">{i+1}. {q.questionText}</span>
                  <div>
                    <button type="button" onClick={()=>editQuestion(i)} className="text-indigo-600 mr-2 text-sm">Edit</button>
                    <button type="button" onClick={()=>removeQuestion(i)} className="text-red-600 text-sm">Remove</button>
                  </div>
                </div>
                <div className="ml-4 space-y-1">
                  {q.options && q.options.map((opt, optIdx) => (
                    <div key={optIdx} className={`text-sm ${optIdx === q.correctAnswer ? 'font-bold text-green-700 bg-green-100 px-2 py-1 rounded' : 'text-gray-600'}`}>
                      {optIdx + 1}. {opt} {optIdx === q.correctAnswer && '✓ (Correct)'}
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
          <button type="button" className="bg-indigo-600 text-white px-4 py-1 rounded shadow font-bold" onClick={()=>{setEditingQuestionIndex(null); setModalOpen(true);}}>Add Question</button>
        </div>
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-700">{success}</div>}
        <div className="flex gap-2">
          <button className="bg-green-600 hover:bg-green-700 text-white transition py-2 rounded-lg font-bold mt-2 flex-1" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
          <button type="button" onClick={() => navigate('/faculty')} className="bg-gray-300 hover:bg-gray-400 text-gray-800 transition py-2 rounded-lg font-bold mt-2 px-4">Cancel</button>
        </div>
      </form>
      <Modal open={modalOpen} onClose={()=>{setModalOpen(false); setEditingQuestionIndex(null);}}>
        <QuestionForm onSubmit={addQuestion} initialData={editingQuestionIndex !== null ? questions[editingQuestionIndex] : null} />
      </Modal>
    </div>
  );
}

