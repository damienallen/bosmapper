import json
from datetime import datetime
from pathlib import Path

import requests

output_dir = Path.home() / "backups"
base_url = "https://bosmapper.dallen.co/api"

print(f"Backing up into: {output_dir}")

now = datetime.now().strftime("%Y%m%d")
backup_endpoints = [
    {"uri": f"{base_url}/trees/json/", "filename": f"voedselbos_{now}.json"},
    {"uri": f"{base_url}/trees/", "filename": f"voedselbos_{now}.geojson"},
    {"uri": f"{base_url}/species/", "filename": f"voedselbos_species_{now}.json"},
]

for endpoint in backup_endpoints:
    print("+ " + endpoint["filename"])
    r = requests.get(endpoint["uri"])
    with open(output_dir / endpoint["filename"], "w") as f:
        json.dump(r.json(), f, indent=4)
