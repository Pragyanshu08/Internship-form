const express = require('express');
const router = express.Router();
const path = require('path');
const ResumeForm = require(path.join(__dirname, '..', '..', 'model', 'ResumeForm'));

router.get('/student/:slug', async (req, res) => {
  try {
    const student = await ResumeForm.findOne({ slug: req.params.slug });
    if (!student) {
      return res.status(404).send('Student not found');
    }
    res.render('student-details', { student }); // same EJS view
  } catch (err) {
    console.error('❌ Error fetching student details (public):', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
