const requireStudent = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.',
    });
  }

  if (req.user.role !== 'STUDENT') {
    return res.status(403).json({
      success: false,
      message: 'Access forbidden: Student role required for this resource.',
    });
  }

  next();
};

const requirePlacementAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.',
    });
  }

  if (req.user.role !== 'PLACEMENT_ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Access forbidden: Placement Cell administrator role required for this resource.',
    });
  }

  next();
};

module.exports = {
  requireStudent,
  requirePlacementAdmin,
};
