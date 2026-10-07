const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true,
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    enum: ['STUDENT_ACCEPTED', 'STUDENT_REJECTED', 'PROFILE_VIEWED', 'REPORT_GENERATED', 'INTERVENTION_CREATED', 'SETTINGS_UPDATED'],
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  targetStudentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  ipAddress: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
