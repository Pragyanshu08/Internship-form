// routes/formRoutes.js
const express = require('express');
const path = require('path');
const router = express.Router();
const upload = require(path.join(__dirname, '..', '..', 'middlewares', 'UploadResume'));
const { resumeFormValidation } = require(path.join(__dirname, '..', '..', 'utils', 'ZodValidation'));
const ResumeForm = require(path.join(__dirname, '..', '..', 'model', 'ResumeForm'));

// POST /api/submit      //!api/submit
router.post('/submit', upload.single('resume'), async (req, res) => {
  // 🔁 1. Parse skills
  if (typeof req.body.skills === 'string') {
    try {
      req.body.skills = JSON.parse(req.body.skills);
    } catch (e) {
      console.error('❌ Failed to parse skills:', e);
      req.body.skills = [];
    }
  }

  // 🔁 2. Parse academicDetails
  if (typeof req.body.academicDetails === 'string') {
    try {
      req.body.academicDetails = JSON.parse(req.body.academicDetails);
    } catch (e) {
      console.error('❌ Failed to parse academicDetails:', e);
      req.body.academicDetails = [];
    }
  }

  // 🔁 3. Parse projects
  if (typeof req.body.projects === 'string') {
    try {
      req.body.projects = JSON.parse(req.body.projects);
    } catch (e) {
      console.error('❌ Failed to parse projects:', e);
      req.body.projects = [];
    }
  }

  // 🔁 4. Parse domains
  if (typeof req.body.domains === 'string') {
   try {
    req.body.domains = JSON.parse(req.body.domains);
  } catch (e) {
    console.error('❌ Failed to parse domains:', e);
    req.body.domains = [];
    }
  }

  // 🔁 4. Parse experiences
if (typeof req.body.experiences === 'string') {
  try {
    req.body.experiences = JSON.parse(req.body.experiences);
  } catch (e) {
    console.error('❌ Failed to parse experiences:', e);
    req.body.experiences = [];
  }
}

   req.body.resumeFileName = req.file?.filename || '';

  // ✅ Now validate using Zod
  const result = resumeFormValidation.safeParse(req.body);
  if (!result.success) {
  console.log('❌ Validation Errors:', result.error.errors);
  return res.status(400).json({
    errors: result.error.errors.map(err => err.message) // ⬅️ extract messages
  });
}

  const data = result.data;

  const existingUser = await ResumeForm.findOne({ email: data.email });
  if (existingUser) {
    console.log('❌ Email already exists:', data.email);
    return res.status(400).json({
     errors: ["Email is already registered"]
   });
  }

  const resumeData = new ResumeForm({
    ...data,
    resumeFileName: req.file?.filename || null
  });

  try {
    await resumeData.save();
    console.log('📦 Data saved to MongoDB');
    res.status(200).send('Form submitted and saved!');
  } catch (err) {
    console.error('❌ MongoDB save error:', err);
    res.status(500).send('Error saving data');
  }
});


module.exports = router;
