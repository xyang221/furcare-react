import { useState } from "react";
import axiosClient from "../axios-client";


export const SearchBar = ({ setResults }) => {
  const [input, setInput] = useState("");

  const fetchData = (value) => {

    axiosClient.get(`/pet_owners`)
      .then(({data}) => data.json())
      .then((json) => {
        const results = json.filter((user) => {
          return (
            value &&
            user &&
            user.firstname &&
            user.firstname.toLowerCase().includes(value)
          );
        });
        setResults(results);
      });
  };

  const handleChange = (value) => {
    setInput(value);
    fetchData(value);
  };

  return (
    <div className="input-wrapper">
      <input
        placeholder="Type to search..."
        value={input}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};