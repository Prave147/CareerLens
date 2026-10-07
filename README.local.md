# CareerLens — Evidence-Based Employability & Career Readiness Intelligence

CareerLens is a specialized career intelligence and employability platform that bridges the gap between resume claims and verifiable code proof. It enforces multi-tenant institutional isolation for colleges and provides deterministic employability scoring, skill gap identification, roadmap generation, and batch placement intelligence.

---

## 🌟 Core Product Story
```
RESUME CLAIM ➔ VERIFIABLE PROOF ➔ CROSS-PLATFORM VERIFICATION ➔ READINESS SCORING ➔ GAP CLOSURE ➔ ROADMAP ACTION ➔ NEW PROOF
```

---

## 🚀 Quick Start Guide

### 1. Backend Setup
```bash
cd backend
npm install
```

Create `backend/.env` (copy from `backend/.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/careerlens?retryWrites=true&w=majority
JWT_SECRET=careerlens_super_secret_jwt_key_2026_production_ready
FRONTEND_URL=http://localhost:5173
CLIENT_URL=http://localhost:5173
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here
```

Start the Backend Server:
```bash
npm run dev
# or npm start
```

*(Optional)* Seed database with pre-configured colleges and demo candidate:
```bash
npm run seed
```

### 2. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🔑 Demo Access Credentials

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Demo Student** | `alex.kumar@example.com` | `demo1234` | Full Student Workspace |
| **Placement Officer** | `placement@apex.edu` | `placement1234` | Apex Institute of Technology Placement Portal |

---

## 🛠️ Key Architectural Implementations

1. **MongoDB Atlas Database Layer**:
   - Centralized connection management (`backend/src/config/database.js`) with explicit startup logging:
     - `MongoDB connecting...`
     - `MongoDB connected successfully`
     - `MongoDB connection failed`
   - Health check endpoint: `GET /api/health` returning `{ success: true, database: "connected" | "disconnected", ... }`.
   - Complete persistence models: `User`, `College`, `StudentProfile`, `PlacementProfile`, `Evidence`, `SkillClaim`, `Project`, `CodingActivity`, `Analysis`, `Roadmap`, `PlacementIntervention`, `AuditLog`.

2. **Multi-Tenant College Isolation**:
   - Placement officers are strictly locked to their registered institution via server-side session `collegeId`.
   - Only students with `membershipStatus: 'ACCEPTED'` contribute to institutional intelligence and cohort metrics.
   - Pending students start as `PENDING` until approved via the Placement Pending Approvals workflow.

3. **Evidence & Claim vs Proof Engine**:
   - Reconciles resume claims against GitHub repositories (detecting forks, original ownership, commits, and activity integrity).
   - LeetCode, GFG, and CodeChef algorithmic consistency tracker (historical vs recent consistency).
   - Missing proof does not immediately penalize: students can submit certificates, project URLs, and live links via the Evidence Matrix.
   - 6-pillar deterministic scoring (Technical Capability, Proof of Work, Project Strength, Activity Consistency, Role Fit, Evidence Confidence) with dynamic score improvement simulation (+4.5 pts Docker, +4.0 pts Jest, +3.5 pts AWS).

4. **Modular AI Provider Architecture**:
   - `AIProviderManager` supporting primary **Gemini** and secondary **Groq** with full deterministic rule-based fallback if offline.
   - Modular services for resume extraction, claim analysis, ownership reasoning, role matching, roadmap generation, and career advising.

5. **User Interface Aesthetics**:
   - Pure **Light Theme Only** with crisp typography, slate borders, emerald/amber verification badges, and responsive desktop/mobile layouts.
