import React, { useState, useEffect, useRef } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "!mapbox-gl";
import "./Map.css";
import "bootstrap/dist/css/bootstrap.min.css";
import SearchBar from "../searchbar/SearchBar";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-122.431297); //default longitude
  const [lat, setLat] = useState(37.773972); //default latitude is set to San Francisco
  const [zoom, setZoom] = useState(12);

  // MAP INITALIZATION USE EFFECT -------------------
  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });
  });
  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });
  // MAP INITALIZATION USE EFFECT -------------------

  const flyTo = (coordinates) => {
    map.current.flyTo({
      duration: 10000,
      bearing: 90,
      center: [coordinates.longitude, coordinates.latitude],
      zoom: 15,
      pitch: 0,
    });
  };

  const getSuggestionCoordinates = (coordinates) => {
    if (coordinates.latitude && coordinates.longitude) flyTo(coordinates);
  };

  return (
    <>
      <div>
        <div ref={mapContainer} className="map-container">
          <div className="sidebar">
            Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
            <SearchBar onSuggestionClick={getSuggestionCoordinates} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Map;
