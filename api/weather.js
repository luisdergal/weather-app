import { apiKey } from "../constants";
import axios from "axios";

const forecastEndpoint = (params) => {
  if (params.lat && params.lon) {
    return `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.lat},${params.lon}&days=${params.days}`;
  }
  return `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.cityName}&days=${params.days}`;
};

const locationsEndpoint = (params) => {
  return `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${params.cityName}`;
};

const apiCall = async (endpoint) => {
  const options = {
    method: 'GET',
    url: endpoint,
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.log('error: ', error);
    return {};
  }
};

export const fetchWeatherForecast = (params) => {
  let forecastUrl = forecastEndpoint(params);
  return apiCall(forecastUrl);
};

export const fetchLocations = (params) => {
  let locationsUrl = locationsEndpoint(params);
  return apiCall(locationsUrl);
};
