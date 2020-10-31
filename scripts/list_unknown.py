from pathlib import Path
from datetime import datetime
import requests

output_dir = Path(__file__).parent / "output"
output_dir.mkdir(parents=True, exist_ok=True)
base_url = "https://bosmapper.dallen.co/api"

print(f"Listing unknown trees")

r = requests.get(f"{base_url}/trees/json/")

count = 0
unknown_file = output_dir / "unknown_notes.txt"
with open(unknown_file, "w") as f:
    for tree in r.json():
        if tree["species"] == "Onbekend" and tree["notes"]:
            f.write(tree["notes"] + "\n")
            count += 1

print(f"Saved {count} items to: {unknown_file}")
