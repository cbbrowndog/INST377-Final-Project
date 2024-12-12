# Pop Spot

## Contributors: 

  Jaida Ries, Luis Martinez, Jake Fine, Fahima Chariwala


## Description: 

  Pop Spot is designed to allow users in the United States to discover eventsand recreational activities near them. Using the Ticketmaster API and a Recreational Database API, Pop Spot provides a seamless experience for users to explore concerts, festivals, sporting events, and outdoor activities happening in their area.


## Target Browsers:

  -iOS: Safari, Chrome
  
  -Android and Desktop: Chrome, Firefox
  

# Developer Manual:

  The following documentation is intended for developers who will maintain and enhance the Pop Spot system. 

1. Clone the Repository 

2. Install Dependencies

   -ensure you have node.js installed, then run:

   npm install

3. Set Up API Keys
   
   -Get API keys for the Ticketmaster API and Recreational Database API
   -Create a .env file in the project root and add:
   
   TICKETMASTER_API_KEY=your_ticketmaster_api_key
   RECREATION_API_KEY= your_recreation_api_key

4. Run the Application

     npm start

## API Documentation

In this project, we used two main APIs:

  1. [Ticketmaster API](https://developer.ticketmaster.com/products-and-docs/apis/getting-started/)

  2. [Recreational Information Database API (RIDB](https://ridb.recreation.gov/docs)

### Usage Examples:

```javascript
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
// (add some documentation here)
```

Maybe add roadmap / additional user manual info?
