const express = require('express')
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express()
const port = 3000


//Middleware
app.use(bodyParser.urlencoded({ extended: true }));


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

// Serve static files from the 'frontend' directory
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/images', express.static(path.join(__dirname, '../images')));
app.use('/banner', express.static(path.join(__dirname, '../Banner')));



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'MainP.html'));
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
        .then(() => res.redirect('/contact.html?submitted=true'))
        
        .catch(err => {
            console.error('Error saving to database', err);
            res.sendStatus(500); // Internal Server Error
        });
})

app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})