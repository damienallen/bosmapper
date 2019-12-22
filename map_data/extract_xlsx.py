from datetime import datetime
from openpyxl import load_workbook
from pathlib import Path
import json


xlsx_path = Path.cwd() / "map_data" / "voedselbos_species.xlsx"
json_path = Path.cwd() / "map_data" / "voedselbos_species.json"

print(f"Loading data from '{xlsx_path}''")
wb = load_workbook(filename=xlsx_path)
ws = wb.active

abbr = ws["A"]
species = ws["B"]
name_nl = ws["C"]
name_en = ws["D"]
height = ws["E"]
width = ws["F"]
phase = ws["G"]
notes = ws["J"]

species_list = []

for i in range(1, len(species)):

    species_list.append(
        {
            "abbr": abbr[i].value,
            "species": species[i].value,
            "name_nl": name_nl[i].value,
            "name_en": name_en[i].value,
            "height": height[i].value,
            "width": width[i].value,
            "phase": phase[i].value
        }
    )

json_data = {"species": species_list, "updated": datetime.now().isoformat()}

print(f"Saving to '{json_path}'")
with open(json_path, "w") as f:
    json.dump(json_data, f)

