const mongoose = require('mongoose');
const validator = require('validator');

const resumeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
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

  board10: String,
  school10: String,
  passYear10: String,
  percentage10: String,

  board12: String,
  school12: String,
  passYear12: String,
  percentage12: String,

  institute: String,
  university: String,
  degree: String,
  branch: String,
  passYearGrad: String,
  cgpa: {
    type: Number,
    min: 0,
    max: 10
  },

  domain: String,
  skills: [String],
  certifications: String,

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
  },

  resumeFileName: String
}, { timestamps: true });

module.exports = mongoose.model('ResumeForm', resumeSchema);
