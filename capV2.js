// HyperionDev Bootcamp - Capstone V Project

// City info & weather app

// Take city name input from user
// Return city population, elevation and current temp.
// Handle error (try/catch)

// API keys
// city & weather options setting - code snippet provided by api
// this sets API key via "options" object which is passed as arg in fetch calls.

  const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '70502f8931msh2d22c387419d4f6p1c3a5djsn5369f9892607'
	}
};

/* Code snippets taken from rapidapi docs - Used as reference for later functions

// cityinfo api fetch call - 

  fetch('https://wft-geo-db.p.rapidapi.com/v1/geo/adminDivisions', options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));

// weather API fetch call - with API key and (lon & lat) set

  fetch('https://weatherbit-v1-mashape.p.rapidapi.com/current?lon=38.5&lat=-78.5', options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));

*/

// Func to get city name from user - city()
const city = () => {
let city;
  while (true) {
    city = prompt('Please input a city name in South Africa');
    // Simple error check to validate input has value and isn't just a number
    if (isNaN(Number(city)) && city) break;
  }
  return (city);
}

// Func to send request to GeoDB Cities API
// Take input value and find city id via api call
// fetchUrl -> https://wft-geo-db.p.rapidapi.com/v1/geo/cities/ + id

const cityFind = async () => {
  // create string to pass as arg in fetch call - concat url with user input city variable

  let fetchUrl = 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities?limit=1&countryIds=Q258&namePrefix=' + city();

  // handle errors via try / catch 
  try {
    let response = await fetch(fetchUrl, options)
    // Verify that server response is in 200-299 range and therefore useable for continuing
      if (response.ok) {
        let data = await response.json()
        // verify if city found
        if (await data.data.length > 0) {
          return await data;
        }else{
          alert('City not found')
          return;
        }        
      }else{
        throw new Error('Bad response from server')
      }
  }
  catch (err) {
    console.error(err);
  }
}

// function to take cityId and get cityInfo. As previous func but different api call url

const cityInfo = async (id) => {
  let fetchUrl = 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities/' + id;

  try {
    let response = await fetch(fetchUrl, options);
    // Verify Server response okay
    if (response.ok) {
      let data = await response.json();
      return await data;
    }else{
      throw new Error('Bad response from server')
    }
  }
  // catch error for lost server contection
  catch (err) {
    console.log(`ERROR: ${err}`);
  }
}

// Weather api call using city long & lat values

const weatherInfo = async (long, lat) => {
  let url = 'https://weatherbit-v1-mashape.p.rapidapi.com/current?'
  let fetchUrl = url + "lon=" + long + "&lat=" + lat;

  try {
    let response = await fetch(fetchUrl, options);
    if (response.ok) {
      let data = await response.json();

      return await data.data[0];
    }else{
      throw new Error('Bad response from server')
    }
  }
  // catch for lost server connection
  catch (err) {
    console.log(`ERROR: ${err}`);
  }
}

// Test calls for each function (used during build)
// run();
// cityFind();
// cityInfo('131464');
// weatherInfo('28.188055555', '-25.746388888');


// Finally putting it all together in another async function that will run upon calling the script. Had to put in alerts to slow down the api calls as the server only allows one a second on free account. Could have used setInterval also for this to "slow" down the calls.

(async () => { 
  // run cityFind and get initial city details
  let cityResp = await cityFind();
  let cityId = await cityResp.data[0].id
  let long = await cityResp.data[0].longitude
  let lat = await cityResp.data[0].latitude
  // Pause delay one.
  alert("Click to continue - This is to slow down the api calls to stay within allowance per second");
  // now run weatherInfo using city long/lat
  let weatherResp = await weatherInfo(long, lat)
  let temp = await weatherResp.temp
  // Second pause delay.
  alert("Click to continue - This is to slow down the api calls to stay within allowance per second");
    // now run cityInfo for final elevation data needed.
  let idResp = await cityInfo(cityId)
  let cityEl = await idResp.data.elevationMeters

  // Put it all together for console output.
  console.log(`
  City: ${cityResp.data[0].city}
  Population: ${idResp.data.population}
  Elevation: ${cityEl} 
  Long: ${long}
  Lat: ${lat}
  Current Temp: ${temp}°C`)  
})();