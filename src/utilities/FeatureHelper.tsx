
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { Fill, Icon, Stroke, Style, Text } from 'ol/style'

import { RootStore } from '../stores'

// SVG elements for dots and pins
const svgScale = 0.25
const dotSVG = (color: string, centerColor: string = '000000') => {
    return 'data:image/svg+xml;utf8,' + ReactDOMServer.renderToString(
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="128" height="128">
            <circle fill={'%23' + color} fillOpacity="1" stroke="%23000000" strokeOpacity="0.5" strokeWidth="3"
                cx="64" cy="64" r="30" />
            <circle fill={'%23' + centerColor} fillOpacity="0.3" cx="64" cy="64" r="15" />
        </svg>
    )
}

const pinSVG = (colorOuter: string, colorInner: string, centerColor: string = '000000') => {
    return 'data:image/svg+xml;utf8,' + ReactDOMServer.renderToString(
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="128" height="128">
            <path fill={'%23' + colorOuter} fillOpacity="1" stroke="%23000000" strokeOpacity="0.5" strokeWidth="3"
                d="M 46.977003,126.64334 C 46.693972,125.95584 40.813862,120.20567
                    36.603071,114.98067 11.655836,81.858372 -16.158365,51.082905
                    16.319943,13.682837 30.700637,-0.21083367 48.43303,-1.0034227
                    66.662563,5.4726973 117.9922,35.174601 80.828906,83.627914
                    56.427079,115.48067 l -9.450076,11.16267 z
                    M 62.417383,75.872046 C 96.654166,51.387445 70.185413,4.2391813
                    32.569429,19.913013 21.585178,25.769872 16.134954,35.960547
                    15.944071,47.980664 c -0.524495,11.693153 5.685418,21.471037
                    15.526227,27.460808 7.055481,3.840074 10.157178,4.533661
                    18.145697,4.057654 5.177622,-0.308516 8.161127,-1.153847
                    12.801388,-3.62708 z" />
            <path fill={'%23' + colorInner} fillOpacity="1"
                d="m 45.521425,84.824145 a 34.452763,33.540108 0 1 1 0.85866,0.167155"
                transform="matrix(0.97020484,0,0,1.0272058,-4.0587829,-5.7503824)" />
            <path fill={'%23' + centerColor} fillOpacity="0.3"
                d="m 57.079416,104.60778 a 34.203297,36.623341 0 1 1 0.852443,0.18252"
                transform="matrix(0.64629924,0,0,0.61681122,5.1261236,4.9013803)" />
        </svg>
    )
}

// Open layers marker icons
const dot = new Icon({
    anchor: [0.5, 0.5],
    src: dotSVG('f28705'),
    scale: svgScale
})

const dotSelected = new Icon({
    anchor: [0.5, 0.5],
    src: dotSVG('f28705', 'ffffff'),
    scale: svgScale
})

const dotAlt = new Icon({
    anchor: [0.5, 0.5],
    src: dotSVG('78a658'),
    scale: svgScale
})

const dotAltSelected = new Icon({
    anchor: [0.5, 0.5],
    src: dotSVG('78a658', 'ffffff'),
    scale: svgScale
})

const dotUnknown = new Icon({
    anchor: [0.5, 0.5],
    src: dotSVG('aaaaaa'),
    scale: svgScale
})

const dotUnknownSelected = new Icon({
    anchor: [0.5, 0.5],
    src: dotSVG('aaaaaa', 'ffffff'),
    scale: svgScale
})

const pin = new Icon({
    anchor: [0.5, 1],
    src: pinSVG('f28705', 'be6900'),
    scale: svgScale
})

const pinSelected = new Icon({
    anchor: [0.5, 1],
    src: pinSVG('f28705', 'ffa63a', 'fff'),
    scale: svgScale
})

const pinAlt = new Icon({
    anchor: [0.5, 1],
    src: pinSVG('78a658', '4d7343'),
    scale: svgScale
})

const pinAltSelected = new Icon({
    anchor: [0.5, 1],
    src: pinSVG('78a658', 'a1c786', 'fff'),
    scale: svgScale
})


const pinUnknown = new Icon({
    anchor: [0.5, 1],
    src: pinSVG('aaa', '888'),
    scale: svgScale
})

const pinUnknownSelected = new Icon({
    anchor: [0.5, 1],
    src: pinSVG('aaa', 'ccc', 'fff'),
    scale: svgScale
})

// Feature label styling
const textStyle = (droneBase: boolean) => (new Text({
    textAlign: 'center',
    textBaseline: 'middle',
    text: '',
    fill: new Fill({
        color: droneBase ? '#ffffff' : '#000000'
    }),
    stroke: new Stroke({
        color: droneBase ? '#000000' : '#ffffff',
        width: 2.5
    }),
    font: '16px sans-serif',
    offsetX: 0,
    offsetY: 15,
    placement: undefined,
    maxAngle: undefined,
    overflow: undefined,
    rotation: 0
}))

// Marker style depending on context
const getDotStyle = (isSelected: boolean, isUnknown: boolean, droneBase: boolean) => {
    if (isUnknown) {
        return isSelected ? dotUnknownSelected : dotUnknown
    } else {
        return isSelected ?
            (droneBase ? dotSelected : dotAltSelected) :
            (droneBase ? dot : dotAlt)
    }
}

const getPinStyle = (isSelected: boolean, isUnknown: boolean, droneBase: boolean) => {
    if (isUnknown) {
        return isSelected ? pinUnknownSelected : pinUnknown
    } else {
        return isSelected ?
            (droneBase ? pinSelected : pinAltSelected) :
            (droneBase ? pin : pinAlt)
    }
}

export const styleFunction = (store: RootStore, feature: any, resolution: number) => {
    const nearZoom = resolution < 0.08
    const speciesData = feature.getProperties()

    const isSelected = feature === store.map.selectedFeature
    const isUnknown = speciesData.name_nl === 'Onbekend'
    const droneBase = store.map.baseMap === 'drone'

    const pinStyle = nearZoom ?
        getPinStyle(isSelected, isUnknown, droneBase) :
        getDotStyle(isSelected, isUnknown, droneBase)

    const featureStyle: Style = new Style({
        image: pinStyle,
        text: textStyle(droneBase)
    })

    // Display text based at high zoom level
    if (nearZoom) {
        const text = speciesData.name_nl ? speciesData.name_nl : speciesData.species
        featureStyle.getText().setText(text)
    } else {
        featureStyle.getText().setText(undefined)
    }

    // Adjust opacity if selected
    return [featureStyle]
}
