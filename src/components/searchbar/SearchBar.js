import { useState, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import MovieCard from "../map/card/MovieCard";
import "./SearchBar.css";

function SearchBar(props) {
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("movie");
  const [suggestions, setSuggestions] = useState();
  const [movieDetails, setMovieDetails] = useState();
  const backendurl = `${process.env.REACT_APP_BACKEND_URL}/api/autocompleteSearch`;

  useEffect(() => {
    getSuggestions();
  }, [input]);

  const getSuggestions = async () => {
    const body = JSON.stringify({
      inputText: input,
      filter: filter,
    });
    const response = await fetch(backendurl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });
    const data = await response.json();
    if (data) {
      setSuggestions(data.result);
    } else {
      console.log(data.error);
    }
  };

  const handleFilterClick = (e) => {
    setFilter(e.target.id);
    setMovieDetails();
  };

  const handleInputChange = (e) => {
    if (e.target.value == "") {
      setSuggestions([]);
    } else setInput(e.target.value);
    setMovieDetails();
  };

  const handleSuggestionClick = (e) => {
    //send coordinates to map component
    const suggestion = JSON.parse(e.target.dataset.item);
    const coordinates = {};
    if (suggestion.latitude && suggestion.longitude) {
      coordinates.latitude = suggestion.latitude;
      coordinates.longitude = suggestion.longitude;
    }
    setSuggestions([]);
    setMovieDetails({ ...movieDetails, ...suggestion });
    props.onSuggestionClick(coordinates);
  };

  return (
    <>
      <div className="container mt-4 ">
        <div className="searchBar" id="searchBar">
          <input
            type="text"
            className="form-control"
            placeholder="Search for Movie/Location/Director & get suggested movies"
            list="movieList"
            id="searchBar"
            onKeyUp={handleInputChange}
          />
          <ul className="list-group" id="suggestion-ul">
            {suggestions &&
              suggestions.map((item, i) => {
                return (
                  <li
                    className="list-group-item"
                    id="suggestion-li"
                    key={i}
                    data-item={JSON.stringify(item)}
                    onClick={handleSuggestionClick}
                  >
                    Movie: {item.title} | Director: {item.director} | Locations:{" "}
                    {item.locations}
                  </li>
                );
              })}
          </ul>
        </div>
        <DropdownButton
          className="mt-2"
          id="dropdown-basic-button"
          title="filter"
        >
          <Dropdown.Item onClick={handleFilterClick} id="title">
            title
          </Dropdown.Item>
          <Dropdown.Item onClick={handleFilterClick} id="locations">
            locations
          </Dropdown.Item>
          <Dropdown.Item onClick={handleFilterClick} id="director">
            director
          </Dropdown.Item>
        </DropdownButton>
        <div className="container mt-1">
          Results will be filtered by {filter}
        </div>
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
