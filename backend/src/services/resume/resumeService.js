const resumeExtractor = require('./resumeExtractor');
const { normalizeResumeData } = require('./resumeNormalizer');
const resumeClaimService = require('./resumeClaimService');
const ResumeAnalysis = require('../../models/ResumeAnalysis');
const { getIsConnected } = require('../../config/database');

class ResumeService {
  /**
   * Complete pipeline: Extract PDF with Gemini -> Normalize -> Persist -> Return Analysis
   */
  async processResumeUpload(candidateId, fileBuffer, fileInfo) {
    if (!fileBuffer || fileBuffer.length === 0) {
      throw new Error('No resume file content provided.');
    }

    if (!getIsConnected()) {
      throw new Error('Database is currently unavailable. Please verify MongoDB connection.');
    }

    console.log(`[ResumeService] Starting resume intelligence extraction for candidate: ${candidateId}`);

    // 1. Extract structured data using Gemini Document Understanding
    const extractionResult = await resumeExtractor.extractFromPdf(fileBuffer, fileInfo.originalFileName);

    // 2. Validate and normalize extracted output
    const normalizedData = normalizeResumeData(extractionResult.raw);

    // 3. Persist intelligence, claims, and unverified evidence into MongoDB Atlas
    const { resumeAnalysis, summary } = await resumeClaimService.persistResumeIntelligence(
      candidateId,
      normalizedData,
      extractionResult.metadata,
      fileInfo
    );

    console.log(`[ResumeService] Successfully processed resume. Claims found: ${summary.claimsFound}, Skills: ${summary.skillsFound}`);

    return {
      success: true,
      message: 'Resume analyzed successfully',
      analysisId: resumeAnalysis._id,
      extractionStatus: 'COMPLETED',
      summary,
      analysis: resumeAnalysis,
    };
  }

  /**
   * Get latest resume analysis for a candidate
   */
  async getLatestAnalysis(candidateId) {
    if (!getIsConnected()) {
      return null;
    }
    return await ResumeAnalysis.findOne({ candidateId }).sort({ createdAt: -1 });
  }
}

module.exports = new ResumeService();
