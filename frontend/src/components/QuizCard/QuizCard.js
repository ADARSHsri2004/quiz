import React from 'react';

export default function QuizCard({ quiz, onClick }) {
  return (
    <div className="rounded-lg shadow bg-white p-6 cursor-pointer hover:shadow-lg transition"
      onClick={onClick}>
      <div className="flex justify-between mb-2">
        <h3 className="font-bold text-lg text-indigo-600">{quiz.title}</h3>
        <span className={`text-xs font-bold rounded
            ${quiz.status === 'published' ? "text-green-700 bg-green-100" : "text-yellow-700 bg-yellow-100"} px-2 py-1`}>
          {quiz.status}
        </span>
      </div>
      <p className="text-gray-500">{quiz.description}</p>
      <div className="text-sm mt-3 text-gray-700">{quiz.questions.length} questions</div>
    </div>
  );
}
