const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Register Page
router.get('/register', (req, res) => res.render('register', { errors: [] }));

// Register Handle
router.post('/register', (req, res) => {
    const { username, password, password2 } = req.body;
    let errors = [];

    // Check required fields
    if (!username || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    // Check passwords match
    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    // Check password length
    if (password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters' });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            username,
            password,
            password2
        });
    } else {
        // Validation passed
        User.findOne({ username: username })
            .then(user => {
                if (user) {
                    // User exists
                    errors.push({ msg: 'Username is already registered' });
                    res.render('register', {
                        errors,
                        username,
                        password,
                        password2
                    });
                } else {
                    const newUser = new User({
                        username,
                        password
                    });

                    // Hash password
                    bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        // Set password to hashed
                        newUser.password = hash;
                        // Save user
                        newUser.save()
                            .then(user => {
                                req.flash('success_msg', 'You are now registered and can log in');
                                res.redirect('/login');
                            })
                            .catch(err => console.log(err));
                    }));
                }
            });
    }
});


// Login Page
router.get('/login', (req, res) => res.render('login'));

// Login Handle
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    User.findOne({ username: username })
        .then(user => {
            if (!user) {
                req.flash('error_msg', 'That username is not registered');
                return res.redirect('/login');
            }

            // Match password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    req.session.user = user;
                    return res.redirect('/'); // Redirect to main.html after login
                } else {
                    req.flash('error_msg', 'Password incorrect');
                    res.redirect('/login');
                }
            });
        });
});

// Dashboard Page
router.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        req.flash('error_msg', 'Please log in to view that resource');
        return res.redirect('/login');
    }
    res.render('dashboard', { user: req.session.user });
});

// Logout Handle
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.redirect('/'); // Redirect to main.html even if logout fails
        }
        res.clearCookie('connect.sid');
        res.redirect('/'); // Redirect to login page after logout
    });
});


module.exports = router;
