const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const geoNamesAPI = 'http://api.geonames.org/postalCodeSearchJSON?';
const weatherBIT = 'https://api.weatherbit.io/v2.0/forecast/daily?';
const pixabayAPI = 'https://pixabay.com/api';
const port = 7079
const app = express();
app.use(express.static('dist'));
app.use(bodyParser.json());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.listen(port, () => {
  console.log('listening on port 7079');
});


const geoNamesFunction = async (username, info) => {
  const locationinfo = infoFunction(info);
  const url = `${geoNamesAPI}${locationinfo}&maxRows=10&username=${username}`;
  return axios.get(url)
  .then(response => {
    return response.data.postalCodes[0];
  })
  .catch(err => console.log(err))
};

const infoFunction = info => {
  if (/\d/.test(info.value)) {
    return `postalcode=${info}`;
  } else {
    return `placename=${info}`;
  }
};

app.get('/geoNames', (req, res) => {
  const info = req.query.info;
  geoNamesFunction(process.env.username, info)
  .then(response => {
    res.end(JSON.stringify(response));
  })
});

const pixabayFunction = async (key, photo) => {
  const url = `${pixabayAPI}/?key=${key}&q=${photo}`;
  return await axios.get(url)
  .then(response => {
      return response.data.hits[0].largeImageURL;
      // console.log('heree', response.data)
  })
  .catch(err=>console.log(err))
};

app.get('/pixabay', (req, res) => {
  const photo = req.query.photo;
  console.log('here!', req.query)
  pixabayFunction(process.env.pixabaykey, photo)
  .then(response => {
    res.end(JSON.stringify(response));
  });
});

const weatherBITFunction = async (key, lat, long) => {
  const url = `${weatherBIT}lat=${lat}&lon=${long}&days=16&key=${key}`;
  return await axios.get(url)
  .then(response => {
      return response.data.data[0].high_temp
  })
  .catch(err=>console.log(err))
};

app.get('/weatherBIT', (req, res) => {
  const lat = req.query.lat;
  const long = req.query.long;

  weatherBITFunction(process.env.key, lat, long)
  .then(response => {
    res.end(JSON.stringify(response));
  });
});



module.exports = app;