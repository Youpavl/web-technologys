import React, { useState } from 'react';

const countries = [
  "Australia", "Austria", "Belgium", "Brazil", "Canada", "China",
  "Czech Republic", "Denmark", "Egypt", "Finland", "France", "Germany",
  "Greece", "India", "Indonesia", "Ireland", "Israel", "Italy", "Japan",
  "Mexico", "Netherlands", "New Zealand", "Norway", "Pakistan", "Poland",
  "Portugal", "Saudi Arabia", "Singapore", "South Africa", "South Korea",
  "Spain", "Sweden", "Switzerland", "Thailand", "Turkey", "UAE",
  "Ukraine", "United Kingdom", "USA", "Vietnam"
];

function UserProfileForm() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [country, setCountry] = useState("");

  const handleClear = () => {
    setName("");
    setAge("");
    setCountry("");
  };

  return (
    <div className="profile-form">
      <h2>User Profile Form</h2>

      <div className="form-group">
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
        <p className="current-value">Name: <span>{name || "___"}</span></p>
      </div>

      <div className="form-group">
        <label>Age:</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Enter your age"
        />
        <p className="current-value">Age: <span>{age || "___"}</span></p>
      </div>

      <div className="form-group">
        <label htmlFor="country-select">Country:</label>
        <select 
          id="country-select"
          value={country} 
          onChange={(e) => setCountry(e.target.value)}
        >
          <option value="" disabled>Select a country</option>
          {countries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <p className="current-value">Country: <span>{country || ""}</span></p>
      </div>   

      <button className="clear-btn" onClick={handleClear}>
        Clear Form
      </button>

      <div className="summary">
        <h3>Summary:</h3>
        <p>
          Hello, <strong>{name || "___"}</strong> from <strong>{country}</strong>!
          You are <strong>{age || "___"}</strong> years old.
        </p>
      </div>
    </div>
  );
}

export default UserProfileForm;
