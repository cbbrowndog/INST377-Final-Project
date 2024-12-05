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