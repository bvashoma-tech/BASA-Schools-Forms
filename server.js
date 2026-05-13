const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
let dbConnected = false;
const offlineDir = path.join(__dirname, 'offline_data');

function ensureOfflineDir() {
  if (!fs.existsSync(offlineDir)) {
    fs.mkdirSync(offlineDir, { recursive: true });
  }
}

function appendOfflineFile(filename, entry) {
  ensureOfflineDir();
  const fullPath = path.join(offlineDir, filename);
  let data = [];
  try {
    if (fs.existsSync(fullPath)) {
      const raw = fs.readFileSync(fullPath, 'utf8');
      data = raw ? JSON.parse(raw) : [];
    }
  } catch (err) {
    console.error('Could not read offline file:', err);
    data = [];
  }
  data.push(entry);
  fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf8');
}

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/basa-forms', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  dbConnected = true;
  console.log('MongoDB connected');
})
.catch(err => {
  dbConnected = false;
  console.error('MongoDB connection failed, using offline storage:', err.message || err);
});

// Schemas
const grade10SubjectSchema = new mongoose.Schema({
  firstName: String,
  surname: String,
  studentNumber: String,
  grade9Class: String,
  school: String,
  homeLanguage: String,
  firstAdditionalLanguage: String,
  mathematics: String,
  electiveGroup: String,
  electiveSubjects: [String],
  learnerSignature: String,
  learnerDate: Date,
  guardianSignature: String,
  guardianDate: Date,
  submittedAt: { type: Date, default: Date.now }
});

const attendanceSchema = new mongoose.Schema({
  eventType: String,
  eventDate: String,
  campus: String,
  title: String,
  firstName: String,
  surname: String,
  mobile: String,
  email: String,
  learners: [{ name: String, grade: String }],
  submittedAt: { type: Date, default: Date.now }
});

const Grade10Form = mongoose.model('Grade10Form', grade10SubjectSchema);
const Attendance = mongoose.model('Attendance', attendanceSchema);

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.post('/api/submit-grade10', async (req, res) => {
  try {
    if (dbConnected) {
      const formData = new Grade10Form(req.body);
      await formData.save();
      return res.json({ success: true, message: 'Form submitted successfully' });
    }

    appendOfflineFile('grade10_offline.json', { ...req.body, submittedAt: new Date().toISOString() });
    return res.json({ success: true, message: 'Form saved locally (offline mode)' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/submit-attendance', async (req, res) => {
  try {
    if (dbConnected) {
      const attendanceData = new Attendance(req.body);
      await attendanceData.save();
      return res.json({ success: true, message: 'Attendance recorded successfully' });
    }

    appendOfflineFile('attendance_offline.json', { ...req.body, submittedAt: new Date().toISOString() });
    return res.json({ success: true, message: 'Attendance saved locally (offline mode)' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin routes (for viewing submitted data)
app.get('/api/admin/forms', async (req, res) => {
  try {
    if (dbConnected) {
      const forms = await Grade10Form.find().sort({ submittedAt: -1 });
      return res.json(forms);
    }
    const filePath = path.join(offlineDir, 'grade10_offline.json');
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8');
      return res.json(JSON.parse(raw || '[]'));
    }
    return res.json([]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/admin/attendance', async (req, res) => {
  try {
    if (dbConnected) {
      const attendance = await Attendance.find().sort({ submittedAt: -1 });
      return res.json(attendance);
    }
    const filePath = path.join(offlineDir, 'attendance_offline.json');
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8');
      return res.json(JSON.parse(raw || '[]'));
    }
    return res.json([]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});