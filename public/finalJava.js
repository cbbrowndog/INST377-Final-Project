/* Load Map on Home Page */ 
function newMap(){
    //Center the US coordinates 
    var map = L.map('map').setView([37.0902, -95.7129], 4);

    //Code from the Library 
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    fetchEvents(map);
    fetchRecreation(map);
}

/* Fetch Events from Ticketmaster API */ 
function fetchEvents(map) {
    const apiKey = "MJqQ6NUkUDHFon1F2xTypEX2NS7FGlGn"; //do we need to hide this later 
    const url = `https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&size=10&apikey=${apiKey}`;

    fetch(url)
        .then(response => {
            return response.json();
        })
        .then(data => {
            if(data._embedded && data._embedded.events) {
                const events = data._embedded.events;
                events.forEach(event => {
                    const city = event._embedded.venues[0].city.name;
                    const lat = event._embedded.venues[0].location.latitude;
                    const lng = event._embedded.venues[0].location.longitude;

                    //Add markers for each event 
                    const marker = L.marker([lat, lng]).addTo(map);
                    marker.bindPopup(`
                        <strong>${event.name}</strong><br>
                        ${city}<br>
                        <a href="${event.url}" target="_blank">More Info</a>
                    `);
                })
            }
        })
}

/* Fetch Recreation Areas from RIDB API */
function fetchRecreation(map) {
    const apiKey = "045a030e-f408-4f68-8979-07c5c0138831"; // Remember to hide this later
    const url = `https://ridb.recreation.gov/api/v1/recareas?query=USA&limit=10&offset=0&radius=10&lastupdated=10-01-2018&apikey=${apiKey}`;


    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('Recreation Areas Data:', data); // Log the response data
            if (data.RECDATA) {
                const recAreas = data.RECDATA;
                recAreas.forEach(recArea => {
                    const lat = recArea.RecAreaLatitude;
                    const lng = recArea.RecAreaLongitude;
                    const name = recArea.RecAreaName;
                    const url = recArea.RecAreaURL || '#';


                    console.log(`Recreation Area: ${name}, Latitude: ${lat}, Longitude: ${lng}`); // Log each recreation area


                    // Add markers for each recreation area
                    const marker = L.marker([lat, lng]).addTo(map);
                    marker.bindPopup(`
                        <strong>${name}</strong><br>
                        <a href="${url}" target="_blank">More Info</a>
                    `);
                });
            } else {
                console.warn('No recreation areas data found');
            }
        })
        .catch(error => {
            console.error('Error fetching recreation areas data:', error); // Log any errors
        });
}

/* Load header and footer on every page */
function loadContent() {
    // Load Header
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;
        })
    //Load Footer
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer').innerHTML = data;
        })
}

// Unified onload function
window.onload = function () {
    loadContent(); // Load header and footer on all pages

    // Only initialize the map on pages with the #map element
    if (document.getElementById('map')) {
        newMap();
    } 
};

// Timeout function for the Newsletter Success Page to redirect Home after 5 seconds 
if (window.location.pathname.includes('newsletterSuccessPage.html')) {
    setTimeout(function () {
        window.location.href = "homePage.html";
    }, 5000);
}

// Function to load Newsletter Form Data into the Supabase 

const host = window.location.origin;

async function handleFormSubmit(event) {
    event.preventDefault();  

    // Get form values
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
  
    // Get checked interests
    const interests = [];
    if (document.getElementById('music-events').checked) interests.push('music-events');
    if (document.getElementById('recreational-activities').checked) interests.push('recreational-activities');
    if (document.getElementById('sports').checked) interests.push('sports');
  
    // Send data to backend
    const response = await fetch(`${host}/newsletter`, {
      method: 'POST',
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        city,
        state,
        interests,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    // Handle the response
    if (response.ok) {
      console.log('Form submitted successfully');
      // Redirect to the success page
      setTimeout(() => {
        window.location.href = 'newsletterSuccessPage.html';
      }, 500);
    } else {
      console.error('Error submitting form:', response.statusText);
      alert('There was an error submitting your form. Please try again.');
    }
  }
  
  // Function to fetch state data for chart visualization
async function fetchChartData() {
    const response = await fetch(`${host}/chart-data`);
    if (response.ok) {
      const data = await response.json();
      console.log('Chart data received:', data);
      
      // Call the function to generate the chart with this data
      generateChart(data);
    } else {
      console.error('Error fetching chart data:', response.statusText);
    }
  }
  
  // Generate chart using chart.js
  function generateChart(data) {
    const states = data.map(item => item.state);
    const stateCounts = {};
  
    // Count the occurrences of each state
    states.forEach(state => {
      stateCounts[state] = (stateCounts[state] || 0) + 1;
    });
  
    const labels = Object.keys(stateCounts);
    const counts = Object.values(stateCounts);
  
    // Create bar chart
    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Number of Subscribers',
          data: counts,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          }
        }
      }
    });
  }
  
  // Call the fetchChartData function when the page is loaded
  fetchChartData();