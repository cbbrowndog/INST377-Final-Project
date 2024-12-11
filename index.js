const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware for parsing JSON and serving static files
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

// Supabase client setup
const supabaseUrl = 'https://rqkwwyoaeswcmxqprmrl.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxa3d3eW9hZXN3Y214cXBybXJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE3OTQ3MzUsImV4cCI6MjA0NzM3MDczNX0.lFCNsUJeZjfkpjqGpt7JMwrRFTwehd-WK4feasXTwf8';
const supabase = createClient(supabaseUrl, supabaseKey);

// Serve HTML page for the home route
app.get('/', (req, res) => {
  res.sendFile('public/INST377-Week12-Customers.html', { root: __dirname });
});

// Fetch customers from Supabase database
app.get('/customers', async (req, res) => {
  console.log('Attempting to get all customers.');

  const { data, error } = await supabase.from('customer').select();

  if (error) {
    console.log('Error:', error);
    res.status(500).send(error);
  } else {
    console.log('Successfully Retrieved Data');
    res.json(data);
  }
});

// Add a new customer to the Supabase database
app.post('/customer', async (req, res) => {
  console.log('Attempting to add Customer.');
  console.log('Request', req.body);

  const { firstName, lastName } = req.body;

  const { data, error } = await supabase
    .from('customer')
    .insert({
      customer_first_name: firstName,
      customer_last_name: lastName,
    })
    .select();

  if (error) {
    console.log('Error:', error);
    res.status(500).send(error);
  } else {
    console.log('Successfully Added Customer');
    res.json(data);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
