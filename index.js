const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const app = express();
const port = 3000;

// Supabase client setup
const supabase = createClient('your-supabase-url', 'your-supabase-api-key');

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to create a newsletter entry
app.post('/newsletter', async (req, res) => {
  const { firstName, lastName, email, city, state, interests } = req.body;

  // Insert data into the "new_newsletter" table
  const { data, error } = await supabase
    .from('new_newsletter') // Use the correct table name
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

// Serve the static success page
app.get('/success', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'newsletterSuccessPage.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
