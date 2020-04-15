const geoNamesFunction = async (info) => {
  const url = `http://localhost:7079/geoNames?info=${info}`;
  return await fetch(url)
  .then(response => response.json())
  .catch(err=>console.log(err))
};

const geoNamesDOMFunction = async () => {
  const tripLoc = document.getElementById('inputFirst');
  return await geoNamesFunction(tripLoc.value)
  .then(response => {
    document.getElementById('country').textContent = response.countryCode;
    document.getElementById('latitude').textContent = response.lat;
    document.getElementById('longitude').textContent = response.lng;
    document.getElementById('desiredTripLoc').textContent = response.placeName;
  })
  .catch(err=>console.log(err))
} 


const tripLength = () => {
  const start = new Date(document.getElementById('inputSecond').value);
  const end = new Date(document.getElementById('inputThird').value);
  document.getElementById('countdown').innerHTML = Math.ceil((start - new Date()) / 8.64e7);
  document.getElementById('trip-length').innerHTML = (end.getTime()-start.getTime()) / 8.64e7;
};


const weatherBITFunction = async (lat, long) => {
  const urlWeather = `http://localhost:7079/weatherBIT?lat=${lat}&long=${long}`;
  return await fetch(urlWeather)
  .then(response => {
    return response.json();
  })
  .catch(err=>console.log(err))
};

const weatherForecastFunction = () => {
  const lat = document.getElementById('latitude').textContent;
  const lng = document.getElementById('longitude').textContent;

  weatherBITFunction(lat, lng)
  .then(response => {
    const weatherDom= document.createElement('li');
    const location = document.getElementById('weather').appendChild(weatherDom); 
    location.innerHTML = response
  })
};


const pixabayFunction = async photo => {
  const urlPix = `http://localhost:7079/pixabay?photo=${photo}`;
  return await fetch(urlPix)
  .then(response => {
    return response.json();
  })
  .catch(err=>console.log(err))
};


const form = event => {
  tripLength();
  geoNamesDOMFunction().then(response => {
    const start = new Date(document.getElementById('inputSecond').value);
    const end = new Date(document.getElementById('inputThird').value);
    const daysTrack = (end.getTime() - start.getTime()) / 8.64e7;
      weatherForecastFunction();

    const desiredTripLoc = document.getElementById('desiredTripLoc').textContent;

    pixabayFunction(desiredTripLoc)
    .then(response => {
      const pic = document.createElement('img');
      document.getElementById('image').appendChild(pic)
      pic.src = response;
    });

  });
};


export default form;