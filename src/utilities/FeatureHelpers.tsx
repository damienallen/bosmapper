import { Circle as CircleStyle, Fill, Icon, Stroke, Style, Text } from 'ol/style'
import * as speciesJson from '../assets/voedselbos_species.json'
import mapPin from '../assets/pin.png'

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

const pin = new Style({
    image: new Icon({
        anchor: [0.5, 1],
        src: mapPin,
        scale: 0.15
    })
})

const treeStyle = new CircleStyle({
    radius: 1,
    fill: new Fill({ color: 'rgba(76, 112, 2, 0.5)' }),
    stroke: new Stroke({ color: 'rgba(37, 54, 2, 1)', width: 1.5 })
})

const textStyle = new Text({
    textAlign: 'center',
    textBaseline: 'middle',
    text: '',
    fill: new Fill({ color: '#ffffff' }),
    stroke: new Stroke({
        color: '#000000',
        width: 0.5
    }),
    font: '18px sans-serif',
    offsetX: 0,
    offsetY: 15,
    placement: undefined,
    maxAngle: undefined,
    overflow: undefined,
    rotation: 0
})

interface StyleDict {
    [key: string]: Style
}

const featureStyles: StyleDict = {
    'Point': new Style({
        image: treeStyle,
        text: textStyle
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
        image: treeStyle
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

    // Display text based on tree height & crown width
    if (resolution < 0.06) {
        let text = speciesData.name_nl ? speciesData.name_nl : speciesData.abbr
        featureStyle.getText().setText(text)
    } else {
        featureStyle.getText().setText(null)
    }

    return [featureStyle, pin.clone()]
}
