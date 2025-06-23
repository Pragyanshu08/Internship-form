const express = require('express');
const router = express.Router();
const path = require('path');
const upload = require(path.join(__dirname , '..' , '..' ,'middlewares' , 'UploadResume'));
const {resumeFormValidation} = require(path.join(__dirname , '..' , '..' , 'utils' , 'ZodValidation')); 
const ResumeForm = require(path.join(__dirname , '..' , '..' , 'model' , 'ResumeForm'));
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AdminAuth = require(path.join(__dirname , '..' , '..' , 'middlewares' , 'AdminAuth'));

router.post('/submit', upload.single('resume'), async(req, res) => {
  const result = resumeFormValidation.safeParse(req.body);

  if (!result.success) {
    console.log(    '❌ Validation Errors:', result.error.errors);
    return res.status(400).json({ errors: result.error.errors });
  }

  console.log('✅ Validated Data:', result.data);
  console.log('📄 Uploaded file:', req.file);

   try {
    const data = result.data;

    const existingUser = await ResumeForm.findOne({ email:data.email });
    if (existingUser) {
         console.log('❌ Email already exists:', data.email);
         return res.status(400).send("<h1>Email is already registered. Please use a different email.<h1>");
    }

    const resumeData = new ResumeForm({
      ...data,
      skills: JSON.parse(data.skills), // convert string to array
      resumeFileName: req.file?.filename || null
    });

    

    await resumeData.save();

    console.log('📦 Data saved to MongoDB');
    res.status(200).send('Form submitted and saved!');
  } catch (err) {
    console.error('❌ MongoDB save error:', err);
    res.status(500).send('Error saving data');
  }
});

router.get('/admin/login' , (req, res) => {
    res.render("adminLogin");
})

const ADMIN = {
  username: 'admin',
  passwordHash: 'secret', // Store hashed password
};

router.post('/admin/login/dashboard' , async(req , res)=>{
    const {Adminusername, password} = req.body;

    if(Adminusername === 'admin' && password === ADMIN.passwordHash) {

    const token = jwt.sign(
    { username: 'admin', password: ADMIN.passwordHash },
    "JWT_SECRET",
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

     res.cookie('adminToken', token, {
      maxAge: 3600000, // 1 hour
     });


      res.redirect('/api/admin/login/dashboard');
    } else {
        res.status(401).send('Unauthorized');
    }
})

router.get('/admin/login/dashboard' , AdminAuth , async (req, res) =>{

  try {
    const students = await ResumeForm.find().sort({ createdAt: -1 });
    res.render('admin-dashboard', { students });
  } catch (err) {
    console.error('❌ Error fetching student data:', err);
    res.status(500).send('Error loading dashboard');
  }
})



module.exports = router;