import { Circle as CircleStyle, Fill, Icon, Stroke, Style, Text } from 'ol/style'
import mapPin from '../assets/pin_green.svg'


const pin = new Icon({
    anchor: [0.5, 1],
    src: mapPin,
    scale: 0.25
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
        image: pin,
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
        image: pin
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
    const featureStyle: any = featureStyles[feature.getGeometry().getType()]
    const speciesData = feature.values_

    // Display text based at high zoom level
    if (resolution < 0.07) {
        const text = speciesData.name_nl ? speciesData.name_nl : speciesData.species
        featureStyle.getText().setText(text)
    } else {
        featureStyle.getText().setText(null)
    }

    // Adjust opacity if selected
    return [featureStyle]
}
