import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Custom hook to handle form input
const useField = (type) => {
  const [value, setValue] = useState('');

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    onChange
  };
};

// Custom hook to fetch country data
const useCountry = (name) => {
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!name) return; // Don't fetch if name is empty

    const fetchCountry = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`https://restcountries.com/v3.1/name/${name}?fullText=true`);
        setCountry({
          found: true,
          data: response.data[0]
        });
      } catch (error) {
        setCountry({
          found: false,
          data: null
        });
        setError('Country not found');
      } finally {
        setLoading(false);
      }
    };

    fetchCountry();
  }, [name]); // Re-run the effect when name changes

  return { country, loading, error };
};

const Country = ({ country, loading, error }) => {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!country) {
    return null;
  }

  if (!country.found) {
    return <div>Country not found...</div>;
  }

  return (
    <div>
      <h3>{country.data.name.common}</h3>
      <div>Capital: {country.data.capital}</div>
      <div>Population: {country.data.population}</div>
      <img src={country.data.flags.svg} height="100" alt={`Flag of ${country.data.name.common}`} />
    </div>
  );
};

const App = () => {
  const nameInput = useField('text');
  const [name, setName] = useState('');
  const { country, loading, error } = useCountry(name);

  const fetch = (e) => {
    e.preventDefault();
    setName(nameInput.value);
  };

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>Find</button>
      </form>

      <Country country={country} loading={loading} error={error} />
    </div>
  );
};

export default App;
