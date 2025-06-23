const { z } = require('zod');

 const resumeFormValidation = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().regex(/^\d{10}$/, "Phone must be 10 digits"),
  address: z.string().min(1),

  board10: z.enum(['CBSE', 'ICSE', 'MP-Board', 'Other']),
  school10: z.string().min(1),
  passYear10: z.string().regex(/^\d{4}-\d{2}$/), // yyyy-mm
  percentage10: z.string().or(z.number()).refine(val => Number(val) >= 0, "Invalid %"),

  board12: z.enum(['CBSE', 'ICSE', 'MP-Board']),
  school12: z.string().min(1),
  passYear12: z.string().regex(/^\d{4}-\d{2}$/),
  percentage12: z.string().or(z.number()).refine(val => Number(val) >= 0, "Invalid %"),

  institute: z.string().min(1),
  university: z.string().min(1),
  degree: z.enum(['B.Tech', 'M.Tech', 'BCA', 'MCA', 'Other']),
  branch: z.enum(['CSE', 'ME', 'EE', 'CE']),
  passYearGrad: z.string().regex(/^\d{4}-\d{2}$/),
  cgpa: z.string().or(z.number()).refine(val => Number(val) >= 0 && Number(val) <= 10, "Invalid CGPA"),

  domain: z.enum(['Web Development', 'App Development', 'UI/UX Design', 'Data Science', 'Cybersecurity']),
  skills: z.string().refine((val) => {
    try {
      const arr = JSON.parse(val);
      return Array.isArray(arr);
    } catch {
      return false;
    }
  }, "Skills must be a valid JSON array"),
  
  certifications: z.string().optional(),
//   portfolio: z.string().url().optional(),
//   linkedin: z.string().url().optional()
});


module.exports = { resumeFormValidation };
