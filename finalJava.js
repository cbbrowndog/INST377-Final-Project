/* Load Map on Home Page */ 
function newMap(){
    //Center the US coordinates 
    var map = L.map('map').setView([37.0902, -95.7129], 4);

    //Code from the Library 
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
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

if (window.location.pathname.includes('newsletterSuccessPage.html')) {
    setTimeout(function () {
        window.location.href = "homePage.html";
    }, 5000);
}