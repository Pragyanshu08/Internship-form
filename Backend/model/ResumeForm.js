const mongoose = require('mongoose');
const validator = require('validator');
const slugify = require('slugify');

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

const experienceSchema = new mongoose.Schema({
  company_name: String,
  position: String,
  duration: String
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

  domains: {
   type: [String],
   required: true,
   default: []
  },

  skills: {
   type: [String],
   required: true,
   default: []
  },

  certifications: [
  {
    name: {
      type: String,
      required: true
    },
    link: {
      type: String,
      validate: {
        validator: v => !v || validator.isURL(v),
        message: 'Invalid certification link'
      }
    }
  }
],


  projects: [projectSchema],

  experiences: {
  type: [experienceSchema],
  default: []
},

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
  } ,

   slug: {
    type: String,
    unique: true
  }

}, { timestamps: true ,  strict: true });




resumeSchema.pre('save', async function (next) {
  const toTitleCase = (str) =>
    str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  if (this.firstName) {
    this.firstName = toTitleCase(this.firstName.trim());
  }

  if (this.lastName) {
    this.lastName = toTitleCase(this.lastName.trim());
  }

  if (this.email) {
    this.email = this.email.toLowerCase().trim();
  }

  if (this.phone) {
    this.phone = this.phone.trim();
  }

  if (this.address) {
    this.address = this.address.trim();
  }

  if (this.portfolio) {
    this.portfolio = this.portfolio.trim();
  }

  if (this.linkedin) {
    this.linkedin = this.linkedin.trim();
  }

  if (Array.isArray(this.domains)) {
    this.domains = this.domains.map(d => d.trim());
  }

  if (Array.isArray(this.skills)) {
    this.skills = this.skills.map(s => s.trim());
  }

  if (Array.isArray(this.certifications)) {
    this.certifications = this.certifications.map(cert => ({
      name: cert.name.trim(),
      link: cert.link?.trim()
    }));
  }

  if (Array.isArray(this.academicDetails)) {
    this.academicDetails = this.academicDetails.map(detail => ({
      education: detail.education?.trim(),
      boardUniversity: detail.boardUniversity?.trim(),
      schoolInstitute: detail.schoolInstitute?.trim(),
      passYear: detail.passYear?.trim(),
      percentage: detail.percentage?.trim()
    }));
  }

  if (Array.isArray(this.projects)) {
    this.projects = this.projects.map(project => ({
      project_name: project.project_name?.trim(),
      desc: project.desc?.trim(),
      role: project.role?.trim(),
      tech_uses: project.tech_uses?.map(t => t.trim()),
      project_link: project.project_link?.trim()
    }));
  }

  if (Array.isArray(this.experiences)) {
    this.experiences = this.experiences.map(exp => ({
      company_name: exp.company_name?.trim(),
      position: exp.position?.trim(),
      duration: exp.duration?.trim()
    }));
  }

  // Generate unique slug if name is new or modified
  if (this.isModified('firstName') || this.isModified('lastName')) {
    const baseSlug = slugify(`${this.firstName} ${this.lastName}`, { lower: true });
    let uniqueSlug = baseSlug;
    let counter = 1;

    while (await mongoose.models.ResumeForm.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = uniqueSlug;
  }

  next();
});





module.exports = mongoose.model('ResumeForm', resumeSchema);
