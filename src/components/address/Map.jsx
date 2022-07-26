import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Gmaps from 'services/gmaps';
import styles from './Map.module.css';

export function Map({ place }) {
  const ref = useRef();

  const isFilled = place?.coords?.lat && place?.coords?.long;

  const loadMap = async () => {
    if (!isFilled) {
      return;
    }
    const gmaps = await Gmaps.loadGmaps();
    const location = new gmaps.LatLng(place?.coords?.lat, place?.coords?.long);
    const map = new gmaps.Map(ref.current, {
      center: location,
      zoom: 18,
      mapTypeControl: false,
      fullscreenControl: false,
      scaleControl: false,
      zoomControl: false,
      streetViewControl: false,
    });
    const marker = new gmaps.Marker({
      map,
      position: location,
    });
    const info = new gmaps.InfoWindow();
    gmaps.event.addListener(marker, 'click', () => {
      info.setContent(place.name || '');
      info.open(map);
    });
  };

  useEffect(() => {
    if (ref.current) {
      loadMap();
    }
  }, [JSON.stringify(place?.coords || {}), !!ref?.current]);

  if (!isFilled) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.map} ref={ref} />
    </div>
  );
}

Map.propTypes = {
  place: PropTypes.object.isRequired,
};

Map.defaultProps = {};
