const express = require('express')
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const app = express()
const port = 3000


//Middleware
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());


// Set the public directory to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Set the views directory
app.set('views', path.join(__dirname, 'views'));
// Set EJS as templating engine
app.set('view engine', 'ejs');

// Routes
app.use('/', require('./routes/auth'));


// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/contactForm', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));




// Define a schema and model
const formSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
});


const Form = mongoose.model('Form', formSchema);




app.get('/', (req, res) => {
  // Check if user is logged in
  const user = req.session.user; // Assuming user information is stored in session

  // Render the homepage and pass the user object to the template
  res.render('Main', { user: user });
});

// Assuming this is the route handler for rendering pages
app.get('/:page', (req, res) => {
  const { page } = req.params;
  const user = req.session.user; // Assuming user information is stored in session
  
  // Check if the requested page exists
  const validPages = ['shop', 'about', 'blog', 'cart', 'contact', 'sproduct'];
  if (!validPages.includes(page)) {
      return res.status(404).send('Page not found');
  }
  
  // Render the requested page and pass the user object to the template
  res.render(page, { user: user });
});




app.post("/contact", (req,res)=>{
  const { name, email, subject, message } = req.body;

    // Log the form data to the console
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);

    // Create a new form entry
    const formData = new Form({
        name: name,
        email: email,
        subject: subject,
        message: message
    });

    // Save the form entry to the database
    formData.save()
        .then(() => res.redirect('/contact?submitted=true'))
        
        .catch(err => {
            console.error('Error saving to database', err);
            res.sendStatus(500); // Internal Server Error
        });
})

app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})