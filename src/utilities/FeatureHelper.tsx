import { Fill, Icon, Stroke, Style, Text } from 'ol/style'
import pinIcon from '../assets/pin_normal.svg'
import pinIconSelected from '../assets/pin_selected.svg'
import pinIconUnknown from '../assets/pin_unknown.svg'
import pinIconUnknownSelected from '../assets/pin_unknown_selected.svg'

import { RootStore } from '../stores'

const pinScale = 0.25

const pin = new Icon({
    anchor: [0.5, 1],
    src: pinIcon,
    scale: pinScale
})

const pinSelected = new Icon({
    anchor: [0.5, 1],
    src: pinIconSelected,
    scale: pinScale
})

const pinUnknown = new Icon({
    anchor: [0.5, 1],
    src: pinIconUnknown,
    scale: pinScale
})

const pinUnknownSelected = new Icon({
    anchor: [0.5, 1],
    src: pinIconUnknownSelected,
    scale: pinScale
})

const textStyle = (baseMap: string) => (new Text({
    textAlign: 'center',
    textBaseline: 'middle',
    text: '',
    fill: new Fill({
        color: baseMap === 'drone' ? '#ffffff' : '#000000'
    }),
    stroke: new Stroke({
        color: baseMap === 'drone' ? '#000000' : '#ffffff',
        width: 1.5
    }),
    font: '16px sans-serif',
    offsetX: 0,
    offsetY: 15,
    placement: undefined,
    maxAngle: undefined,
    overflow: undefined,
    rotation: 0
}))

const getPinStyle = (isSelected: boolean, nameNL: string) => {
    if (nameNL === 'Onbekend') {
        return isSelected ? pinUnknownSelected : pinUnknown
    } else {
        return isSelected ? pinSelected : pin
    }
}

export const styleFunction = (store: RootStore, feature: any, resolution: number) => {
    const speciesData = feature.getProperties()
    const isSelected = feature === store.map.selectedFeature
    const pinStyle = getPinStyle(isSelected, speciesData.name_nl)
    const featureStyle: Style = new Style({
        image: pinStyle,
        text: textStyle(store.map.baseMap)
    })

    // Display text based at high zoom level
    if (resolution < 0.07) {
        const text = speciesData.name_nl ? speciesData.name_nl : speciesData.species
        featureStyle.getText().setText(text)
    } else {
        featureStyle.getText().setText(undefined)
    }

    // Adjust opacity if selected
    return [featureStyle]
}
