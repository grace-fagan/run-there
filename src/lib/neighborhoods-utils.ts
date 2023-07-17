import type { Feature, FeatureCollection, LineString, Polygon, Position } from 'geojson';
import { polygon } from '@turf/helpers';
import union from '@turf/union';
import { CodeToBorough } from './nyc-constants';
import point from 'turf-point';
import booleanIntersects from '@turf/boolean-intersects';
import type { Route } from '$types/client';

// this function cleans and adds route data to each feature in the collection
export const populateData = (
  data: FeatureCollection,
  routesMap: Map<number, string[]>
): FeatureCollection => {
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
      const id = Number(feature.id);

      return {
        ...feature,
        properties: {
          name: feature.properties.neighborhood as string,
          id,
          borough: boroughCode,
          color: CodeToBorough(boroughCode).color,
          neighbors: feature.properties.neighbors,
          runs: routesMap.get(id),
          value: routesMap.get(id).length
        },
        geometry: featurePolygon
      };
    })
  };
};

// recursive function that performs a DFS to find all neighborhoods that intersect with a given route
const checkNeighbors = (
  featMap: Map<number, Feature>,
  route: LineString,
  currFeature: Feature,
  accumFeatures: number[],
  visited: number[]
) => {
  const currId = currFeature.id as number;
  // if neighborhood has already been checked, return
  if (accumFeatures.includes(currId) || visited.includes(currId)) return;
  visited.push(currId);
  // if route is not in neighborhood, return
  if (!booleanIntersects(route, currFeature)) return;
  else {
    accumFeatures.push(currId);
    currFeature.properties.neighbors.forEach((n) =>
      checkNeighbors(featMap, route, featMap.get(n), accumFeatures, visited)
    );
  }
  return accumFeatures;
};

export const getNeighborhoodsFromRoute = (
  data: FeatureCollection,
  featMap: Map<number, Feature>,
  route: LineString
) => {
  const startPoint = route.coordinates[0];
  const startNeighborhood = getFeatureFromPoint(data, startPoint);
  if (!startNeighborhood) return [];
  return checkNeighbors(featMap, route, startNeighborhood, [], []);
};

export const mapNeighborhoodToRoutes = (data: FeatureCollection, routes: Route[]) => {
  // create map from ID to feature object
  const featureIdMap = createFeatureIdMap(data);
  // create empty map that will hold routes
  const featToRoutesMap = new Map<number, string[]>(data.features.map((f) => [f.id as number, []]));
  routes.forEach((route) => {
    if (!route) return;
    const neighborhoods = getNeighborhoodsFromRoute(data, featureIdMap, route.lineString);
    if (neighborhoods) {
      // populate neighborhoods attribute of routes object
      route.neighborhoods = neighborhoods;
      // add route to Feature To Routes Map
      neighborhoods.forEach((n) => featToRoutesMap.get(n).push(route.id));
    }
  });
  return featToRoutesMap;
};

export const getFeatureFromPoint = (data: FeatureCollection, pointToFind: Position) => {
  return data.features.find((feature) => booleanIntersects(point(pointToFind), feature));
};

export const createFeatureIdMap = (data: FeatureCollection) => {
  if (!data.features) return new Map();
  return new Map<number, Feature>(data.features.map((f) => [f.id as number, f]));
};

// takes a map gets the maximum length of all its values
export const getMaxValLength = (map: Map<number, []>) => {
  let maxLength = 0;
  for (const arr of map.values()) maxLength = Math.max(maxLength, arr.length);
  return maxLength;
};
