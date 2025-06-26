const mongoose = require('mongoose');
const validator = require('validator');

const academicSchema = new mongoose.Schema({
  education: String,
  boardUniversity: String,
  schoolInstitute: String,
  passYear: String,
  percentage: String
}, { _id: false });

const projectSchema = new mongoose.Schema({
  project_name: String,
  desc: String,
  role: String,
  tech_uses: [String],
  project_link: String
}, { _id: false });

const resumeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: false,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is not valid');
      }
    }
  },
  phone: {
    type: String,
    required: true,
    validate(value) {
      return /^\d{10}$/.test(value);
    }
  },
  address: {
    type: String,
    required: true,
    trim: true
  },

  academicDetails: [academicSchema],

  domain: {
    type: String,
    enum: ['Web Development', 'App Development', 'UI/UX Design', 'Data Science', 'Cybersecurity']
  },
  skills: {
    type: [String],
    default: []
  },
  certifications: String,

  projects: [projectSchema],

  resumeFileName: String,
  portfolio: {
    type: String,
    trim: true,
    validate: {
      validator: v => !v || validator.isURL(v),
      message: 'Invalid portfolio URL'
    }
  },
  linkedin: {
    type: String,
    trim: true,
    validate: {
      validator: v => !v || validator.isURL(v),
      message: 'Invalid LinkedIn URL'
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('ResumeForm', resumeSchema);
