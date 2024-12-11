const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const app = express();
const port = 3001;

// Supabase client setup
const supabase = createClient(
  'https://sihivoxdppaspanawrxx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpaGl2b3hkcHBhc3BhbmF3cnh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4NTY1NjAsImV4cCI6MjA0OTQzMjU2MH0.W3cepaW-IDOw9P7-uKSqJvOPB66HS277w95oXEZSrY4'
);

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'homePage.html'));
});

// Serve the newsletter signup page
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'newsletterSignupPage.html'));
});

// Serve the newsletter success page
app.get('/success', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'newsletterSuccessPage.html'));
});

// Serve the search page
app.get('/search', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'searchPage.html'));
});

// Serve the help page
app.get('/help', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'helpPage.html'));
});

// Serve the about page
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'aboutPage.html'));
});

// Endpoint to create a newsletter entry
app.post('/newsletter', async (req, res) => {
  const { firstName, lastName, email, city, state, interests } = req.body;

  // Insert data into the "new_newsletter" table
  const { data, error } = await supabase
    .from('newsletter_subscribers') // Use the correct table name
    .insert([
      {
        first_name: firstName,
        last_name: lastName,
        email: email,
        city: city,
        state: state,
        interests: interests.join(', '), // Convert array to a string
      }
    ]);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  // Redirect to the success page after successful form submission
  res.redirect('/success');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
