import React, { useState, useEffect, useRef } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "!mapbox-gl";
import "./Map.css";
import "bootstrap/dist/css/bootstrap.min.css";
import SearchBar from "../searchbar/SearchBar";
import {
  DEFAULT_ZOOM_LEVEL,
  MAPBOX_DEFAULT_STYLE,
  SANFRANCISCO_LATITUDE,
  SANFRANCISCO_LONGITUDE,
} from "../../constants/map.constant";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const Map = () => {
  const [zoomLevel, setZoomLevel] = useState(DEFAULT_ZOOM_LEVEL);
  const [longitude, setLongitude] = useState(SANFRANCISCO_LONGITUDE);
  const [latitude, setLatitude] = useState(SANFRANCISCO_LATITUDE);

  const mapContainer = useRef(null);
  const map = useRef(null);
  /**
   * MAP INITALIZATION USE EFFECT
   * */
  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAPBOX_DEFAULT_STYLE,
      center: [longitude, latitude],
      zoom: zoomLevel,
    });
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      setLongitude(map.current.getCenter().lng.toFixed(4));
      setLatitude(map.current.getCenter().lat.toFixed(4));
      setZoomLevel(map.current.getZoom().toFixed(2));
    });
  });

  const flyTo = (coordinates) => {
    map.current.flyTo({
      duration: 10000,
      bearing: 90,
      center: [coordinates.longitude, coordinates.latitude],
      zoom: 15,
      pitch: 0,
    });
  };

  const getSuggestionsWithCoordinates = (suggestion) => {
    if (suggestion.latitude && suggestion.longitude) {
      flyTo(suggestion);
    }
  };

  return (
    <>
      <div>
        <div ref={mapContainer} className="map-container">
          <div className="sidebar">
            Longitude: {longitude} | Latitude: {latitude} | Zoom: {zoomLevel}
            <SearchBar onSearchInputChange={getSuggestionsWithCoordinates} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Map;
