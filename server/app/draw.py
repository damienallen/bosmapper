import json
from math import pi
from operator import itemgetter
from pathlib import Path

import cairo
import numpy as np
from pyproj import Transformer


# CRS projection
transformer = Transformer.from_crs(3857, 7415)
current_dir = Path(__file__).resolve().parent

# Constants
DEFAULT_HEIGHT = 2
DEFAULT_DIAMETER = 3.4
MARGIN_TOP = 10
MARGIN_BOTTOM = 10
MARGIN_LEFT = 10
MARGIN_RIGHT = 5
TEXT_MARGIN_V = 0
TEXT_MARGIN_H = 0.5
TEXT_SIZE = 0.8

COMPASS_COORDS = [493399, 6783645]
SCALE_COORDS = [493297, 6783567]
TITLE_COORDS = [493402, 6783658]

TRANSLATION = [-0.2, 0.7]
ROTATION_ANGLE = -56 * pi / 180


# Colors
def decimal_color(r, g, b):
    return [r / 255, g / 255, b / 255]


TREE_FILL = decimal_color(77, 115, 67)
TREE_OUTLINE = decimal_color(54, 89, 62)

COLOR_WHITE = decimal_color(255, 255, 255)
COLOR_GREY_70 = decimal_color(179, 179, 179)
COLOR_GREY_80 = decimal_color(203, 203, 203)
COLOR_GREY_90 = decimal_color(230, 230, 230)
COLOR_BLACK = decimal_color(0, 0, 0)


FEATURE_STYLES = {
    "boundary": {"stroke_color": COLOR_GREY_70, "stroke_width": 0.5},
    "bed": {"fill_color": COLOR_GREY_90},
    "bee_hives": {"fill_color": COLOR_GREY_70},
    "concrete": {"fill_color": COLOR_WHITE},
    "paved": {"fill_color": COLOR_WHITE},
    "greenhouse": {"fill_color": COLOR_GREY_70},
    "misc": {"fill_color": COLOR_GREY_80},
    "tree_ring": {"fill_color": COLOR_GREY_80},
    "wall": {"fill_color": COLOR_GREY_80},
    "vegetation": {"fill_color": COLOR_GREY_90},
    "vegetation_no_wall": {"fill_color": COLOR_GREY_90},
}


class MapMaker:
    def __init__(self, features):

        self.get_base_features(current_dir / "base.geojson")
        self.extract_features(features)

    def draw(self):

        temp_dir = current_dir / "temp"
        pdf_path = temp_dir / "voedselbos.pdf"
        Path(temp_dir).mkdir(parents=True, exist_ok=True)

        with cairo.PDFSurface(pdf_path, 840, 1200) as surface:
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

    def extract_features(self, feature_list):

        # TODO: calculate these from bounds
        lat_list = [
            self.reproject(feature["geometry"]["coordinates"])[1]
            for feature in feature_list
        ]
        lon_list = [
            self.reproject(feature["geometry"]["coordinates"])[0]
            for feature in feature_list
        ]

        self.min_lon = min(lon_list) - MARGIN_LEFT
        self.max_lon = max(lon_list) + MARGIN_RIGHT

        self.min_lat = min(lat_list) - MARGIN_BOTTOM
        self.max_lat = max(lat_list) + MARGIN_TOP

        lon_range = self.max_lon - self.min_lon
        lat_range = self.max_lat - self.min_lat

        self.scale_factor = 1 / lon_range if lon_range > lat_range else 1 / lat_range

        print(f"Scale factor: {self.scale_factor}")

        self.trees = []
        self.species_list = []
        num_skipped = 0

        for feature in feature_list:
            crown_diameter = (
                feature["properties"]["width"]
                if feature["properties"].get("width")
                else DEFAULT_DIAMETER
            )
            adjusted_radius = (crown_diameter / 2) * self.scale_factor

            height = (
                feature["properties"]["height"]
                if feature["properties"].get("height")
                else DEFAULT_HEIGHT
            )
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

            existing_species = [species["name"] for species in self.species_list]
            if not feature["properties"]["species"] in existing_species:
                height = (
                    feature["properties"]["height"]
                    if feature["properties"]["height"]
                    else DEFAULT_HEIGHT
                )
                self.species_list.append(
                    {
                        "name": feature["properties"]["species"],
                        "radius": adjusted_radius,
                        "height": height,
                    }
                )

        print(f"Skipped {num_skipped} entries.")

        self.species_list = sorted(self.species_list, key=itemgetter("height"))

    def draw_overlay(self):

        for tree in self.trees:
            self.ctx.save()
            dot_radius = max(tree["radius"] / 14, 0.002)
            self.ctx.arc(tree["x"], tree["y"], dot_radius, 0, pi * 2)
            self.ctx.set_source_rgba(*COLOR_BLACK, 0.6)
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

            # Set text styling
            fill_color = self.fade_white(COLOR_BLACK, 1 - radius_factor)
            self.ctx.set_source_rgb(*fill_color)
            self.ctx.set_font_size(TEXT_SIZE * radius_factor * self.scale_factor)

            self.ctx.select_font_face(
                "Arial", cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_NORMAL
            )

            # Measure and align text
            fascent, fdescent, fheight, fxadvance, fyadvance = self.ctx.font_extents()
            x_off, y_off, tw, th = self.ctx.text_extents(display_name)[:4]

            # nx = -tw / 2.0
            # ny = fheight / 2

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

    def draw_base_features(self):
        # TODO: break this up, offset paths
        self.base_features.sort(key=lambda d: d["properties"]["z_index"])

        for feature in self.base_features:

            feature_type = feature["properties"]["type"]
            style = FEATURE_STYLES.get(feature_type)

            if not style:
                print(f"Unknown feature type '{feature_type}', skipping...")
                continue

            self.ctx.save()

            for index, point in enumerate(feature["geometry"]["coordinates"][0]):
                x = self.get_x(point) * self.scale_factor
                y = self.get_y(point) * self.scale_factor

                if index == 0:
                    self.ctx.move_to(x, y)
                else:
                    self.ctx.line_to(x, y)

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
        self.ctx.set_font_size(1.5 * self.scale_factor)

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
        self.ctx.set_font_size(1.5 * self.scale_factor)
        self.ctx.move_to(0, 0)
        self.ctx.show_text("Voedselbos")

        self.ctx.restore()
