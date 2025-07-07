const express = require('express');
const path = require('path');
const multer = require('multer');
const router = express.Router();
const upload = require(path.join(__dirname, '..', '..', 'middlewares', 'UploadResume'));
const { resumeFormValidation } = require(path.join(__dirname, '..', '..', 'utils', 'ZodValidation'));
const ResumeForm = require(path.join(__dirname, '..', '..', 'model', 'ResumeForm'));

// 👇 POST /api/submit
router.post('/submit', (req, res) => {
  // ✅ handle multer error gracefully
  upload.single('resume')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ errors: ['File size exceeds 2MB limit.'] });
      }
      return res.status(400).json({ errors: ['File upload error: ' + err.message] });
    } else if (err) {
      return res.status(500).json({ errors: ['Unexpected error during file upload.'] });
    }

    try {
      // 🔁 Parse incoming JSON strings
      ['skills', 'academicDetails', 'projects', 'domains', 'experiences', 'certifications'].forEach((field) => {
        if (typeof req.body[field] === 'string') {
          try {
            req.body[field] = JSON.parse(req.body[field]);
          } catch (e) {
            console.error(`❌ Failed to parse ${field}:`, e);
            req.body[field] = [];
          }
        }
      });

      req.body.resumeFileName = req.file?.filename || '';

      // ✅ Validate with Zod
      // ✅ Sanitize important fields before Zod validation
      if (typeof req.body.email === 'string') {
        req.body.email = req.body.email.trim().toLowerCase();
      }
      if (typeof req.body.firstName === 'string') {
        req.body.firstName = req.body.firstName.trim();
      }
      if (typeof req.body.lastName === 'string') {
        req.body.lastName = req.body.lastName.trim();
      }

      // ✅ Now validate with Zod
      const result = resumeFormValidation.safeParse(req.body);



      if (!result.success) {
        console.log('❌ Validation Errors:', result.error.errors);
        return res.status(400).json({
          errors: result.error.errors.map(err => err.message)
        });
      }

      const data = result.data;

      const existingUser = await ResumeForm.findOne({ email: data.email });
      if (existingUser) {
        console.log('❌ Email already exists:', data.email);
        return res.status(400).json({ errors: ['Email is already registered'] });
      }

      const resumeData = new ResumeForm({
        ...data,
        resumeFileName: req.file?.filename || null
      });

      await resumeData.save();
      console.log('📦 Data saved to MongoDB');
      res.status(200).send('Form submitted and saved!');
    } catch (error) {
      console.error('❌ Server error:', error);
      res.status(500).json({ errors: ['Something went wrong while submitting the form.'] });
    }
  });
});

module.exports = router;
