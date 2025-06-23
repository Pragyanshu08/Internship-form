const multer = require('multer');
const path = require('path');

// Allowed extensions
const FILE_TYPES = ['.pdf', '.doc', '.docx'];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads')); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = function (req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (FILE_TYPES.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF/DOC/DOCX files are allowed!'), false);
  }
};

const uploadResume = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
});

module.exports = uploadResume;
