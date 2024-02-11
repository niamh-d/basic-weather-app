import React from "react";

const URL_BASE = "https://openweathermap.org/img/wn/";

const Weather = ({ location, weather }) => {
  const { keyword, temps, description, icon } = weather;
  const { emoji, countryName, cityName } = location;

  function roundFig(temp) {
    return Math.round(temp);
  }
  return (
    <div>
      <h3 className="mb-3">weather for:</h3>
      <h2 className="mb-5">
        <span className="font-bold text-3xl">{cityName}</span>
        {` ( ${countryName} ${emoji} )`}
      </h2>
      <p className="text-2xl">{keyword}</p>
      <p className="text-xl">
        {description} <img src={`${URL_BASE}${icon}.png`} />
      </p>
      <ul className="mt-3">
        <li className="font-bold text-xl">
          Temperature: {roundFig(temps.temp)} &deg;C
        </li>
        <li>Max: {roundFig(temps.temp_max)} &deg;C</li>
        <li>Min: {roundFig(temps.temp_min)} &deg;C</li>
      </ul>
    </div>
  );
};

export default Weather;
