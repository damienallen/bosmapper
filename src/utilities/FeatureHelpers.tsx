import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style'
import * as speciesJson from '../assets/voedselbos_species.json'

interface SpeciesDict {
    [key: string]: any
}

export const getSpeciesDict = () => {
    let dict: any = {}
    speciesJson.species.forEach((item: any) => {
        dict[item.species] = item
    })
    return dict
}
export const speciesDict: SpeciesDict = getSpeciesDict()

export const getSpeciesData = (name: string) => {
    if (name in speciesDict) {
        return speciesDict[name]
    } else {
        console.warn(`Unable to find species '${name}'`)
        return null
    }
}

const imageStyle = new CircleStyle({
    radius: 1,
    fill: new Fill({ color: 'rgba(76, 112, 2, 0.5)' }),
    stroke: new Stroke({ color: 'rgba(37, 54, 2, 1)', width: 1 })
})

interface StyleDict {
    [key: string]: Style
}

const featureStyles: StyleDict = {
    'Point': new Style({
        image: imageStyle,
        text: new Text({
            textAlign: 'center',
            textBaseline: 'middle',
            text: '',
            fill: new Fill({ color: '#ffffff' }),
            stroke: new Stroke({
                color: '#000000',
                width: 0.5
            }),
            offsetX: 0,
            offsetY: 0,
            placement: undefined,
            maxAngle: undefined,
            overflow: undefined,
            rotation: 0
        })
    }),
    'LineString': new Style({
        stroke: new Stroke({
            color: 'green',
            width: 1
        })
    }),
    'MultiLineString': new Style({
        stroke: new Stroke({
            color: 'green',
            width: 1
        })
    }),
    'MultiPoint': new Style({
        image: imageStyle
    }),
    'MultiPolygon': new Style({
        stroke: new Stroke({
            color: 'yellow',
            width: 1
        }),
        fill: new Fill({
            color: 'rgba(255, 255, 0, 0.1)'
        })
    }),
    'Polygon': new Style({
        stroke: new Stroke({
            color: 'blue',
            lineDash: [4],
            width: 3
        }),
        fill: new Fill({
            color: 'rgba(0, 0, 255, 0.1)'
        })
    }),
    'GeometryCollection': new Style({
        stroke: new Stroke({
            color: 'magenta',
            width: 2
        }),
        fill: new Fill({
            color: 'magenta'
        }),
        image: new CircleStyle({
            radius: 10,
            fill: undefined,
            stroke: new Stroke({
                color: 'magenta'
            })
        })
    }),
    'Circle': new Style({
        stroke: new Stroke({
            color: 'red',
            width: 2
        }),
        fill: new Fill({
            color: 'rgba(255,0,0,0.2)'
        })
    })
}

export const styleFunction = (feature: any, resolution: number) => {
    let featureStyle: any = featureStyles[feature.getGeometry().getType()]
    let speciesName = feature.values_.species
    let speciesData = getSpeciesData(speciesName)
    let radius = speciesData.width ? speciesData.width / 2 : 1

    // Fixed radius
    featureStyle.getImage().setRadius(radius / resolution)

    if (!speciesData.width) console.log(speciesName)
    if (speciesData.width / resolution > 50 || speciesData.height / resolution > 100) {
        featureStyle.getText().setText(speciesData.abbr)
    } else {
        featureStyle.getText().setText(null)
    }

    return featureStyle
}
