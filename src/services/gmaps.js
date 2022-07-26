import { injectJS } from 'utils/loadJs';
import CONFIG from 'config';
import { getAddressFromComponents } from 'utils/gmaps';

let placesService = null;

const loadGmaps = async () => {
  if (window?.google?.maps) {
    return window.google.maps;
  }
  return new Promise((resolve) => {
    window.initGoogleMaps = async () => {
      console.log('gmaps loaded!');
      resolve(window.google.maps);
      delete window.initGoogleMaps;
    };
    injectJS(
      'gmaps-js',
      `https://maps.googleapis.com/maps/api/js?key=${CONFIG.GMAPS.key}&libraries=places&callback=initGoogleMaps`,
    )
      .catch(e => {
        throw e;
      });
  });
};

const getPlacesService = async () => {
  if (placesService) {
    return placesService;
  }
  const gmaps = await loadGmaps();
  placesService = new gmaps.places.PlacesService(document.createElement('map'));
  return placesService;
};

const searchPlaces = async query => {
  const gmaps = await loadGmaps();
  const service = await getPlacesService();
  return new Promise((resolve, reject) => {
    service.textSearch({
      query,
      fields: ['place_id', 'formatted_address', 'name', 'geometry'],
    }, (arr, status) => {
      if (status === gmaps.places.PlacesServiceStatus.OK) {
        resolve(arr);
        return;
      }
      reject(new Error(`unable to find places, status : ${status}`));
    });
  });
};

const getPlaceAddress = async (placeId, token) => {
  const service = await getPlacesService();
  const gmaps = await loadGmaps();
  return new Promise((resolve, reject) => {
    service.getDetails({
      placeId,
      fields: ['address_components', 'geometry'],
      sessionToken: token,
    }, (place, status) => {
      if (status === gmaps.places.PlacesServiceStatus.OK) {
        resolve(getAddressFromComponents(place.address_components, place.geometry));
        return;
      }
      reject(new Error(`unable to find places, status : ${status}`));
    });
  });
};

const autoSuggest = async (query, country, token) => {
  const gmaps = await loadGmaps();
  const service = new gmaps.places.AutocompleteService();
  return new Promise((resolve, reject) => {
    service.getPlacePredictions({
      input: query,
      componentRestrictions: { country: [country] },
      fields: ['address_components'],
      sessionToken: token,
    }, (arr, status) => {
      if (status === gmaps.places.PlacesServiceStatus.ZERO_RESULTS) {
        resolve([]);
        return;
      }
      if (status === gmaps.places.PlacesServiceStatus.OK) {
        resolve(arr);
        return;
      }
      reject(new Error(`unable to find places, status : ${status}`));
    });
  });
};

const getSessionToken = async () => {
  const gmaps = await loadGmaps();
  return new gmaps.places.AutocompleteSessionToken();
};

const Gmaps = {
  loadGmaps,
  getPlacesService,
  searchPlaces,
  getPlaceAddress,
  autoSuggest,
  getSessionToken,
};

export default Gmaps;
