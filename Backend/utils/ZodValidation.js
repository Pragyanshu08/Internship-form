const { z } = require('zod');

const resumeFormValidation = z.object({
  // Existing fields...
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().optional(),
  email: z.string().email('Invalid email'),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
  address: z.string().min(1),

  domain: z.enum(['Web Development', 'App Development', 'UI/UX Design', 'Data Science', 'Cybersecurity']),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  certifications: z.string().optional(),
  portfolio: z.string().url().optional(),
  linkedin: z.string().url().optional(),

  // ✅ Project (frontend sends an array of these)
  projects: z.array(z.object({
    project_name: z.string().min(1),
    desc: z.string().min(1),
    role: z.string().optional(),
    tech_uses: z.array(z.string()).optional(),
    project_link: z.string().url().optional()
  })),

  // ✅ Academic Details
  academicDetails: z.array(z.object({
    education: z.enum(['10th', '12th', 'Diploma', 'Graduation', 'Post-Graduation', 'Other']),
    boardUniversity: z.string(),
    schoolInstitute: z.string(),
    passYear: z.string().regex(/^\d{4}-\d{2}$/).optional(),
    percentage: z.string().or(z.number()).optional()
  })),

  // Optional file name
  resumeFileName: z.string().optional()
});

module.exports = { resumeFormValidation };
