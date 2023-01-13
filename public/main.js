import { Map, Overlay, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorTileLayer from 'ol/layer/VectorTile';
import XYZ from 'ol/source/XYZ';
import VectorTileSource from 'ol/source/VectorTile';
import MVT from 'ol/format/MVT';
import { fromLonLat } from 'ol/proj';

const map = new Map({
  target: 'map',
  view: new View({
    center: fromLonLat([0, 0]),
    zoom: 2
  })
});

// This one helps extracting the country name from the click
const vectorTileLayer = new VectorTileLayer({
  source: new VectorTileSource({
    format: new MVT(),
    url:
      'https://ahocevar.com/geoserver/gwc/service/tms/1.0.0/' +
      'ne:ne_10m_admin_0_countries@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf',
    maxZoom: 14,
  }),
});
map.addLayer(vectorTileLayer);

const openStreetMapStandard = new TileLayer({
  source: new XYZ({
    url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    maxZoom: 14,
  })
});
map.addLayer(openStreetMapStandard);

const container = document.getElementById('popup');
const citiesTableBody = document.getElementById('cities-table-body');
const popupCloser = document.getElementById('popup-closer');
const countrySpan = document.getElementById('country');
const citiesCountSpan = document.getElementById('cities-count');

const overlay = new Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 250
  }
});
map.addOverlay(overlay);
popupCloser.addEventListener('click', function () {
  overlay.setPosition(undefined);
  return false;
});

// Handle map clicks
map.addEventListener('singleclick', function (evt) {
  // Get the country using the coordinates from the map
  const features = map.getFeaturesAtPixel(evt.pixel);
  if (features.length === 0) {
    overlay.setPosition(undefined);
  } else {
    const country = features[0].get('name');
    countrySpan.innerHTML = country;
    citiesCountSpan.innerHTML = '5';
    citiesTableBody.innerHTML = '';
    fetch('/cities?country=' + country).then(async function (response) {
      const cities = await response.json();
      citiesCountSpan.innerHTML = Math.min(cities.length, 5);
      // Get first 5 cities
      cities.slice(0, 5).forEach(city => {
        const row = citiesTableBody.insertRow();
        const nameCell = row.insertCell(0);
        const populationCell = row.insertCell(1);
        nameCell.innerHTML = city.cityName;
        populationCell.innerHTML = city.population;
      });
    });
    overlay.setPosition(evt.coordinate);
  }
});
