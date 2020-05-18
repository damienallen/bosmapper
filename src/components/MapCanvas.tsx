import axios from 'axios'
import React, { useEffect, useRef } from 'react'
import { reaction, IReactionDisposer } from 'mobx'
import { MobXProviderContext } from 'mobx-react'
import { createUseStyles } from 'react-jss'
import hash from 'object-hash'

import OlMap from 'ol/Map'
import OlView from 'ol/View'
import OlLayerTile from 'ol/layer/Tile'
import OlLayerGroup from 'ol/layer/Group'
import XYZ from 'ol/source/XYZ'
import GeoJSON from 'ol/format/GeoJSON'
import { Vector as VectorSource } from 'ol/source'
import { Vector as VectorLayer } from 'ol/layer'

import { styleFunction } from '../utilities/FeatureHelpers'
import { MapBrowserEvent } from 'ol'


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
    const { map, settings, ui } = useStores()
    const classes = useStyles()

    // Load GeoJSON features
    const treeFeatures = new VectorLayer({
        source: new VectorSource(),
        style: styleFunction,
        updateWhileAnimating: true,
        updateWhileInteracting: true
    })

    // Set up map
    const olView = new OlView({
        center: [493358, 6783574],
        maxZoom: 22,
        minZoom: 18,
        zoom: 19.5,
        rotation: -0.948,
        extent: [493263, 6783483, 493457, 6783667] // 493249,493472,6783473,6783677 [EPSG:3857]
    })

    const olMap = new OlMap({
        layers: getLayers(map.baseMap, treeFeatures),
        view: olView
    })

    // Drag handling
    olMap.on('moveend', (event: any) => {
        const mapCenter = olMap.getView().getCenter()
        map.setCenter(mapCenter)
    })

    // Click handling
    olMap.on('click', (event: MapBrowserEvent) => {

        // Hide details if open
        ui.setShowTreeDetails(false)
        map.setSelectedFeature(null)

        olMap.forEachFeatureAtPixel(event.pixel, (feature: any, layer: any) => {
            // console.log(feature)
            map.setSelectedFeature(feature)
            ui.setShowTreeDetails(true)
        })
    })

    // Feature fetching from server
    const getFeatures = () => {
        axios.get(`${settings.host}/trees/`)
            .then((response) => {
                const featuresHash = hash(response.data)
                if (featuresHash !== map.featuresHash) {
                    console.debug(response)

                    map.setFeaturesHash(featuresHash)
                    map.setFeaturesGeoJson(response.data)
                } else {
                    console.debug('Features not updated')
                }

            })
            .catch((error) => {
                console.error(error)
                ui.setToastText('Geen verbinding met server')
            })
    }

    useEffect(() => {
        console.log('Loading map canvas')
        olMap.setTarget(mapEl.current)

        // Fetch features
        getFeatures()
        const featureFetcher = setInterval(getFeatures, 10000)

        // Set up reactions
        const disposer = [
            reaction(
                () => map.needsUpdate,
                (needsUpdate: boolean) => {
                    if (needsUpdate) {
                        getFeatures()
                        map.setNeedsUpdate(false)
                    }
                }
            ),
            reaction(
                () => map.centerOnSelected,
                (centerOnSelected: boolean) => {
                    if (centerOnSelected && map.selectedFeature) {
                        const featureCoords = map.selectedFeature.getGeometry().getCoordinates()
                        olView.setCenter(featureCoords)
                        map.setCenterOnSelected(false)
                    }
                }
            ),
            reaction(
                () => map.baseMap,
                (baseMap: string) => olMap.setLayerGroup(getLayers(baseMap, treeFeatures))
            ),
            reaction(
                () => map.filteredFeatures,
                (filteredFeatures: any) => {
                    if (map.filteredFeatures.features) {
                        treeFeatures.setSource(new VectorSource({
                            features: (new GeoJSON()).readFeatures(filteredFeatures)
                        }))
                    } else {
                        console.warn('No features found')
                    }
                }
            ),
        ]

        setTimeout(() => {
            olMap.updateSize()
        }, 500)

        return () => {
            console.log('Unloading map canvas...')
            olMap.setTarget(undefined)
            clearInterval(featureFetcher)
            disposer.forEach((dispose: IReactionDisposer) => dispose())
        }
    })

    return (
        <div className={classes.mapCanvas} ref={mapEl} />
    )
}
