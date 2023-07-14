import mapboxgl, { Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Feature, FeatureCollection, LineString, Polygon } from 'geojson';
import type { LatLng } from '$types/client';
import polyline from '@mapbox/polyline';
import { polygon } from '@turf/helpers';
import union from '@turf/union';
import { CodeToBorough } from './nyc-constants';

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

export const getPolyline = (summary: string): LineString => polyline.toGeoJSON(summary);

export const createMap = (center: LatLng): Map => {
  return new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [center.lng, center.lat],
    zoom: 9.5
  });
};

export const cleanNeighborhoodsData = (data: FeatureCollection): FeatureCollection => {
  return {
    type: 'FeatureCollection',
    features: data.features.map((feature) => {
      let featurePolygon = feature.geometry as Polygon;

      // if feature has multiple polygons, get the union of them
      if (featurePolygon.coordinates.length > 1) {
        let unionGeometry: Feature<Polygon>;
        featurePolygon.coordinates.map((f) => {
          const singlePolygon = polygon([f]) as Feature<Polygon>;
          if (!unionGeometry) {
            unionGeometry = singlePolygon;
          } else {
            unionGeometry = union(unionGeometry, singlePolygon) as Feature<Polygon>;
          }
        });
        featurePolygon = unionGeometry.geometry;
      }

      const boroughCode = Number(feature.properties.boroughCode);

      return {
        ...feature,
        properties: {
          name: feature.properties.neighborhood as string,
          id: Number(feature.id),
          borough: boroughCode,
          color: CodeToBorough(boroughCode).color,
          neighbors: feature.properties.neighbors
        },
        geometry: featurePolygon
      };
    })
  };
};

export const addGeoJsonToMap = (map: Map, name: string, features: FeatureCollection) => {
  map.addSource(name, {
    type: 'geojson',
    data: features
  });

  map.addLayer({
    id: 'neighborhoods-fill',
    type: 'fill',
    source: name,
    paint: {
      'fill-color': ['get', 'color']
    }
  });
};
