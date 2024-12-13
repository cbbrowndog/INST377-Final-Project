// Import express and supabase
const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const app = express();
const port = 3001;

// Supabase client setup

// Our api url followed by api key 
const supabase = createClient(
  'https://slwchhpkvxiwheloexph.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsd2NoaHBrdnhpd2hlbG9leHBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQxMDY5MTAsImV4cCI6MjA0OTY4MjkxMH0.X9VRqjyRx2O4uxdKuEtxVsMA_p2pCdajpTLMmlSdD7g'
  
);

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'homePage.html'));
});

// Newsletter signup page
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'newsletterSignupPage.html'));
});

// Newsletter success page
app.get('/success', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'newsletterSuccessPage.html'));
});

// Search page
app.get('/search', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'searchPage.html'));
});

// Chart page
app.get('/chart', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chartPage.html'));
});

// Serve the about page
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'aboutPage.html'));
});

// Endpoint to create a newsletter entry
app.post('/newsletter', async (req, res) => {
  const { firstName, lastName, email, city, state, interests } = req.body;

  // Insert data into the table
  const { data, error } = await supabase
    .from('newsletter_subscribers') 
    .insert([
      {
        first_name: firstName,
        last_name: lastName,
        email: email,
        city: city,
        state: state,
        interests: interests.join(', '), 
      }
    ]);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  // Redirect to the success page after successful form submission
  res.redirect('/success');
});

// Endpoint to get state data for chart visualization
app.get('/chart-data', async (req, res) => {
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .select('state');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data); // Send the data back as JSON
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
