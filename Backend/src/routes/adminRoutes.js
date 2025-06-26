// routes/adminRoutes.js
const express = require('express');
const path = require('path');
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

// Render Admin Dashboard  //!api/admin/login/dashboard
router.get('/login/dashboard', AdminAuth, async (req, res) => {
  try {
    const students = await ResumeForm.find().sort({ createdAt: -1 });
    res.render('admin-dashboard', { students });
  } catch (err) {
    console.error('❌ Error fetching student data:', err);
    res.status(500).send('Error loading dashboard');
  }
});

module.exports = router;
