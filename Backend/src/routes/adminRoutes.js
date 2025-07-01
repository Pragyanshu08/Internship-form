// routes/adminRoutes.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const msal = require('@azure/msal-node');
const AdminAuth = require(path.join(__dirname, '..', '..', 'middlewares', 'AdminAuth'));
const ResumeForm = require(path.join(__dirname, '..', '..', 'model', 'ResumeForm'));
const config = require(path.join(__dirname, '..', '..', 'config', 'azureConfig'));
const cca = new msal.ConfidentialClientApplication(config);

const SCOPES = ["user.read"];

// Render Admin Login Page  //!api/admin/login
router.get('/login', (req, res) => {
  res.render('admin-login');
});

// Initiate Microsoft OAuth //!api/admin/auth
router.get('/auth', async (req, res) => {
  try {
    const authCodeUrlParams = {
      scopes: SCOPES,
      redirectUri: process.env.REDIRECT_URI
    };
    const response = await cca.getAuthCodeUrl(authCodeUrlParams);
    res.redirect(response);
  } catch (err) {
    console.log('❌ Auth URL Error:', err);
    res.status(500).send("Error generating Azure login URL");
  }
});

// Handle Microsoft OAuth Redirect  //!api/admin/auth/redirect
router.get('/auth/redirect', async (req, res) => {
  try {
    const tokenRequest = {
      code: req.query.code,
      scopes: SCOPES,
      redirectUri: process.env.REDIRECT_URI
    };
    const response = await cca.acquireTokenByCode(tokenRequest);
    req.session.user = {
      name: response.account.name,
      email: response.account.username
    };
    res.redirect('/api/admin/login/dashboard');
  } catch (error) {
    console.log('❌ Token Acquisition Failed:', error);
    res.status(500).send("Authentication failed.");
  }
});

// Render Admin Dashboard  //!api/admin/login/dashboard   //add AdminAuth middleware
router.get('/login/dashboard',async (req, res) => {
  try {
    const students = await ResumeForm.find().sort({ createdAt: -1 });
    res.render('admin-dashboard', { students });
  } catch (err) {
    console.error('❌ Error fetching student data:', err);
    res.status(500).send('Error loading dashboard');
  }
});

//!add AdminAuth middleware

router.get('/login/uploads/:filename', (req, res) => {
  // console.log(path.join(__dirname, '..', '..', '..' ,'frontend' ,'uploads', req.params.filename));
  const filePath = path.join(__dirname, '..', '..', '..' ,'frontend' ,'uploads', req.params.filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('File not found');
  }
});

router.get('/login/student-details/:id', async (req, res) => {
  try {
    const student = await ResumeForm.findById(req.params.id);
    if (!student) {
      return res.status(404).send('Student not found');
    }
    res.render('student-details', { student });
  } catch (err) {
    console.error('❌ Error fetching student details:', err);
    res.status(500).send('Error loading student details');
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Session destruction error:", err);
      return res.status(500).send("Could not log out.");
    }
    res.redirect("https://login.microsoftonline.com/common/oauth2/v2.0/logout?post_logout_redirect_uri=http://localhost:3000/");
  });
});

module.exports = router;
