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


// // Initialize Supabase client
// const { createClient } = require('@supabase/supabase-js');
// const supabase = createClient('https://https://sihivoxdppaspanawrxx.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpaGl2b3hkcHBhc3BhbmF3cnh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4NTY1NjAsImV4cCI6MjA0OTQzMjU2MH0.W3cepaW-IDOw9P7-uKSqJvOPB66HS277w95oXEZSrY4');

// // Function to handle form submission
// async function handleFormSubmit(event) {
//     event.preventDefault(); // Prevent immediate redirection

//     const form = document.getElementById('newsletter-form');

//     // Gather form data
//     const firstName = form['first-name'].value.trim();
//     const lastName = form['last-name'].value.trim();
//     const email = form['email'].value.trim();
//     const city = form['city'].value.trim();
//     const state = form['state'].value;
//     const interests = Array.from(form.querySelectorAll('input[name="interests"]:checked'))
//                            .map(input => input.value)
//                            .join(', ');

//     // Insert data into Supabase
//     const { error } = await supabase.from('your_table_name').insert([
//         {
//             customer_email: email,
//             customer_first_name: firstName,
//             customer_last_name: lastName,
//             customer_city: city,
//             customer_state: state,
//             customer_interests: interests,
//         },
//     ]);

//     if (error) {
//         console.error('Error inserting data:', error);
//         alert('There was an error submitting your information. Please try again.');
//         return; // Stop the form submission
//     }

//     // Proceed with the form redirection to the success page
//     form.submit();
// }
