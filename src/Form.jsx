import React, { useRef } from "react";

const Form = ({ getWeatherHandler }) => {
  const locationInputRef = useRef(null);

  const handleForm = (e) => {
    e.preventDefault();
    const loc = locationInputRef.current.value;
    locationInputRef.current.value = "";
    getWeatherHandler(loc);
  };

  return (
    <form className="form" onSubmit={handleForm}>
      <p>Type a location to query the weather for and click "submit".</p>
      <p>
        <label>Location:</label>
        <input ref={locationInputRef} />
      </p>

      <button className="btn btn-primary" onClick={handleForm}>
        Submit
      </button>
    </form>
  );
};

export default Form;
