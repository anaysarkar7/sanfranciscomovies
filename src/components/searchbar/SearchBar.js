import { useState, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import MovieCard from "../map/card/MovieCard";
import "./SearchBar.css";
import { AUTOCOMPLETE_SEARCH_ENDPOINT } from "../../constants/enpoint.constant";
import { DEFAULT_SEARCH_FILTER } from "../../constants/filter.constant";
import { DEBOUNCE_DELAY } from "../../constants/debounce.constant";

const BACKEND_AUTOCOMPLETE_SEARCH_URI =
  `${process.env.REACT_APP_BACKEND_URL}` + AUTOCOMPLETE_SEARCH_ENDPOINT;

function SearchBar(props) {
  const [inputText, setInputText] = useState("");
  const [debouncedInputText, setDebouncedInputText] = useState("");
  const [movieFilter, setMovieFilter] = useState(DEFAULT_SEARCH_FILTER);
  const [suggestionsList, setSuggestionsList] = useState();
  const [movieDetails, setMovieDetails] = useState();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedInputText(inputText);
    }, DEBOUNCE_DELAY);
    return () => clearTimeout(timeoutId);
  }, [inputText]);

  useEffect(() => {
    autocompleteSearch(debouncedInputText, movieFilter);
  }, [debouncedInputText]);

  const autocompleteSearch = async (searchText, searchFilter) => {
    const requestBody = {
      inputText: searchText,
      filterType: searchFilter,
    };
    const requestHeaders = {
      "Content-Type": "application/json",
    };
    const response = await fetch(BACKEND_AUTOCOMPLETE_SEARCH_URI, {
      method: "POST",
      headers: requestHeaders,
      body: JSON.stringify(requestBody),
    });
    const autoCompleteSearchResponse = await response.json();
    if (autoCompleteSearchResponse) {
      setSuggestionsList(autoCompleteSearchResponse.data);
    } else {
      console.error(autoCompleteSearchResponse.error);
    }
  };

  const handleFilterClick = (e) => {
    setMovieFilter(e.target.id);
  };

  const handleInputChange = (e) => {
    if (e.target.value == "") {
      setSuggestionsList([]);
    } else setInputText(e.target.value);
  };

  const handleSuggestionClick = (e) => {
    //send coordinates to map component
    const suggestion = JSON.parse(e.target.dataset.item);
    const coordinates = {};
    if (suggestion.latitude && suggestion.longitude) {
      coordinates.latitude = suggestion.latitude;
      coordinates.longitude = suggestion.longitude;
    }
    setSuggestionsList([]);
    setMovieDetails({ ...movieDetails, ...suggestion });
    props.onSearchInputChange(coordinates);
  };

  return (
    <>
      <div className="container mt-4 ">
        <div className="searchBar" id="searchBar">
          <input
            type="text"
            className="form-control"
            placeholder="Search"
            list="movieList"
            id="searchBar"
            onKeyUp={handleInputChange}
          />
          <ul className="list-group" id="suggestion-ul">
            {suggestionsList &&
              suggestionsList.map((suggestion, index) => {
                return (
                  <li
                    className="list-group-item"
                    id="suggestion-li"
                    key={index}
                    data-item={JSON.stringify(suggestion)}
                    onClick={handleSuggestionClick}
                  >
                    MOVIE: {suggestion.title} | DIRECTOR: {suggestion.director}{" "}
                    | LOCATION: {suggestion.locations}
                  </li>
                );
              })}
          </ul>
        </div>
        <DropdownButton
          className="mt-2"
          id="dropdown-basic-button"
          title="SEARCH FITLTER"
        >
          <Dropdown.Item onClick={handleFilterClick} id="title">
            Movie Title
          </Dropdown.Item>
          <Dropdown.Item onClick={handleFilterClick} id="locations">
            Movie Location
          </Dropdown.Item>
          <Dropdown.Item onClick={handleFilterClick} id="director">
            Movie Director
          </Dropdown.Item>
        </DropdownButton>
        <div className="container mt-1">Filter : Movie {movieFilter}</div>
      </div>
      {movieDetails && (
        <div className="movieCard">
          <MovieCard movie={movieDetails} />
        </div>
      )}
    </>
  );
}

export default SearchBar;
