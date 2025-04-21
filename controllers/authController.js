const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports = {
  showSignup: (req, res) => res.render('auth/signup', { error: null }),

  signup: async (req, res) => {
    try {
      const { email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 12);
      
      const user = new User({ email, password: hashedPassword });
      await user.save();

      req.session.userId = user._id;
      res.redirect('/post-job');
    } catch (err) {
      res.render('auth/signup', { error: 'Signup failed. Please try again.' });
    }
  },

  showLogin: (req, res) => res.render('auth/login', { error: null }),

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.render('auth/login', { error: 'Invalid credentials' });
      }

      req.session.userId = user._id;
      res.redirect('/post-job');
    } catch (err) {
      res.render('auth/login', { error: 'Login failed. Please try again.' });
    }
  },

  logout: (req, res) => {
    req.session.destroy(() => res.redirect('/auth/login'));
  }
};