import React, { useEffect, useRef } from 'react'
import { autorun } from 'mobx'
import { observer, MobXProviderContext } from 'mobx-react'
import { createUseStyles } from 'react-jss'

import OlMap from 'ol/Map'
import OlView from 'ol/View'
import OlLayerTile from 'ol/layer/Tile'
import OlLayerGroup from 'ol/layer/Group'
import XYZ from 'ol/source/XYZ'
import GeoJSON from 'ol/format/GeoJSON'
import { Vector as VectorSource } from 'ol/source'
import { Vector as VectorLayer } from 'ol/layer'

import { styleFunction } from '../utilities/FeatureHelpers'

const useStores = () => {
    return React.useContext(MobXProviderContext)
}

const useStyles = createUseStyles({
    mapCanvas: {
        height: '100%',
        zIndex: 100,
        background: 'none',

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

const xyzUrl = (baseMap: string) => (
    `https://voedselbos-tiles.ams3.digitaloceanspaces.com/${baseMap}/{z}/{x}/{y}.png`
)

const getLayers = (baseMap: string, features: VectorLayer) => (
    new OlLayerGroup({
        layers: [
            new OlLayerTile({
                source: new XYZ({
                    url: xyzUrl(baseMap)
                })
            }),
            features
        ]
    })
)

export const MapCanvas: React.FC = () => {

    const mapEl: any = useRef<HTMLDivElement>()
    const { map } = useStores()
    const classes = useStyles()

    // Load GeoJSON features
    const updatedSource = new VectorSource({
        features: (new GeoJSON()).readFeatures(map.filteredFeatures)
    })

    const treeFeatures = new VectorLayer({
        source: updatedSource,
        style: styleFunction,
        updateWhileAnimating: true,
        updateWhileInteracting: true
    })

    const olMap = new OlMap({
        layers: getLayers(map.baseMap, treeFeatures),
        view: new OlView({
            center: [493358, 6783574],
            maxZoom: 23,
            minZoom: 18,
            zoom: 19.5,
            rotation: -0.948,
            extent: [493263, 6783488, 493457, 6783662] // 493249,493472,6783473,6783677 [EPSG:3857]
        })
    })

    useEffect(() => {
        console.log('Loading map canvas')
        olMap.setTarget(mapEl.current)

        // Set up autorun functions
        const autorunDisposer = autorun(() => {
            console.log(getLayers(map.baseMap, treeFeatures))
            olMap.setLayerGroup(getLayers(map.baseMap, treeFeatures))
        })

        setTimeout(() => {
            olMap.updateSize()
        }, 500)

        return () => {
            console.log('Unloading map canvas...')
            olMap.setTarget(undefined)
            autorunDisposer()
        }
    })

    return (
        <div className={classes.mapCanvas} ref={mapEl} />
    )
}
