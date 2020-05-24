import { Fill, Icon, Stroke, Style, Text } from 'ol/style'
import pinIcon from '../assets/pin.svg'
import pinIconSelected from '../assets/pin_selected.svg'

import { MapStore } from '../stores'

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


export const styleFunction = (map: MapStore, feature: any, resolution: number) => {
    const speciesData = feature.getProperties()
    const pinStyle = feature === map.selectedFeature ? pinSelected : pin
    const featureStyle: Style = new Style({
        image: pinStyle,
        text: textStyle
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
