import React, { useState, useEffect } from 'react';
export default function QuestionForm({ onSubmit, initialData }) {
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setQuestionText(initialData.questionText || '');
      setOptions(initialData.options || ['', '', '', '']);
      setCorrectAnswer(initialData.correctAnswer || 0);
    }
  }, [initialData]);

  const handleChange = (value, idx) => {
    const ops = [...options]; ops[idx] = value; setOptions(ops);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!questionText || options.some(o=>!o)) {
      setError('Fill question and all options');
      return;
    }
    onSubmit({questionText, options, correctAnswer: Number(correctAnswer)});
    if (!initialData) {
      setQuestionText(''); setOptions(['', '', '', '']); setCorrectAnswer(0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 flex flex-col gap-4 max-w-md mx-auto">
      <h2 className="text-lg font-bold mb-2">{initialData ? 'Edit Question' : 'Add Question'}</h2>
      <div>
        <label className="block font-medium mb-1">Question</label>
        <input value={questionText} onChange={e=>setQuestionText(e.target.value)} className="w-full px-3 py-2 border rounded"/>
      </div>
      <div>
        <label className="block font-medium mb-1">Options</label>
        {options.map((opt,i)=>(
          <input key={i} value={opt} onChange={e=>handleChange(e.target.value,i)}
            className="w-full my-1 px-3 py-2 border rounded" placeholder={`Option ${i+1}`}/>
        ))}
      </div>
      <div>
        <label className="block font-medium mb-1">Correct Answer</label>
        <select value={correctAnswer} onChange={e=>setCorrectAnswer(e.target.value)} className="w-full px-3 py-2 border rounded">
          {options.map((opt,i)=>(
            <option key={i} value={i}>{`Option ${i+1}`}</option>
          ))}
        </select>
      </div>
      {error && <div className="text-red-500">{error}</div>}
      <div className="flex gap-2 justify-end">
        <button type="submit" className="bg-green-600 text-white font-bold px-6 py-2 rounded">Save</button>
      </div>
    </form>
  );
}
