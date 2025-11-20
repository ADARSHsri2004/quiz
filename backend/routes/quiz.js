const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middleware/auth');
const quizController = require('../controllers/quizController');

// Faculty routes
router.post('/create', authenticate, requireRole('faculty'), quizController.createQuiz);
router.put('/:id/update', authenticate, requireRole('faculty'), quizController.updateQuiz);
router.delete('/:id/delete', authenticate, requireRole('faculty'), quizController.deleteQuiz);
router.patch('/:id/publish', authenticate, requireRole('faculty'), quizController.publishQuiz);

// List (role-protected logic inside controller)
router.get('/list', authenticate, quizController.listQuizzes);

// Student
router.get('/:id/take', authenticate, requireRole('student'), quizController.takeQuiz);
router.post('/:id/submit', authenticate, requireRole('student'), quizController.submitQuiz);

// Faculty only - get all submissions
router.get('/:id/submissions', authenticate, requireRole('faculty'), quizController.getSubmissions);

// Analysis (faculty or student)
router.get('/:id/analysis', authenticate, quizController.getQuizAnalysis);

// Student: Get own result
router.get('/:id/myresult', authenticate, requireRole('student'), quizController.getMyResult);

module.exports = router;
