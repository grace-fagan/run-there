import mapboxgl, { Map as MapboxMap } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Feature, FeatureCollection, LineString, Polygon, Position } from 'geojson';
import type { Route } from '$types/client';
import polyline from '@mapbox/polyline';
import { getFeatureCenter } from './neighborhoods-utils';
import type { Region } from '$types/neighborhoods/nyc';
import { get } from 'svelte/store';
import { city } from './store';

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

export const ROUTES_SRC = 'routes';
export const NEIGHBORHOODS_SRC = 'neighborhoods';

export const getPolyline = (summary: string): LineString => polyline.toGeoJSON(summary);

export const createMap = (center: Position): MapboxMap => {
  return new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/gracefagan/cl41z1iv1001h15p8tzq6m7fy',
    center,
    zoom: 9.5
  });
};

export const removeLayers = (map: MapboxMap, layers: string[]) =>
  layers.forEach((l) => {
    if (map.getLayer(l)) map.removeLayer(l);
  });

export const addNeighborhoodsToMap = (
  map: MapboxMap,
  features: FeatureCollection,
  maxValue: number
) => {
  const layerName = NEIGHBORHOODS_SRC + '-fill';
  if (map.getSource(NEIGHBORHOODS_SRC)) map.removeSource(NEIGHBORHOODS_SRC);

  map.addSource(NEIGHBORHOODS_SRC, {
    type: 'geojson',
    data: features
  });

  if (!map.getLayer(layerName)) {
    map.addLayer({
      id: layerName,
      type: 'fill',
      source: NEIGHBORHOODS_SRC,
      paint: {
        'fill-color': ['get', 'color'],
        'fill-opacity': [
          'case',
          ['==', maxValue, 0],
          0.2,
          ['==', ['get', 'value'], 0],
          0,
          ['>', ['get', 'value'], 0],
          [
            'interpolate',
            ['exponential', 0.97],
            ['get', 'value'],
            1,
            0.2,
            maxValue <= 1 ? 1.1 : maxValue,
            0.9
          ],
          0.2
        ]
      }
    });
  }
  return layerName;
};

export const addRoutesToMap = (map: MapboxMap, routes: Route[]) => {
  const layerName = 'routes-line';
  // remove old routes layer if already exists
  if (map.getLayer(layerName)) map.removeLayer(layerName);

  let routeFeatures = [];
  routes.forEach((route) => {
    routeFeatures = routeFeatures.concat({
      type: 'Feature',
      id: route.id,
      geometry: route.lineString
    });
  });

  // remove old routes source if already exists
  if (map.getSource(ROUTES_SRC)) map.removeSource(ROUTES_SRC);
  map.addSource(ROUTES_SRC, {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: routeFeatures
    }
  });

  map.addLayer({
    id: 'routes-line',
    type: 'line',
    source: ROUTES_SRC,
    minzoom: 8,
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': ['case', ['boolean', ['feature-state', 'hover'], false], '#E04051', '#5D5991'],
      'line-width': 1,
      'line-opacity': ['case', ['boolean', ['feature-state', 'visible'], false], 1, 0]
    }
  });
  toggleRoutes(map, routes);
};

export const toggleRoutes = (map: MapboxMap, routes: Route[], visible: boolean = true) => {
  if (!routes) return;
  if (!visible) {
    routes.forEach(({ id }) => map.removeFeatureState({ source: ROUTES_SRC, id: id }));
  } else {
    routes.forEach(({ id }) =>
      map.setFeatureState({ source: ROUTES_SRC, id: id }, { visible: true })
    );
  }
};

export const addSelectedLayerToMap = (map: MapboxMap, source: string): string => {
  const layerName = source + '-selected';
  if (map.getLayer(layerName)) map.removeLayer(layerName);
  map.addLayer({
    id: layerName,
    type: 'fill',
    source,
    layout: {
      visibility: 'none'
    },
    paint: {
      'fill-color': 'lightgrey',
      'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0, 0.3]
    }
  });
  return layerName;
};

export const addOutlinesToMap = (map: MapboxMap, source: string): string => {
  const layerName = source + '-outline';
  if (map.getLayer(layerName)) map.removeLayer(layerName);
  map.addLayer({
    id: layerName,
    type: 'line',
    source,
    paint: {
      'line-color': 'black',
      'line-width': 3,
      'line-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0]
    }
  });
  return layerName;
};

export const hoverFeature = (map: MapboxMap, n: Feature) => {
  if (!n) return;
  map.setFeatureState({ source: NEIGHBORHOODS_SRC, id: n.id }, { hover: true });
};

export const showFeatureRoutes = (map: MapboxMap, n: Feature) => {
  if (!n) return;
  const runsData = n.properties.runs;
  const routesToShow = (typeof runsData === 'string' ? JSON.parse(runsData) : runsData) as number[];
  routesToShow.forEach((route) => {
    map.setFeatureState({ source: ROUTES_SRC, id: route }, { visible: true });
  });
};

export const unhoverFeature = (map: MapboxMap, n: Feature) => {
  if (!n) return;
  map.setFeatureState({ source: NEIGHBORHOODS_SRC, id: n.id }, { hover: false });
};

export const hideFeatureRoutes = (map: MapboxMap, n: Feature) => {
  if (!n) return;
  const runsData = n.properties.runs;
  const routesToHide = (typeof runsData === 'string' ? JSON.parse(runsData) : runsData) as number[];
  routesToHide.forEach((route) => {
    map.removeFeatureState({ source: ROUTES_SRC, id: route });
  });
};

export const selectNeighborhood = (map: MapboxMap, n: Feature | null, center: Position) => {
  const layer = 'neighborhoods-selected';
  if (map.getLayer(layer)) {
    map.setLayoutProperty(layer, 'visibility', n ? 'visible' : 'none');
    map.flyTo({
      center: n ? getFeatureCenter(n.geometry as Polygon) : center,
      zoom: n ? 13 : 9.5
    });
  }
};

export const moveToRegion = (map: MapboxMap, r: Region) => {
  if (!r) map.flyTo({ center: get(city).center, zoom: 9.5 });
  else map.flyTo({ center: r.center, zoom: 11 });
};

export const moveToCity = (map: MapboxMap) => {
  map.jumpTo({ center: get(city).center });
};
