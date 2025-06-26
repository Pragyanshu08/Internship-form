const { z } = require('zod');

const resumeFormValidation = z.object({
  // Personal
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().optional(),
  email: z.string().email('Invalid email'),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
  address: z.string().min(1),

  // Skills
  domain: z.enum(['Web Development', 'App Development', 'UI/UX Design', 'Data Science', 'Cybersecurity']),
 skills: z.array(z.string()).min(1, "At least one skill is required"),

  certifications: z.string().optional(),

  // Resume Upload
  portfolio: z.string().url().optional(),
  linkedin: z.string().url().optional(),

  // Dynamic Project Fields
  project_name: z.string().min(1),
  desc: z.string().min(1),
  role: z.string().optional(),
  tech_uses: z.union([z.string(), z.array(z.string())]).optional(),
  project_link: z.string().url(),

  // Dynamically named academic fields - we validate them manually or in route handler if needed
  // Example validation pattern:
  // education0: z.enum(['10th', '12th', 'Diploma', 'Graduation', 'Post-Graduation', 'Other']),
  // board-university0: z.string().min(1),
  // school-institute0: z.string().min(1),
  // passYear0: z.string().regex(/^\d{4}-\d{2}$/).optional(),
  // percentage0: z.string().or(z.number()).optional(),

  // You can loop through dynamic fields in your backend code to validate all such sections
});

module.exports = { resumeFormValidation };
