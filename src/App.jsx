import { useReducer } from "react";
import Form from "./Form";
import Header from "./Header";
import Main from "./Main";
import Weather from "./Weather";
import Display from "./Display";

import { KEY } from "./config";

const URL = "http://api.openweathermap.org/";
const GEO_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client?";

function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function reducer(state, action) {
  switch (action.type) {
    case "SET_LOCATION":
      const locObj = {
        ...action.payload,
        emoji: convertToEmoji(action.payload.countryCode),
      };

      return {
        ...state,
        location: locObj,
      };
    case "GET_WEATHER":
      const { weather, main: temps } = action.payload;
      const { description, icon, main: keyword } = weather[0];
      return {
        ...state,
        loading: false,
        weather: { keyword, description, icon, temps },
      };
    case "LOADING":
      return {
        ...state,
        location: null,
        weather: null,
        loading: true,
        error: false,
        errorMessage: null,
      };
    case "ERROR":
      return {
        ...state,
        loading: false,
        error: true,
        errorMessage: action.payload,
      };
    default:
      return state;
  }
}

const initialState = {
  loading: false,
  location: null,
  weather: null,
  error: false,
  errorMessage: null,
};

function App() {
  const [{ loading, location, weather, errorMessage, error }, dispatch] =
    useReducer(reducer, initialState);

  async function getLocation(loc) {
    dispatch({ type: "LOADING" });
    try {
      const geoRes = await fetch(`${URL}/geo/1.0/direct?q=${loc}&appid=${KEY}`);
      const [geoData] = await geoRes.json();

      if (!geoData) throw new Error("There was an error fetching location 😢");
      else {
        const countryRes = await fetch(
          `${GEO_URL}latitude=${geoData.lat}&longitude=${geoData.lon}`
        );

        const countryData = await countryRes.json();

        const { countryName } = countryData;

        dispatch({
          type: "SET_LOCATION",
          payload: {
            countryCode: geoData.country,
            cityName: geoData.name,
            countryName,
          },
        });
        return [geoData.lat, geoData.lon];
      }
    } catch (err) {
      console.error(err);
      dispatch({
        type: "ERROR",
        payload: err.message,
      });
    }
  }

  async function getWeather(loc) {
    try {
      const coords = await getLocation(loc);
      if (!coords) return;

      const [lat, lon] = coords;

      const weatherRes = await fetch(
        `${URL}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${KEY}&units=metric`
      );

      if (!weatherRes)
        throw new Error("There was an error fetching weather 😢");
      const weatherData = await weatherRes.json();

      dispatch({ type: "GET_WEATHER", payload: weatherData });
    } catch (err) {
      const str = location ? "loading weather" : "fetching location";
      const message = `There was an error ${str} 😢`;
      console.error(err);
      dispatch({
        type: "ERROR",
        payload: message,
      });
    }
  }

  return (
    <div className="app">
      <Header />
      <Main>
        <Form getWeatherHandler={getWeather} />
        <Display>
          {!weather && error && <p>{errorMessage}</p>}
          {!weather && !error && !loading && <p>No location entered.</p>}
          {!weather && loading && <p>Loading...</p>}
          {weather && <Weather location={location} weather={weather} />}
        </Display>
      </Main>
    </div>
  );
}

export default App;
