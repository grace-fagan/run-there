import geopandas as gpd;
import sys;

bridges_map = {
}

def clean_sea (input_file, output_file):
  gdf = gpd.read_file(input_file)
  
  neighborhood_geometries = {}

  for index, row in gdf.iterrows():
    neighborhood = row['pri_neigh']
    if neighborhood not in neighborhood_geometries:
        neighborhood_geometries[neighborhood] = {
           'parent': -1,
           'geometry': row['geometry'],
        }
    else:
        neighborhood_geometries[neighborhood]['geometry'] = neighborhood_geometries[neighborhood]['geometry'].union(row['geometry'])
      
  combined_features = []
  for neighborhood, data in neighborhood_geometries.items():
    combined_features.append({
        'type': 'Feature',
        'properties': {'neighborhood': neighborhood, 'parent': data['parent']},
        'geometry': data['geometry']
    })
  
  clean_gdf = gpd.GeoDataFrame.from_features(combined_features)

  neighbors_ids = []
  for index, row in clean_gdf.iterrows():
    neighbors = clean_gdf[clean_gdf.geometry.intersects(row['geometry'])]
    neighbors = neighbors[neighbors.index != index]

    list_of_neighbors = neighbors.index.tolist()
    more_neighbors = bridges_map.get(index)
    
    if (more_neighbors):
      for n in more_neighbors:
        list_of_neighbors.append(n)
    
    neighbors_ids.append(','.join(map(str, list_of_neighbors)))
  
  clean_gdf['neighbors'] = neighbors_ids
  clean_gdf.to_file(output_file, driver='GeoJSON', index='true')

if __name__ == "__main__":
  if len(sys.argv) != 3:
      print("Usage: python geojson_union.py <input_geojson_file> <output_geojson_file>")
      sys.exit(1)

  input_file = sys.argv[1]
  output_file = sys.argv[2]

  clean_sea(input_file, output_file)