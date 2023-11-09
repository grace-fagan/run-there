import geopandas as gpd;
import sys;

def union_geojson (input_file, output_file):
  gdf = gpd.read_file(input_file)
  union = gdf.unary_union
  union_gdf = gpd.GeoDataFrame(geometry=[union])
  union_gdf.to_file(output_file, driver='GeoJSON')

if __name__ == "__main__":
  if len(sys.argv) != 3:
      print("Usage: python geojson_union.py <input_geojson_file> <output_geojson_file>")
      sys.exit(1)

  input_file = sys.argv[1]
  output_file = sys.argv[2]

  union_geojson(input_file, output_file)

