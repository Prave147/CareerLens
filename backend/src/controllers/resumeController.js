const resumeService = require('../services/resume/resumeService');

const uploadResume = async (req, res, next) => {
  try {
    const candidateId = req.user?.id || req.user?._id;
    if (!candidateId) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No resume file uploaded. Please select a valid PDF file.',
      });
    }

    // Validate MIME type & extension
    const isPdf =
      req.file.mimetype === 'application/pdf' ||
      req.file.originalname.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file format. Only PDF documents are currently supported for structured intelligence extraction.',
      });
    }

    const fileInfo = {
      originalFileName: req.file.originalname,
      fileType: req.file.mimetype || 'application/pdf',
      fileSize: req.file.size || req.file.buffer.length,
    };

    const result = await resumeService.processResumeUpload(
      candidateId,
      req.file.buffer,
      fileInfo
    );

    res.status(200).json(result);
  } catch (error) {
    console.error('[ResumeController] Upload error:', error.message);
    res.status(500).json({
      success: false,
      error: 'RESUME_ANALYSIS_FAILED',
      message: error.message || 'An error occurred while processing the resume with Gemini.',
    });
  }
};

const getLatestAnalysis = async (req, res, next) => {
  try {
    const candidateId = req.user?.id || req.user?._id;
    if (!candidateId) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const analysis = await resumeService.getLatestAnalysis(candidateId);

    res.json({
      success: true,
      analysis: analysis || null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadResume,
  getLatestAnalysis,
};
