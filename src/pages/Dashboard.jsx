
import React, {useState, useEffect} from "react";
import { SearchBar } from "../components/SearchBar";
import { SearchResult } from "../components/SearchResults";
import { SearchResultsList } from "../components/SearchResultsList";

import Title from "../components/Title";

export default function Dashboard() {  
    
    const [results, setResults] = useState([]);

    return (
      <div className="App">
        <div className="search-bar-container">
          <Title props={"Dashboard"}/>
          <SearchBar setResults={setResults} />
          {results && results.length > 0 && <SearchResultsList results={results} />}
        </div>
      </div>
    );
}