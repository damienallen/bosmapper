import { Fill, Stroke, Style } from 'ol/style'

const circleStyle = new Style({
    fill: new Fill({ color: '#eaeaea' }),
    zIndex: 20,
})

const vegNoWallStyle = new Style({
    fill: new Fill({ color: '#ddd' }),
    zIndex: 20,
})

const boundaryFill = new Fill({ color: '#efefef' })
const vegetationFill = new Fill({ color: '#ddd' })
const brickFill = new Fill({ color: '#999' })
const buildingsFill = new Fill({ color: '#cedce5' })

const sharedStroke = new Stroke({ color: '#999' })
const dynaStyle = new Style()
const dynaStrokeStyle = new Style()

const getTypeStyle = (vectorType: string, resolution: number) => {
    const buildingTypes = ['greenhouse', 'bee_hives']

    if (vectorType === 'circle') return circleStyle
    if (vectorType === 'vegetation_no_wall') return vegNoWallStyle

    if (vectorType === 'boundary') {
        sharedStroke.setWidth(0.4 / resolution)

        dynaStyle.setFill(boundaryFill)
        dynaStyle.setZIndex(10)

        dynaStrokeStyle.setStroke(sharedStroke)
        dynaStrokeStyle.setZIndex(80)

        return [dynaStyle, dynaStrokeStyle]
    }

    if (
        vectorType === 'vegetation' ||
        vectorType === 'wall' ||
        buildingTypes.includes(vectorType)
    ) {
        sharedStroke.setWidth(0.2 / resolution)

        let fill = vegetationFill
        let z = 20

        if (vectorType === 'wall') {
            fill = brickFill
            z = 40
        }
        if (buildingTypes.includes(vectorType)) {
            fill = buildingsFill
            z = 50
        }

        dynaStyle.setFill(fill)
        dynaStyle.setStroke(sharedStroke)
        dynaStyle.setZIndex(z)
        return dynaStyle
    }

    return undefined
}

export const vectorStyleFunction = (isDrone: boolean, feature: any, resolution: number) => {
    if (isDrone) return undefined
    const type = feature.get('type')
    return getTypeStyle(type, resolution)
}
