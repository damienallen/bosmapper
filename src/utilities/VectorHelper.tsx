import { Fill, Stroke, Style } from 'ol/style'

import vectorGeoJson from '../assets/vector_base.json'


export const vectorFeatures = vectorGeoJson


// Boundary
const boundaryFill = new Fill({
    color: '#efefef'
})

const boundaryStroke = (resolution: number) => {
    return new Stroke({
        color: '#999',
        width: 0.4 / resolution
    })
}

// Vegetation
const vegetationFill = new Fill({
    color: '#ddd'
})

const brickFill = new Fill({
    color: '#999'
})

const brickStroke = (resolution: number) => {
    return new Stroke({
        color: '#999',
        width: 0.2 / resolution
    })
}

// Buildings
const buildingsFill = new Fill({
    color: '#cedce5'
})

// Misc
const circleFill = new Fill({
    color: '#eaeaea'
})


const getTypeStyle = (vectorType: string, resolution: number) => {
    const buildingTypes = ['greenhouse', 'bee_hives']
    if (vectorType === 'boundary') {
        return [
            new Style({
                fill: boundaryFill,
                zIndex: 10
            }),
            new Style({
                stroke: boundaryStroke(resolution),
                zIndex: 80
            })
        ]
    } else if (vectorType === 'vegetation') {
        return new Style({
            stroke: brickStroke(resolution),
            fill: vegetationFill,
            zIndex: 20
        })
    } else if (vectorType === 'vegetation_no_wall') {
        return new Style({
            fill: vegetationFill,
            zIndex: 20
        })
    } else if (vectorType === 'circle') {
        return new Style({
            fill: circleFill,
            zIndex: 20
        })
    } else if (vectorType === 'wall') {
        return new Style({
            stroke: brickStroke(resolution),
            fill: brickFill,
            zIndex: 40
        })
    } else if (buildingTypes.includes(vectorType)) {
        return new Style({
            stroke: brickStroke(resolution),
            fill: buildingsFill,
            zIndex: 50
        })
    } else {
        return []
    }
}

export const vectorStyleFunction = (
    isDrone: boolean,
    feature: any,
    resolution: number
) => {
    const featureProps = feature.getProperties()
    return !isDrone ? getTypeStyle(featureProps.type, resolution) : []
}
