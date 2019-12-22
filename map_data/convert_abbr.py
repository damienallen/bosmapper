from pathlib import Path
import json

input_path = Path.cwd() / "map_data" / "voedselbos_features_original.geojson"
output_path = Path.cwd() / "map_data" / "voedselbos_features.geojson"
species_path = Path.cwd() / "map_data" / "voedselbos_species.json"

print(f"Loading feature data from '{input_path}''")
with open(input_path, "r") as f:
    json_data = json.load(f)

print(f"Loading species data from '{species_path}''")
with open(species_path, "r") as f:
    species_data = json.load(f)

species_lookup = {}
for species in species_data["species"]:
    species_lookup[species["abbr"]] = species["species"]

json_data["name"] = "voedselbos_features"
features = json_data["features"]
for feature in features:
    feature["properties"].pop("name_nl", None)
    feature["properties"].pop("name_en", None)
    feature["properties"].pop("height", None)
    feature["properties"].pop("width", None)
    feature["properties"].pop("notes", None)

    abbr_name = feature["properties"]["species"]
    feature["properties"]["species"] = (
        species_lookup[abbr_name] if abbr_name in species_lookup else abbr_name
    )

    if not abbr_name in species_lookup:
        print(f"Missing from lookup: {abbr_name}")


print(f"Saving to '{output_path}'")
with open(output_path, "w") as f:
    json.dump(json_data, f)
