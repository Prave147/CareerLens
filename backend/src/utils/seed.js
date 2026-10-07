require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const College = require('../models/College');
const StudentProfile = require('../models/StudentProfile');
const PlacementProfile = require('../models/PlacementProfile');
const Evidence = require('../models/Evidence');
const SkillClaim = require('../models/SkillClaim');
const Project = require('../models/Project');
const CodingActivity = require('../models/CodingActivity');
const Analysis = require('../models/Analysis');

const seedDatabase = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careerlens';
    console.log('Connecting to MongoDB for seeding...');
    await mongoose.connect(uri);
    console.log('Connected to MongoDB!');

    // Clear existing
    await User.deleteMany({});
    await College.deleteMany({});
    await StudentProfile.deleteMany({});
    await PlacementProfile.deleteMany({});
    await Evidence.deleteMany({});
    await SkillClaim.deleteMany({});
    await Project.deleteMany({});
    await CodingActivity.deleteMany({});
    await Analysis.deleteMany({});

    // 1. Create Colleges
    const apexCollege = await College.create({
      name: 'Apex Institute of Technology',
      code: 'AIT-ENG-2026',
      officialEmail: 'placement@apex.edu',
      placementContact: 'Dr. Sarah Jenkins',
      location: 'Bengaluru, Karnataka',
      website: 'https://apex.edu',
    });

    const nationalCollege = await College.create({
      name: 'National Engineering College',
      code: 'NEC-TECH-2026',
      officialEmail: 'placement@nec.edu',
      placementContact: 'Prof. Ramesh Rao',
      location: 'Hyderabad, Telangana',
      website: 'https://nec.edu',
    });

    // 2. Create Placement Officer
    const salt = await bcrypt.genSalt(10);
    const placementPasswordHash = await bcrypt.hash('placement1234', salt);

    const placementUser = await User.create({
      name: 'Dr. Sarah Jenkins',
      email: 'placement@apex.edu',
      passwordHash: placementPasswordHash,
      role: 'PLACEMENT_ADMIN',
      collegeId: apexCollege._id,
      collegeName: apexCollege.name,
      isActive: true,
    });

    await PlacementProfile.create({
      user: placementUser._id,
      collegeId: apexCollege._id,
      officerName: 'Dr. Sarah Jenkins',
      officialEmail: 'placement@apex.edu',
      institutionName: 'Apex Institute of Technology',
      institutionCode: 'AIT-ENG-2026',
      department: 'Directorate of Corporate Relations & Placements',
      academicYear: '2025-2026',
    });

    // 3. Create Demo Student (Alex / Arjun Kumar)
    const studentPasswordHash = await bcrypt.hash('demo1234', salt);

    const studentUser = await User.create({
      name: 'Alex Kumar',
      email: 'alex.kumar@example.com',
      passwordHash: studentPasswordHash,
      role: 'STUDENT',
      collegeId: apexCollege._id,
      collegeName: apexCollege.name,
      isActive: true,
    });

    const studentProfile = await StudentProfile.create({
      user: studentUser._id,
      studentId: studentUser._id,
      collegeId: apexCollege._id,
      college: apexCollege.name,
      membershipStatus: 'ACCEPTED',
      degree: 'B.Tech',
      branch: 'Computer Science & Engineering',
      graduationYear: 2026,
      targetRole: 'Full Stack Developer',
      platformHandles: {
        github: 'alexkumar-dev',
        leetcode: 'alex_code',
        gfg: 'alex_k',
        codechef: 'alex_chef',
        linkedin: 'alex-kumar-engineer',
        portfolio: 'https://alexkumar.dev',
      },
      skills: [
        { name: 'React', level: 'Advanced', category: 'Frontend', verified: true, verificationStatus: 'STRONGLY_VERIFIED' },
        { name: 'Node.js', level: 'Advanced', category: 'Backend', verified: true, verificationStatus: 'STRONGLY_VERIFIED' },
        { name: 'MongoDB', level: 'Intermediate', category: 'Database', verified: true, verificationStatus: 'VERIFIED' },
        { name: 'JavaScript', level: 'Advanced', category: 'Language', verified: true, verificationStatus: 'STRONGLY_VERIFIED' },
        { name: 'DSA', level: 'Advanced', category: 'Core', verified: true, verificationStatus: 'STRONGLY_VERIFIED' },
        { name: 'Docker', level: 'Beginner', category: 'DevOps', verified: false, verificationStatus: 'UNVERIFIED' },
        { name: 'AWS', level: 'Beginner', category: 'Cloud', verified: false, verificationStatus: 'UNVERIFIED' },
      ],
      profileCompleteness: 87,
    });

    console.log('✅ CareerLens Database Seeded Successfully with Multi-Tenant Architecture!');
    console.log('Demo Student: alex.kumar@example.com / demo1234');
    console.log('Demo Placement Admin: placement@apex.edu / placement1234');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
