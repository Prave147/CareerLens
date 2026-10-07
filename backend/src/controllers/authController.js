const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const College = require('../models/College');
const StudentProfile = require('../models/StudentProfile');
const PlacementProfile = require('../models/PlacementProfile');
const { getIsConnected, getCurrentDbName } = require('../config/database');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id ? user._id.toString() : user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      collegeId: user.collegeId ? user.collegeId.toString() : null,
      collegeName: user.collegeName || null,
    },
    process.env.JWT_SECRET || 'careerlens_super_secret_jwt_key_2026_production_ready',
    { expiresIn: '7d' }
  );
};

// ================= LIST REGISTERED COLLEGES =================
const getColleges = async (req, res, next) => {
  try {
    let colleges = [];
    if (getIsConnected()) {
      try {
        colleges = await College.find({ isActive: true }).select('name code officialEmail location website').sort({ name: 1 });
      } catch (err) {
        console.warn('Database college lookup warning:', err.message);
      }
    }

    // Default seeded colleges if DB is empty
    if (!colleges || colleges.length === 0) {
      colleges = [
        { _id: 'col_apex_1', name: 'Apex Institute of Technology', code: 'AIT-ENG-2026', location: 'Bengaluru, India', officialEmail: 'placement@apex.edu' },
        { _id: 'col_national_2', name: 'National Engineering College', code: 'NEC-TECH-2026', location: 'Hyderabad, India', officialEmail: 'placement@nec.edu' },
        { _id: 'col_city_3', name: 'City Institute of Science & Technology', code: 'CIST-UNI-2026', location: 'Pune, India', officialEmail: 'placement@cist.edu' },
      ];
    }

    res.json({
      success: true,
      colleges,
    });
  } catch (error) {
    next(error);
  }
};

// ================= STUDENT AUTH =================
const studentSignup = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, college, degree, branch, graduationYear } = req.body;

    if (!name || !email || !password || !college || !degree || !branch || !graduationYear) {
      return res.status(400).json({ success: false, message: 'All registration fields are required.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!getIsConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Unable to connect to the database. Please try again.',
      });
    }

    // Check duplicate email
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    // Find or link college
    let collegeDoc = await College.findOne({ name: college });
    if (!collegeDoc) {
      collegeDoc = await College.create({
        name: college,
        code: college.replace(/[^A-Za-z0-9]/g, '').substring(0, 8).toUpperCase() || 'COLLEGE',
        officialEmail: `placement@${college.toLowerCase().replace(/\s+/g, '')}.edu`,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Save User in MongoDB Atlas
    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: 'STUDENT',
      collegeId: collegeDoc._id,
      collegeName: collegeDoc.name,
      isActive: true,
    });

    // Save StudentProfile in MongoDB Atlas (with rollback if profile fails)
    try {
      await StudentProfile.create({
        user: newUser._id,
        studentId: newUser._id,
        collegeId: collegeDoc._id,
        college: collegeDoc.name,
        membershipStatus: 'PENDING',
        degree: degree.trim(),
        branch: branch.trim(),
        graduationYear: Number(graduationYear),
        targetRole: 'Full Stack Developer',
        profileCompleteness: 70,
      });
    } catch (profileErr) {
      // Rollback user creation
      await User.findByIdAndDelete(newUser._id);
      throw new Error(`Failed to initialize student profile: ${profileErr.message}`);
    }

    console.log('Student signup successful');
    console.log(`User ID: ${newUser._id}`);
    console.log(`Email: ${newUser.email}`);
    console.log(`Database: ${getCurrentDbName ? getCurrentDbName() : 'careerLens'}`);

    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: 'STUDENT',
        collegeName: collegeDoc.name,
        membershipStatus: 'PENDING',
      },
    });
  } catch (error) {
    next(error);
  }
};

const studentLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!getIsConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Unable to connect to the database. Please try again.',
      });
    }

    // Lookup real user in MongoDB careerLens.users
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (user.role !== 'STUDENT') {
      return res.status(403).json({
        success: false,
        message: 'This account is registered under Placement Cell. Please use the Placement Portal login.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'This account has been deactivated.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Fetch profile for membership status
    let membershipStatus = 'PENDING';
    const profile = await StudentProfile.findOne({ user: user._id });
    if (profile) {
      membershipStatus = profile.membershipStatus;
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        collegeId: user.collegeId,
        collegeName: user.collegeName,
        membershipStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ================= PLACEMENT AUTH =================
const placementSignup = async (req, res, next) => {
  try {
    const { officerName, officialEmail, password, confirmPassword, institutionName, institutionCode, location, website, placementContact } = req.body;

    if (!officerName || !officialEmail || !password || !institutionName || !institutionCode) {
      return res.status(400).json({ success: false, message: 'All required fields must be filled.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    const normalizedEmail = officialEmail.trim().toLowerCase();

    if (!getIsConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database is unavailable. Please check MongoDB Atlas connection.',
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account with this official email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    let collegeDoc = await College.findOne({
      $or: [{ code: institutionCode.toUpperCase().trim() }, { name: institutionName.trim() }]
    });

    if (!collegeDoc) {
      collegeDoc = await College.create({
        name: institutionName.trim(),
        code: institutionCode.toUpperCase().trim(),
        officialEmail: normalizedEmail,
        location: location || '',
        website: website || '',
        placementContact: placementContact || officerName.trim(),
      });
    }

    const newUser = await User.create({
      name: officerName.trim(),
      email: normalizedEmail,
      passwordHash,
      role: 'PLACEMENT_ADMIN',
      collegeId: collegeDoc._id,
      collegeName: collegeDoc.name,
      isActive: true,
    });

    await PlacementProfile.create({
      user: newUser._id,
      collegeId: collegeDoc._id,
      officerName: officerName.trim(),
      officialEmail: normalizedEmail,
      institutionName: collegeDoc.name,
      institutionCode: collegeDoc.code,
    });

    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'Placement Cell account and institution registered successfully.',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: 'PLACEMENT_ADMIN',
        collegeName: collegeDoc.name,
        institution: collegeDoc.name,
      },
    });
  } catch (error) {
    next(error);
  }
};

const placementLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Isolated Demo Placement bypass
    if (normalizedEmail === 'placement@apex.edu' && (password === 'placement1234' || password === 'demo1234')) {
      const demoPlacementUser = {
        _id: 'placement_demo_id',
        name: 'Dr. Sarah Jenkins',
        email: 'placement@apex.edu',
        role: 'PLACEMENT_ADMIN',
        institution: 'Apex Institute of Technology',
        collegeName: 'Apex Institute of Technology',
      };
      const token = generateToken(demoPlacementUser);
      return res.json({
        success: true,
        message: 'Welcome back to Placement Cell Intelligence.',
        token,
        user: demoPlacementUser,
      });
    }

    if (!getIsConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database is unavailable. Please check MongoDB connection.',
      });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid official credentials.' });
    }

    if (user.role !== 'PLACEMENT_ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'This account is a Student account. Please use the Student Portal login.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid official credentials.' });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Placement portal login successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        collegeId: user.collegeId,
        collegeName: user.collegeName,
        institution: user.collegeName,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ================= SESSION RESTORE / ME =================
const getMe = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthenticated.' });
    }

    let userDoc = null;
    let membershipStatus = 'PENDING';

    if (getIsConnected()) {
      try {
        userDoc = await User.findById(req.user.id || req.user._id).select('-passwordHash');
        if (userDoc?.role === 'STUDENT') {
          const profile = await StudentProfile.findOne({ user: userDoc._id });
          if (profile) membershipStatus = profile.membershipStatus;
        }
      } catch (err) {}
    }

    res.json({
      success: true,
      user: {
        id: userDoc ? userDoc._id : req.user.id,
        name: userDoc ? userDoc.name : req.user.name,
        email: userDoc ? userDoc.email : req.user.email,
        role: userDoc ? userDoc.role : req.user.role,
        collegeId: userDoc ? userDoc.collegeId : req.user.collegeId,
        collegeName: userDoc ? userDoc.collegeName : req.user.collegeName,
        membershipStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully.',
  });
};

module.exports = {
  getColleges,
  studentSignup,
  studentLogin,
  placementSignup,
  placementLogin,
  getMe,
  logout,
};
