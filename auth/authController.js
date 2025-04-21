const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports = {
  showSignup: (req, res) => {
    res.render('auth/signup', { error: null });
  },

  signup: async (req, res) => {
    try {
      const { email, phone, password } = req.body;
      
      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.render('auth/signup', { 
          error: 'Email already exists' 
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const user = new User({
        email,
        phone,
        password: hashedPassword
      });

      await user.save();

      // Set session
      req.session.userId = user._id;
      res.redirect('/post-job');

    } catch (err) {
      console.error('Signup error:', err);
      res.render('auth/signup', { 
        error: 'An error occurred during signup' 
      });
    }
  },

  showLogin: (req, res) => {
    res.render('auth/login', { error: null });
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.render('auth/login', {
          error: 'Invalid email or password'
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.render('auth/login', {
          error: 'Invalid email or password'
        });
      }

      req.session.userId = user._id;
      res.redirect('/');

    } catch (err) {
      console.error('Login error:', err);
      res.render('auth/login', {
        error: 'An error occurred during login'
      });
    }
  },

  logout: (req, res) => {
    req.session.destroy(err => {
      if (err) {
        console.error('Logout error:', err);
      }
      res.redirect('/auth/login');
    });
  }
};