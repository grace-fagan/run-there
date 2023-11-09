import geopandas as gpd;
import sys;

bridges_map = {
  10: [236],
  117: [166, 55, 120],
  120: [251, 117],
  125: [27],
  129: [228, 152, 139, 244],
  139: [129],
  148: [259, 212],
  150: [259],
  151: [218],
  152: [129],
  153: [192],
  163: [251],
  166: [72, 117],
  188: [44],
  192: [153, 91],
  194: [72, 202],
  20: [91],
  202: [65, 194, 72],
  208: [65],
  210: [27],
  211: [27],
  212: [148, 245],
  218: [151],
  228: [129],
  236: [10],
  24: [91],
  242: [64],
  244: [129],
  245: [212],
  251: [163, 120],
  257: [84],
  259: [148, 150],
  27: [210, 211, 125],
  44: [188],
  55: [117, 72],
  64: [242],
  65: [202, 208],
  72: [202, 194, 166, 55],
  84: [257],
  91: [192, 20, 24],
  98: [99],
  99: [98]
}

def clean_nyc (input_file, output_file):

  gdf = gpd.read_file(input_file)
  
  neighborhood_geometries = {}

  for index, row in gdf.iterrows():
    neighborhood = row['neighborhood']
    if neighborhood not in neighborhood_geometries:
        parent = int(row['boroughCode'])
        
        #### Custom parent logic due to errors in raw data
        if (neighborhood == 'Williamsburg'): parent = 3
        if (neighborhood == 'Kingsbridge'): parent = 2

        neighborhood_geometries[neighborhood] = {
           'parent': parent,
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

  clean_nyc(input_file, output_file)