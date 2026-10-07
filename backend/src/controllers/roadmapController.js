const roadmapService = require('../services/roadmap/roadmapService');

let roadmapState = null;

const getRoadmap = async (req, res, next) => {
  try {
    if (!roadmapState) {
      roadmapState = await roadmapService.getStudentRoadmap(req.user.id || req.user._id);
    }

    res.json({
      success: true,
      roadmap: roadmapState,
    });
  } catch (error) {
    next(error);
  }
};

const toggleMilestone = async (req, res, next) => {
  try {
    const { weekNumber } = req.body;
    if (!roadmapState) {
      roadmapState = await roadmapService.getStudentRoadmap(req.user.id || req.user._id);
    }

    roadmapState.weeks = roadmapState.weeks.map(week => {
      if (week.weekNumber === Number(weekNumber)) {
        return { ...week, completed: !week.completed };
      }
      return week;
    });

    const completedCount = roadmapState.weeks.filter(w => w.completed).length;
    const gainedScore = completedCount * 3.5;
    roadmapState.currentReadiness = parseFloat((79.3 + gainedScore).toFixed(1));

    res.json({
      success: true,
      message: `Week ${weekNumber} milestone status updated.`,
      roadmap: roadmapState,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRoadmap,
  toggleMilestone,
};
