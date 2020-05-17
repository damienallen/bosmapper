import React, { useEffect, useRef } from 'react'
import { observer, MobXProviderContext } from 'mobx-react'
import { createUseStyles } from 'react-jss'

import OlMap from 'ol/Map'
import OlView from 'ol/View'
import OlLayerTile from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import GeoJSON from 'ol/format/GeoJSON'
import { Vector as VectorSource } from 'ol/source'
import { Vector as VectorLayer } from 'ol/layer'

import { styleFunction } from '../utilities/FeatureHelpers'

const useStores = () => {
    return React.useContext(MobXProviderContext)
}

const useStyles = createUseStyles({
    map: {
        height: '100%',
        zIndex: 100,
        background: '#000',

        '& .ol-zoom': {
            display: 'none'
        },

        '& .ol-control': {
            position: 'absolute',
            background: 'rgba(255,255,255,0.4)',
            borderRadius: 4,
            padding: 2,

            '& button': {
                display: 'block',
                margin: 1,
                padding: 0,
                color: '#fff',
                fontSize: '1.14em',
                fontWeight: 'bold',
                textDecoration: 'none',
                textTransform: 'none',
                textAlign: 'center',
                height: '1.375em',
                width: '1.375em',
                lineHeight: '0.4em',
                background: 'rgba(76, 112, 2, 0.8)',
                cursor: 'pointer'
            }
        },

        '& .ol-rotate': {
            display: 'none' // TODO: show/hide dynamically
        },

        '& .ol-attribution': {
            position: 'absolute',
            bottom: 0,
            left: 0,
            padding: 0,
            background: 'none',
            fontSize: '0.6em',
            textAlign: 'left',

            '& ul': {
                padding: 5,
                margin: 0,
                listStyleType: 'none',
                background: 'rgba(255,255,255,0.8)',
                borderRadius: '0 4px 0 0',
                '& li': {
                    display: 'inline-block'
                }
            },

            '& button': {
                display: 'none !important'
            }
        }
    }
})

export const MapCanvas: React.FC = observer(() => {

    const mapEl: any = useRef<HTMLDivElement>()
    const classes = useStyles()
    const { map } = useStores()

    // Load GeoJSON features
    const updatedSource = new VectorSource({
        features: (new GeoJSON()).readFeatures(map.filteredFeatures)
    })

    const vectorLayer = new VectorLayer({
        source: updatedSource,
        style: styleFunction,
        updateWhileAnimating: true,
        updateWhileInteracting: true
    })

    const olMap = new OlMap({
        layers: [
            new OlLayerTile({
                source: new XYZ({
                    url: 'https://voedselbos-tiles.ams3.digitaloceanspaces.com/hybrid/{z}/{x}/{y}.png'
                })
            }),
            vectorLayer
        ],
        view: new OlView({
            center: [493358, 6783574],
            maxZoom: 24,
            minZoom: 18,
            zoom: 20,
            rotation: -0.945
        })
    })

    useEffect(() => {
        console.log('Loading map canvas')
        olMap.setTarget(mapEl.current)

        setTimeout(() => {
            olMap.updateSize()
        }, 500)

        return () => {
            console.log('Unloading map canvas...')
            olMap.setTarget(undefined)
        }
    })

    return (
        <div className={classes.map} ref={mapEl} />
    )
})
