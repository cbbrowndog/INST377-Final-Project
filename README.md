# Pop Spot

## Contributors:
- Jaida Ries
- Luis Martinez
- Jake Fine
- Fahima Chariwala

## Vercel Link [here](inst-377-final-project-testing-deploy.vercel.app)

## Description:
**Pop Spot** is a web application designed to help users in the United States discover events and recreational activities in their area. By leveraging the **Ticketmaster API** for event data and the **Recreational Database API** (RIDB) for outdoor activity information, **Pop Spot** enables users to explore concerts, festivals, sporting events, and outdoor activities happening nearby. This web application also allows users to subscribe to newsletters with their event and recreational preferences.

## Target Browsers:
- **iOS**: Safari, Chrome
- **Android**: Chrome, Firefox
- **Desktop**: Chrome, Firefox, Safari, Edge

## Developer Manual:
This documentation is for developers who are taking over the **Pop Spot** system. The goal is to provide clear, step-by-step instructions for setting up the application locally and understanding how the system works.

### 1. Clone the Repository

Clone the repository to your local machine using Git:

```bash
git clone https://github.com/yourusername/pop-spot.git
cd pop-spot
```

### 2. Install Dependencies

Ensure you have **Node.js** installed. If not, download it from [here](https://nodejs.org/). Then, install the necessary dependencies by running the following command:

```bash
npm install
```

### 3. Set Up API Keys

You need **API keys** for the external services (Ticketmaster and RIDB).

- **Ticketmaster API Key**: Obtain it from [Ticketmaster Developer Portal](https://developer.ticketmaster.com/products-and-docs/apis/getting-started/).
- **Recreational Database API Key**: Get it from [RIDB](https://ridb.recreation.gov/docs).

Once you have the API keys, create a `.env` file in the root of the project and add the following:

```env
TICKETMASTER_API_KEY=your_ticketmaster_api_key
RECREATION_API_KEY=your_recreation_api_key
```

### 4. Run the Application

After setting up everything, run the application locally using:

```bash
npm start
```

This will start a local development server (usually at `http://localhost:3000`) where you can view the application in your browser.

### 5. Running Tests (Optional)

If there are any tests available, you can run them using:

```bash
npm test
```

Ensure you have test files set up in your project before attempting to run this command.

---

## API Documentation

**Pop Spot** integrates with two external APIs to fetch event and recreation data.

### 1. **Ticketmaster API**
- **Base URL**: `https://app.ticketmaster.com/discovery/v2/events.json`
- **API Key**: Use the key stored in the `.env` file (`TICKETMASTER_API_KEY`).

#### Endpoint:
- **GET** `/events.json?countryCode=US&size=10&apikey={your_api_key}`

This endpoint returns a list of events based on the specified query parameters, such as country code and API key.

##### Example Usage:
```javascript
fetch(`https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&size=10&apikey=${process.env.TICKETMASTER_API_KEY}`)
    .then(response => response.json())
    .then(data => {
        const events = data._embedded.events;
        events.forEach(event => {
            const city = event._embedded.venues[0].city.name;
            const lat = event._embedded.venues[0].location.latitude;
            const lng = event._embedded.venues[0].location.longitude;
            // Add event markers to the map
            const marker = L.marker([lat, lng]).addTo(map);
            marker.bindPopup(`
                <strong>${event.name}</strong><br>
                ${city}<br>
                <a href="${event.url}" target="_blank">More Info</a>
            `);
        });
    })
    .catch(error => console.error('Error fetching events:', error));
```

### 2. **Recreational Information Database (RIDB) API**
- **Base URL**: `https://ridb.recreation.gov/api/v1/recareas`
- **API Key**: Use the key stored in the `.env` file (`RECREATION_API_KEY`).

#### Endpoint:
- **GET** `/recareas?query=USA&limit=10&offset=0&radius=10&apikey={your_api_key}`

This endpoint returns a list of recreational areas based on the query parameters.

##### Example Usage:
```javascript
fetch(`https://ridb.recreation.gov/api/v1/recareas?query=USA&limit=10&radius=10&apikey=${process.env.RECREATION_API_KEY}`)
    .then(response => response.json())
    .then(data => {
        const recAreas = data.RECDATA;
        recAreas.forEach(recArea => {
            const lat = recArea.RecAreaLatitude;
            const lng = recArea.RecAreaLongitude;
            const name = recArea.RecAreaName;
            const url = recArea.RecAreaURL || '#';
            // Add markers for recreation areas
            const marker = L.marker([lat, lng]).addTo(map);
            marker.bindPopup(`
                <strong>${name}</strong><br>
                <a href="${url}" target="_blank">More Info</a>
            `);
        });
    })
    .catch(error => console.error('Error fetching recreation areas:', error));
```

---

### Known Bugs:
- **API Rate Limits**: The Ticketmaster API has rate limits. If you exceed these, the app will stop fetching data.
- **No Events Found**: If no events are returned, make sure the query is valid or expand the search radius.
- **Recreational Area Data**: Some recreation areas may not have a URL available, resulting in empty links.

---

## Roadmap for Future Development:

1. **Additional Filters**: Add filters for event types (e.g., music, sports) and recreation areas (e.g., national parks, beaches).
2. **User Authentication**: Integrate with an authentication service (e.g., Firebase) for personalized event recommendations.
3. **Frontend Optimization**: Improve map rendering speed for a better user experience.
4. **Mobile Responsiveness**: Optimize the UI for mobile devices to improve usability.

---

## Additional Documentation:

- **Frontend**: Uses **Leaflet.js** for map rendering and **Chart.js** for data visualization.
- **Backend**: Node.js server with Express handling API requests and serving static files.

This README is designed to provide clear steps for setting up and contributing to **Pop Spot**. Feel free to modify or expand on it as the project evolves.
