const interviewService = require('../services/interview/interviewService');

let sessionQuestions = null;

const getInterviewQuestions = async (req, res, next) => {
  try {
    if (!sessionQuestions) {
      sessionQuestions = await interviewService.getProjectQuestions('MediRoute');
    }

    res.json({
      success: true,
      projectFocus: 'MediRoute Telehealth & Expense Tracker Pro',
      sessionTitle: 'Project Architecture & Technical Defense Simulation',
      questions: sessionQuestions,
    });
  } catch (error) {
    next(error);
  }
};

const evaluateAnswer = async (req, res, next) => {
  try {
    const { questionId, question, userAnswer } = req.body;

    const evaluation = await interviewService.evaluateAnswer(questionId, question, userAnswer);

    res.json({
      success: true,
      questionId,
      evaluation,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInterviewQuestions,
  evaluateAnswer,
};
