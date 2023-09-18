
import React, {useState, useEffect} from "react";
import { SearchBar } from "../components/SearchBar";
import { SearchResult } from "../components/SearchResults";
import { SearchResultsList } from "../components/SearchResultsList";

export default function Dashboard() {  
    
    const [results, setResults] = useState([]);

    return (
      <div className="App">
        <div className="search-bar-container">
          <SearchBar setResults={setResults} />
          {results && results.length > 0 && <SearchResultsList results={results} />}
        </div>
      </div>
    );
}