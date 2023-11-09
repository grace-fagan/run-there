import type { Feature, FeatureCollection, LineString, Polygon, Position } from 'geojson';
import { getRegion, regionMap } from './nyc-constants';
import point from 'turf-point';
import booleanIntersects from '@turf/boolean-intersects';
import center from '@turf/center';
import type { Activity, Route } from '$types/client';
import type { Region, Neighborhood } from '$types/neighborhoods/nyc';
import { getPolyline } from './mapbox-utils';
import { get } from 'svelte/store';
import { regions } from './store';

// this function cleans and adds route data to each feature in the raw data collection
export const loadMapData = (
  data: FeatureCollection,
  featureMap: Map<number, string[]>
): FeatureCollection => {
  return {
    type: 'FeatureCollection',
    features: data.features.map((feature) => {
      const parent = Number(feature.properties.parent);
      const id = Number(feature.properties.index);

      return {
        ...feature,
        id,
        properties: {
          name: feature.properties.neighborhood as string,
          parent,
          color: getRegion(parent)?.color || '#63BC83',
          neighbors: feature.properties.neighbors,
          runs: featureMap.get(id),
          value: featureMap.get(id).length
        }
      };
    })
  };
};

// get client region data from client neighborhood data
export const loadRegionData = (
  data: FeatureCollection,
  neighborhoods: Neighborhood[]
): Region[] => {
  console.log('loading region data for: ', neighborhoods);
  const neighborhoodsMap = new Map<number, Neighborhood>(neighborhoods.map((n) => [n.id, n]));

  return Array.from(regionMap.values())
    .map((r) => {
      const ids = data.features
        .filter((f) => Number(f.properties.parent) === r.id)
        .map((f) => f.properties.index);
      neighborhoods = ids
        .map((id) => neighborhoodsMap.get(id))
        .sort((a, b) => b.runs.length - a.runs.length);
      const runs = getAllRuns(neighborhoods);

      return {
        id: r.id,
        name: r.name,
        color: r.color,
        neighborhoods,
        runs,
        center: r.center
      };
    })
    .sort((a, b) => b.runs.length - a.runs.length);
};

// recursive function that performs a DFS to find all neighborhoods that intersect with a given route
const checkNeighbors = (
  featMap: Map<number, Feature>,
  route: LineString,
  currFeature: Feature,
  accumFeatures: number[],
  visited: number[]
) => {
  const currId = currFeature.properties.index as number;
  // if neighborhood has already been checked, return
  if (accumFeatures.includes(currId) || visited.includes(currId)) return;
  visited.push(currId);
  // if route is not in neighborhood, return
  if (!booleanIntersects(route, currFeature)) return;
  else {
    accumFeatures.push(currId);
    const neighborsToCheck = currFeature.properties.neighbors.split(',').map(Number) as number[];
    neighborsToCheck.forEach((n) =>
      checkNeighbors(featMap, route, featMap.get(n), accumFeatures, visited)
    );
  }
  return accumFeatures;
};

// Given a feature collection and route, return all neighborhoods included in a route
const getRouteNeighborhoods = (
  data: FeatureCollection,
  featMap: Map<number, Feature>,
  route: LineString
) => {
  const startPoint = route.coordinates[0];
  const startNeighborhood = getPolygonFromPoint(data, startPoint);
  if (!startNeighborhood) return [];
  return checkNeighbors(featMap, route, startNeighborhood, [], []);
};

// Given a feature collection and a list of activities, return a list of routes
export const getRoutes = (data: FeatureCollection, activities: Activity[]): Route[] => {
  // create map from ID to feature object
  const idToFeature = mapIdToFeature(data);

  const routes =
    activities &&
    activities.map((a) => {
      const id = a.id;
      const lineString = getPolyline(a.summaryPolyline);
      const neighborhoods = getRouteNeighborhoods(data, idToFeature, lineString);
      return {
        id: id,
        lineString,
        neighborhoods
      };
    });

  return routes;
};

// Given a feature collection and list of routes, return a mapping between one feature and its associated routes
export const getFeatureMap = (data: FeatureCollection, routes: Route[]) => {
  // create empty map that will hold routes
  const featToRoutesMap = new Map<number, string[]>(
    data.features.map((f) => [f.properties.index as number, []])
  );
  routes &&
    routes.map((r) => {
      const neighborhoods = r.neighborhoods;
      if (neighborhoods) neighborhoods.forEach((n) => featToRoutesMap.get(n).push(r.id));
    });
  return featToRoutesMap;
};

export const getPolygonFromPoint = (data: FeatureCollection, pointToFind: Position) => {
  return data.features.find((feature) => booleanIntersects(point(pointToFind), feature));
};

export const mapIdToFeature = (data: FeatureCollection) => {
  if (!data.features) return new Map();
  return new Map<number, Feature>(data.features.map((f) => [f.properties.index as number, f]));
};

// takes a map gets the maximum length of all its values
export const getMaxValLength = (map: Map<number, string[]>) => {
  let maxLength = 0;
  for (const arr of map.values()) maxLength = Math.max(maxLength, arr.length);
  return maxLength;
};

export const getCompletedNeighborhoods = (neighborhoods: Neighborhood[]) =>
  neighborhoods.filter((f) => f.runs.length > 0).length;

export const getFeatureCenter = (polygon: Polygon) => center(polygon).geometry.coordinates;

export const getRegionFromId = (id: number) => {
  if (!id) return null;
  const regionsValue = get(regions);
  const region = regionsValue.find((b) => b.id === id);
  return region;
};

export const getAllRuns = (neighborhoods: Neighborhood[]) => {
  return neighborhoods.reduce((prev, curr) => {
    curr.runs.forEach((r) => {
      // only count each run once
      if (!prev.includes(r)) prev.push(r);
    });
    return prev;
  }, []);
};
