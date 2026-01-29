import json
from datetime import date
from math import pi
from pathlib import Path

import cairo
import numpy as np
from babel.dates import format_date
from pyproj import Transformer

# CRS projection
transformer = Transformer.from_crs(3857, 7415)
current_dir = Path(__file__).resolve().parent
data_dir = current_dir / "data"

# Constants
DEFAULT_HEIGHT = 2
DEFAULT_DIAMETER = 3.4
TEXT_MARGIN_V = 0
TEXT_MARGIN_H = 0.5
BASE_FONT_SIZE = 0.8

# Formats
FORMAT = {
    "a3": {"top": 55, "bottom": -5, "left": 0, "right": 10, "font_size": 1.5},
    "a4": {"top": 45, "bottom": 25, "left": 0, "right": 23, "font_size": 1},
}

MIN_LAT = 89222
MAX_LAT = 89404
MIN_LON = 435919
MAX_LON = 436033

COMPASS_COORDS = [493420, 6783645]
SCALE_COORDS = [493297, 6783567]
TITLE_COORDS = [493480, 6783600]

TRANSLATION = [-0.2, 0.7]
ROTATION_ANGLE = -56 * pi / 180


# Colors
def decimal_color(r, g, b):
    return [r / 255, g / 255, b / 255]


TREE_FILL = decimal_color(77, 115, 67)
TREE_OUTLINE = decimal_color(54, 89, 62)

COLOR_WHITE = decimal_color(255, 255, 255)
COLOR_GREY_60 = decimal_color(153, 153, 153)
COLOR_GREY_70 = decimal_color(179, 179, 179)
COLOR_GREY_80 = decimal_color(203, 203, 203)
COLOR_GREY_90 = decimal_color(230, 230, 230)
COLOR_BLACK = decimal_color(0, 0, 0)


FEATURE_STYLES = {
    "boundary": {"stroke_color": COLOR_GREY_70, "stroke_width": 0.5},
    "background": {"fill_color": COLOR_WHITE},
    "bed": {"fill_color": COLOR_GREY_90},
    "bee_hives": {"fill_color": COLOR_GREY_70},
    "circle": {"fill_color": COLOR_GREY_80},
    "concrete": {"fill_color": COLOR_WHITE},
    "clubhouse": {"fill_color": COLOR_GREY_80},
    "paved": {"fill_color": COLOR_WHITE},
    "greenhouse": {"fill_color": COLOR_GREY_70},
    "misc": {"fill_color": COLOR_GREY_80},
    "tree_ring": {"fill_color": COLOR_GREY_80},
    "wall": {"fill_color": COLOR_GREY_80},
    "vegetation": {"fill_color": COLOR_GREY_90},
    "vegetation_no_wall": {"fill_color": COLOR_GREY_90},
}


class MapMaker:
    def __init__(self, features, size: str):
        self.size = size
        self.format = FORMAT[size]

        self.min_lon = MIN_LON - self.format["left"]
        self.max_lon = MAX_LON - self.format["right"]

        self.min_lat = MIN_LAT - self.format["bottom"]
        self.max_lat = MAX_LAT - self.format["top"]

        self.get_base_features(data_dir / "base.geojson")
        self.extract_species(data_dir / "species.json")
        self.extract_features(features)

    def draw(self) -> str:
        height = (16.5 if self.size == "a3" else 11.7) * 72
        width = (11.7 if self.size == "a3" else 8.3) * 72

        temp_dir = current_dir / "temp"
        pdf_path = temp_dir / "voedselbos.pdf"
        Path(temp_dir).mkdir(parents=True, exist_ok=True)

        with cairo.PDFSurface(pdf_path, width, height) as surface:
            self.ctx = cairo.Context(surface)
            self.ctx.scale(1200, 1200)

            # Set background
            self.ctx.save()
            self.ctx.set_source_rgb(*COLOR_WHITE)
            self.ctx.paint()
            self.ctx.restore()

            # Position canvas
            self.ctx.translate(*TRANSLATION)
            self.ctx.rotate(ROTATION_ANGLE)

            print("Drawing base map")
            self.draw_base_features()

            self.draw_overlay()
            self.draw_text()
            self.draw_compass()
            self.draw_scale()
            self.draw_title()

        return pdf_path

    @staticmethod
    def reproject(coordinates):
        x2, y2 = transformer.transform(*coordinates)
        return [y2, x2]

    def get_base_features(self, geojson_path):
        print(f"Parsing file: {geojson_path}")

        with open(geojson_path, "r") as f:
            geojson_data = json.load(f)

        features = geojson_data.get("features")
        print(f"Loaded {len(features)} features")

        self.base_features = features

    def get_x(self, coords):
        return self.reproject(coords)[1] - self.min_lat

    def get_y(self, coords):
        return self.max_lon - self.reproject(coords)[0]

    def extract_species(self, species_path: str):
        print(f"Loading {species_path}")

        with open(species_path, "r") as f:
            species_data = json.load(f)
            self.species = species_data["species"]

    def get_species(self, species_name: str):
        return next(
            (s for s in self.species if s["species"] == species_name),
            None,
        )

    def get_height(self, feature):
        species_data = self.get_species(feature["properties"]["species"])
        height = species_data["height"] if species_data else None
        return height if height else DEFAULT_HEIGHT

    def get_diameter(self, feature):
        species_data = self.get_species(feature["properties"]["species"])
        width = species_data["width"] if species_data else None
        return width if width else DEFAULT_DIAMETER

    def extract_features(self, feature_list):
        lat_range = self.max_lat - self.min_lat
        self.scale_factor = 1 / lat_range

        print(f"Scale factor: {self.scale_factor}")

        self.trees = []
        num_skipped = 0

        for feature in feature_list:
            if feature["properties"]["name_nl"] == "Onbekend":
                continue

            width = self.get_diameter(feature)
            adjusted_radius = (width / 2) * self.scale_factor

            height = self.get_height(feature)
            adjusted_height = height * self.scale_factor

            try:
                self.trees.append(
                    {
                        "species": feature["properties"]["species"],
                        "name": feature["properties"]["name_nl"],
                        "x": self.get_x(feature["geometry"]["coordinates"])
                        * self.scale_factor,
                        "y": self.get_y(feature["geometry"]["coordinates"])
                        * self.scale_factor,
                        "radius": adjusted_radius,
                        "height": adjusted_height,
                    }
                )

            except KeyError:
                num_skipped += 1

        print(f"Skipped {num_skipped} entries.")

    def draw_overlay(self):
        for tree in self.trees:
            self.ctx.save()
            dot_radius = min(max(tree["radius"] / 14, 0.0012), 0.0022)
            self.ctx.arc(tree["x"], tree["y"], dot_radius, 0, pi * 2)
            self.ctx.set_source_rgba(*COLOR_GREY_60, 1)
            self.ctx.fill()
            self.ctx.restore()

    @staticmethod
    def fade_white(color, percent):
        color = np.array(color)
        white = np.array([1, 1, 1])
        vector = white - color
        return color + vector * percent

    def draw_text(self):
        for tree in self.trees:
            self.ctx.save()

            display_name = tree["name"] if tree["name"] else tree["species"]

            min_radius = -50 * self.scale_factor
            max_radius = 15 * self.scale_factor
            radius_factor = min(
                (tree["radius"] - min_radius) / (max_radius - min_radius), 1
            )

            min_height = -10 * self.scale_factor
            max_height = 15 * self.scale_factor
            height_factor = min(
                (tree["height"] - min_height) / (max_height - min_height), 1
            )

            # Set text styling
            fill_color = self.fade_white(COLOR_BLACK, 0.75 * (1 - height_factor) + 0.1)
            self.ctx.set_source_rgb(*fill_color)
            self.ctx.set_font_size(
                radius_factor * self.scale_factor / self.format["font_size"]
            )

            self.ctx.select_font_face(
                "Arial", cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_NORMAL
            )

            # Measure and align text
            fascent, fdescent, fheight, fxadvance, fyadvance = self.ctx.font_extents()
            x_off, y_off, tw, th = self.ctx.text_extents(display_name)[:4]

            nx = 0
            ny = th / 2

            self.ctx.translate(tree["x"], tree["y"])
            self.ctx.rotate(-ROTATION_ANGLE)
            self.ctx.translate(nx, ny)
            self.ctx.move_to(
                TEXT_MARGIN_H * self.scale_factor, TEXT_MARGIN_V * self.scale_factor
            )
            self.ctx.show_text(display_name)

            self.ctx.restore()

    def position_feature(self, feature):
        for index, point in enumerate(feature["geometry"]["coordinates"][0]):
            x = self.get_x(point) * self.scale_factor
            y = self.get_y(point) * self.scale_factor

            if index == 0:
                self.ctx.move_to(x, y)
            else:
                self.ctx.line_to(x, y)

    def draw_base_features(self):
        for feature in self.base_features:
            feature_type = feature["properties"]["type"]
            style = FEATURE_STYLES.get(feature_type)

            if not style:
                print(f"Unknown feature type '{feature_type}', skipping...")
                continue

            self.ctx.save()

            if not feature["geometry"]["coordinates"]:
                continue

            self.position_feature(feature)
            self.ctx.close_path()

            fill_color = style.get("fill_color")
            stroke_color = style.get("stroke_color")
            stroke_width = style.get("stroke_width")

            if fill_color:
                self.ctx.set_source_rgb(*fill_color)
                if stroke_color and stroke_width:
                    self.ctx.fill_preserve()
                else:
                    self.ctx.fill()

            if stroke_color and stroke_width:
                self.ctx.set_line_width(self.scale_factor * stroke_width)
                self.ctx.set_source_rgb(*stroke_color)
                self.ctx.stroke()

            self.ctx.restore()

    def draw_compass(self):
        self.ctx.save()
        x = self.get_x(COMPASS_COORDS) * self.scale_factor
        y = self.get_y(COMPASS_COORDS) * self.scale_factor

        # Draw arrow
        self.ctx.move_to(x, y + 2 * self.scale_factor)
        self.ctx.line_to(x, y - 2 * self.scale_factor)
        self.ctx.line_to(x + 0.5 * self.scale_factor, y - 1 * self.scale_factor)

        self.ctx.set_line_width(self.scale_factor * 0.15)
        self.ctx.set_source_rgba(*COLOR_BLACK, 0.3)
        self.ctx.stroke()

        self.ctx.save()

        self.ctx.restore()

        # Draw N
        self.ctx.select_font_face(
            "Arial", cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_NORMAL
        )
        self.ctx.set_font_size(self.format["font_size"] * 1.5 * self.scale_factor)

        fascent, fdescent, fheight, fxadvance, fyadvance = self.ctx.font_extents()
        x_off, y_off, tw, th = self.ctx.text_extents("N")[:4]
        nx = -tw / 2.0
        ny = fheight / 2

        self.ctx.translate(x, y - 4 * self.scale_factor)
        # self.ctx.translate(x - 1 * self.scale_factor, y - 2.2 * self.scale_factor)
        self.ctx.rotate(-ROTATION_ANGLE)
        self.ctx.translate(nx, ny)
        self.ctx.move_to(0, 0)
        self.ctx.show_text("N")

        self.ctx.restore()

    def draw_scale(self):
        self.ctx.save()
        x_offset = -2
        y_offset = -1.5
        x = self.get_x(SCALE_COORDS) * self.scale_factor
        y = self.get_y(SCALE_COORDS) * self.scale_factor

        # Draw scale
        self.ctx.translate(x, y)
        self.ctx.rotate(-ROTATION_ANGLE)
        self.ctx.move_to(x_offset * self.scale_factor, y_offset * self.scale_factor)
        self.ctx.line_to(
            (x_offset + 10) * self.scale_factor, y_offset * self.scale_factor
        )

        for offset in range(0, 11):
            self.ctx.move_to(
                (x_offset + offset) * self.scale_factor, y_offset * self.scale_factor
            )
            self.ctx.line_to(
                (x_offset + offset) * self.scale_factor,
                (y_offset + 0.5) * self.scale_factor,
            )

        self.ctx.set_line_width(self.scale_factor * 0.15)
        self.ctx.set_source_rgb(*COLOR_BLACK)
        self.ctx.stroke()

        # Draw text
        self.ctx.select_font_face(
            "Arial", cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_NORMAL
        )
        self.ctx.set_font_size(1 * self.scale_factor)
        self.ctx.move_to(
            (x_offset + 4) * self.scale_factor, (y_offset + 2) * self.scale_factor
        )
        self.ctx.show_text("10 m")

        self.ctx.restore()

    def draw_title(self):
        x = self.get_x(TITLE_COORDS) * self.scale_factor
        y = self.get_y(TITLE_COORDS) * self.scale_factor

        self.ctx.save()
        self.ctx.translate(x, y)
        self.ctx.rotate(-ROTATION_ANGLE)
        self.ctx.select_font_face(
            "Arial", cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_NORMAL
        )
        self.ctx.set_font_size(self.format["font_size"] * 1.5 * self.scale_factor)
        self.ctx.move_to(0, 0)
        self.ctx.show_text("Voedselbos")

        self.ctx.move_to(0, 0.02 * self.format["font_size"])
        self.ctx.set_font_size(self.format["font_size"] * 1.75 * self.scale_factor)
        self.ctx.set_source_rgba(*COLOR_BLACK, 0.3)

        timestamp = str(format_date(date.today(), "MMM Y", locale="nl")).upper()
        self.ctx.show_text(timestamp)

        self.ctx.restore()


if __name__ == "__main__":
    feature_path = data_dir / "trees.geojson"
    with open(feature_path, "r") as f:
        geojson_data = json.load(f)

    maker = MapMaker(geojson_data["features"], "a3")
    maker.draw()
