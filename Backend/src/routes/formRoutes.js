// routes/formRoutes.js
const express = require('express');
const path = require('path');
const router = express.Router();
const upload = require(path.join(__dirname, '..', '..', 'middlewares', 'UploadResume'));
const { resumeFormValidation } = require(path.join(__dirname, '..', '..', 'utils', 'ZodValidation'));
const ResumeForm = require(path.join(__dirname, '..', '..', 'model', 'ResumeForm'));

// POST /api/submit      //!api/submit
router.post('/submit', upload.single('resume'), async (req, res) => {
  const result = resumeFormValidation.safeParse(req.body);

  if (!result.success) {
    console.log('❌ Validation Errors:', result.error.errors);
    return res.status(400).json({ errors: result.error.errors });
  }

  const data = result.data;
  const existingUser = await ResumeForm.findOne({ email: data.email });

  if (existingUser) {
    console.log('❌ Email already exists:', data.email);
    return res.status(400).send("<h1>Email is already registered. Please use a different email.</h1>");
  }

  const resumeData = new ResumeForm({
    ...data,
    skills: JSON.parse(data.skills),
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
