import { Feature } from 'ol'
import { Fill, Icon, Stroke, Style, Text } from 'ol/style'

import { MapStore, SettingStore } from '../stores'

// SVG elements for dots and pins
const getSvgUrl = (svgString: string) => {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`
}

const svgScale = 0.25
const dotSVG = (color: string, centerColor: string = 'rgba(0,0,0,0.3)') => {
    return getSvgUrl(
        `
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="128" height="128">
                <circle
                    fill="${color}"
                    fillOpacity="1"
                    stroke="#000000"
                    strokeOpacity="0.5"
                    strokeWidth="3"
                    cx="64"
                    cy="64"
                    r="30"
                />
                <circle fill="${centerColor}" cx="64" cy="64" r="15" />
            </svg>
            `
    )
}

const pinSVG = (
    colorOuter: string,
    colorInner: string,
    centerColor: string = 'rgba(0,0,0,0.3)'
) => {
    return getSvgUrl(
        `
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="128" height="128">
            <path
                fill="${colorOuter}"
                fillOpacity="1"
                stroke="#000000"
                strokeOpacity="0.5"
                strokeWidth="3"
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
                    12.801388,-3.62708 z"
            />
            <path
                fill="${colorInner}"
                fillOpacity="1"
                d="m 45.521425,84.824145 a 34.452763,33.540108 0 1 1 0.85866,0.167155"
                transform="matrix(0.97020484,0,0,1.0272058,-4.0587829,-5.7503824)"
            />
            <path
                fill="${centerColor}"
                d="m 57.079416,104.60778 a 34.203297,36.623341 0 1 1 0.852443,0.18252"
                transform="matrix(0.64629924,0,0,0.61681122,5.1261236,4.9013803)"
            />
        </svg>
        `
    )
}

// Open layers marker icons
const dot = new Icon({
    anchor: [0.5, 0.5],
    src: dotSVG('#f28705'),
    scale: svgScale,
})

const dotSelected = new Icon({
    anchor: [0.5, 0.5],
    src: dotSVG('#f28705', '#fff'),
    scale: svgScale,
})

const dotAlt = new Icon({
    anchor: [0.5, 0.5],
    src: dotSVG('#78a658'),
    scale: svgScale,
})

const dotAltSelected = new Icon({
    anchor: [0.5, 0.5],
    src: dotSVG('#78a658', '#fff'),
    scale: svgScale,
})

const dotDead = new Icon({
    anchor: [0.5, 0.5],
    src: dotSVG('#D93D04'),
    scale: svgScale,
})

const dotDeadSelected = new Icon({
    anchor: [0.5, 0.5],
    src: dotSVG('#D93D04', '#fff'),
    scale: svgScale,
})

const dotUnknown = new Icon({
    anchor: [0.5, 0.5],
    src: dotSVG('#aaa'),
    scale: svgScale,
})

const dotUnknownSelected = new Icon({
    anchor: [0.5, 0.5],
    src: dotSVG('#aaa', '#fff'),
    scale: svgScale,
})

const pin = new Icon({
    anchor: [0.5, 1],
    src: pinSVG('#f28705', '#be6900'),
    scale: svgScale,
})

const pinSelected = new Icon({
    anchor: [0.5, 1],
    src: pinSVG('#f28705', '#ffa63a', '#fff'),
    scale: svgScale,
})

const pinAlt = new Icon({
    anchor: [0.5, 1],
    src: pinSVG('#78a658', '#4d7343'),
    scale: svgScale,
})

const pinAltSelected = new Icon({
    anchor: [0.5, 1],
    src: pinSVG('#78a658', '#a1c786', '#fff'),
    scale: svgScale,
})

const pinDead = new Icon({
    anchor: [0.5, 1],
    src: pinSVG('#D93D04', '#B03000'),
    scale: svgScale,
})

const pinDeadSelected = new Icon({
    anchor: [0.5, 1],
    src: pinSVG('#D93D04', '#F9622A', '#fff'),
    scale: svgScale,
})

const pinUnknown = new Icon({
    anchor: [0.5, 1],
    src: pinSVG('#aaa', '#888'),
    scale: svgScale,
})

const pinUnknownSelected = new Icon({
    anchor: [0.5, 1],
    src: pinSVG('#aaa', '#ccc', '#fff'),
    scale: svgScale,
})

// Feature label styling
const nameStyle = (droneBase: boolean, opacity: number) =>
    new Text({
        textAlign: 'center',
        textBaseline: 'middle',
        text: '',
        fill: new Fill({
            color: droneBase ? `rgba(255,255,255,${opacity})` : `rgba(0,0,0,${opacity})`,
        }),
        stroke: new Stroke({
            color: droneBase ? `rgba(0,0,0,${opacity})` : `rgba(255,255,255,${opacity})`,
            width: 2.5,
        }),
        font: '14px sans-serif',
        offsetX: 0,
        offsetY: 15,
        placement: undefined,
        maxAngle: undefined,
        overflow: undefined,
        rotation: 0,
    })

const noteStyle = (droneBase: boolean) =>
    new Text({
        textAlign: 'center',
        textBaseline: 'middle',
        text: '',
        fill: new Fill({
            color: droneBase ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
        }),
        stroke: new Stroke({
            color: droneBase ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)',
            width: 2.5,
        }),
        font: '12px sans-serif',
        offsetX: 0,
        offsetY: 35,
        placement: undefined,
        maxAngle: undefined,
        overflow: undefined,
        rotation: 0,
    })

// Marker style depending on context
const getDotStyle = (
    isSelected: boolean,
    isDead: boolean,
    isUnknown: boolean,
    droneBase: boolean
) => {
    if (isDead) {
        return isSelected ? dotDeadSelected : dotDead
    } else if (isUnknown) {
        return isSelected ? dotUnknownSelected : dotUnknown
    } else {
        return isSelected ? (droneBase ? dotSelected : dotAltSelected) : droneBase ? dot : dotAlt
    }
}

const getPinStyle = (
    isSelected: boolean,
    isDead: boolean,
    isUnknown: boolean,
    droneBase: boolean
) => {
    if (isDead) {
        return isSelected ? pinDeadSelected : pinDead
    } else if (isUnknown) {
        return isSelected ? pinUnknownSelected : pinUnknown
    } else {
        return isSelected ? (droneBase ? pinSelected : pinAltSelected) : droneBase ? pin : pinAlt
    }
}

const sharedStyle = new Style() // Reusable container
const subtitleStyle = new Style() // Reusable container

export const styleFunction = (
    map: MapStore,
    settings: SettingStore,
    feature: Feature,
    resolution: number
) => {
    const speciesData = feature.getProperties()
    const nearZoom = resolution < 0.08

    const isSelected = feature.get('oid') === map.selectedFeature?.get('oid')
    const isUnknown = speciesData.name_nl === 'Onbekend'
    const droneBase = map.baseMap === 'drone'

    // Get the correct icon
    const icon = nearZoom
        ? getPinStyle(isSelected, speciesData.dead, isUnknown, droneBase)
        : getDotStyle(isSelected, speciesData.dead, isUnknown, droneBase)

    sharedStyle.setImage(icon)

    // Label logic
    const labelOpacity = nearZoom ? (resolution < 0.05 ? 1 : -40 * resolution + 3.4) : 0
    const labelStyle = nameStyle(droneBase, labelOpacity)

    if (nearZoom) {
        const text = speciesData.name_nl || speciesData.species
        labelStyle.setText(text)
    } else {
        labelStyle.setText('')
    }

    sharedStyle.setText(labelStyle)

    const styles = [sharedStyle]

    // Subtitle logic
    if (nearZoom && settings.authenticated && settings.showNotes && speciesData.notes) {
        const note = noteStyle(droneBase)
        note.setText(speciesData.notes)
        subtitleStyle.setText(note)
        styles.push(subtitleStyle)
    }

    return styles
}
