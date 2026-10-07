const aiService = require('../ai/aiService');

class InterviewService {
  async getProjectQuestions(project = 'MediRoute') {
    return await aiService.generateInterviewQuestion(project);
  }

  async evaluateAnswer(questionId, question, userAnswer) {
    return await aiService.evaluateInterviewAnswer(question, userAnswer);
  }
}

module.exports = new InterviewService();
