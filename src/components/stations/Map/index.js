import React, { useEffect, useState } from 'react';

import stationsQuery from '../../../graphQL/stations/getStations';
import { useQuery } from '@apollo/client';

const StationMap = () => {
  const [stations, setStations] = useState([]);
  let map;
  const loadMarker = () => {
    stations.map((item) => {
      const popup = new mapboxgl.Popup().setText(item.name);
      new mapboxgl.Marker()
        .setLngLat(item.position.coordinates)
        .addTo(map)
        .setPopup(popup);
    });
  };

  const initMap = () => {
    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v10',
      center: [77.5835817, 12.9757101],
      zoom: 9
    });
    loadMarker();
  };

  const { loading, error, data, refetch } = useQuery(stationsQuery, {
    variables: {
      pagination: {
        page: 1,
        limit: 100
      },
      filter: {
        query: '',
        stationId: '',
        cpoId: ''
      }
    }
  });

  useEffect(() => {
    if (data && data.Stations) {
      setStations(data.Stations.docs);
    }
  }, [data]);

  useEffect(() => {
    mapboxgl.accessToken =
      'pk.eyJ1Ijoic2F0aHlhbmFyYXlhbmE3NTEiLCJhIjoiY2t5MDdqZzlzMDBoMTJ2bnFneHdlZmlxbyJ9.vnLMgju7lX0q475GT5BnkQ';
    initMap();
  }, [stations]);
  return <div style={{ height: '800px', width: '100%' }} id="map"></div>;
};

export default StationMap;
