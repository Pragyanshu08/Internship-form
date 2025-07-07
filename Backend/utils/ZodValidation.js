const { z } = require('zod');

const resumeFormValidation = z.object({
  firstName: z.string({
    required_error: 'First name is required',
    invalid_type_error: 'First name must be a string'
  }).min(2, 'First name is required'),

  lastName: z.string().optional(),

  email: z.string({
    required_error: 'Email is required',
    invalid_type_error: 'Email must be a valid string'
  }).email('Please enter a valid email address'),

  phone: z.string({
    required_error: 'Phone number is required',
    invalid_type_error: 'Phone number must be a string'
  }).regex(/^\d{10}$/, 'Phone number must be exactly 10 digits'),

  address: z.string({
    required_error: 'Address is required',
    invalid_type_error: 'Address must be a string'
  }).min(1, 'Address is required'),

  domains: z.array(z.string(), {
  required_error: 'Domains are required',
  invalid_type_error: 'Domains must be an array of strings'
  }).min(1, 'At least one domain is required'),

  skills: z.array(z.string(), {
    required_error: 'Skills are required',
    invalid_type_error: 'Skills must be an array of strings'
  }).min(1, 'At least one skill is required'),

 certifications: z
  .array(
    z.object({
      name: z.string().min(1, "Certification name is required"),
      link: z.string().url("Invalid URL").optional().or(z.literal(""))
    })
  )
  .optional()
,

  portfolio: z.string().url('Invalid portfolio URL').optional(),

  linkedin: z.string().url('Invalid LinkedIn URL').optional(),

  projects: z.array(z.object({
    project_name: z.string({
      required_error: 'Project name is required'
    }).min(1, 'Project name is required'),

    desc: z.string({
      required_error: 'Project description is required'
    }).min(1, 'Project description is required'),

    role: z.string().optional(),

    tech_uses: z.array(z.string()).optional(),

    project_link: z.string().url('Invalid project link').optional()
  })).min(1, 'At least one project is required'),

  academicDetails: z.array(z.object({
    education: z.enum([
      '10th', '12th', 'Diploma', 'Graduation', 'Post-Graduation', 'Other'
    ], {
      errorMap: () => ({ message: 'Select a valid education level' })
    }),

    boardUniversity: z.string({
      required_error: 'Board/University is required'
    }).min(1, 'Board/University is required'),

    schoolInstitute: z.string({
      required_error: 'School/Institute is required'
    }).min(1, 'School/Institute is required'),

    passYear: z.string()
      .regex(/^\d{4}-\d{2}$/, 'Passing year must be in YYYY-MM format')
      .optional(),

    percentage: z.union([
      z.string().min(1, 'Percentage/CGPA is required'),
      z.number()
    ]).optional()
  })).min(1, 'At least one academic entry is required'),

  experiences: z.array(z.object({
  company_name: z.string({
    required_error: 'Company name is required'
  }).min(1, 'Company name is required'),

  position: z.string({
    required_error: 'Position is required'
  }).min(1, 'Position is required'),

  duration: z.string({
    required_error: 'Duration is required'
  }).min(1, 'Duration is required')
})).optional() ,

  resumeFileName: z.string({
    required_error: 'Resume file is required'
  }).min(1, 'Resume file is required')
  
}).strict();

module.exports = { resumeFormValidation };
