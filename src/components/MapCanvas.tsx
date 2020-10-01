import axios, { AxiosResponse } from 'axios'
import React, { useEffect, useRef } from 'react'
import { reaction, IReactionDisposer } from 'mobx'
import { MobXProviderContext } from 'mobx-react'
import { createUseStyles } from 'react-jss'
import hash from 'object-hash'

import { MapBrowserEvent } from 'ol'
import OlMap from 'ol/Map'
import OlView from 'ol/View'
import OlLayerTile from 'ol/layer/Tile'
import OlLayerGroup from 'ol/layer/Group'
import XYZ from 'ol/source/XYZ'
import GeoJSON from 'ol/format/GeoJSON'
import { Vector as VectorSource } from 'ol/source'
import { Vector as VectorLayer } from 'ol/layer'

import { styleFunction } from '../utilities/FeatureHelper'
import focusIcon from '../assets/focus.svg'


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
    const { map, root, settings, ui } = useStores()
    const classes = useStyles()

    // Load GeoJSON features
    const treeFeatures = new VectorLayer({
        source: new VectorSource(),
        style: (feature: any, resolution: number) => (
            styleFunction(root, feature, resolution)
        ),
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
        extent: [493243, 6783460, 493477, 6783690] // 493249,493472,6783473,6783677 [EPSG:3857]
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
            map.setSelectedFeature(feature)
            ui.setShowTreeDetails(true)
        })
    })

    // Feature fetching from server
    const getFeatures = () => {
        axios.get(`${settings.host}/trees/`)
            .then((response: AxiosResponse) => {
                // Check against hash of existing features
                const featuresHash = hash(response.data)

                if (featuresHash !== map.featuresHash) {
                    map.setFeaturesHash(featuresHash)
                    map.setFeaturesGeoJson(response.data)
                    console.log(`Loaded ${response.data.features.length} features at ${new Date().toISOString()}`)

                    // Update selected feature if necesary
                    if (map.selectedFeature) {
                        const oid = map.selectedFeature.get('oid')
                        const newFeatureEntry = treeFeatures.getSource().getFeatures().find(
                            (feature: any) => (feature.get('oid') === oid)
                        )
                        if (newFeatureEntry) {
                            map.setSelectedFeature(newFeatureEntry)
                        } else {
                            console.warn(`Unable to find feature '${oid} in updated feature list`)
                        }
                    }
                } else {
                    console.debug('Features not updated')
                }

            })
            .catch((error) => {
                console.error(error.response)
                ui.setToastText('Geen verbinding met server')
            })
    }

    useEffect(() => {
        console.log('Loading map canvas')
        olMap.setTarget(mapEl.current)

        // Fetch features
        console.log(`Connecting to host '${settings.host}'`)
        getFeatures()
        const featureFetcher = setInterval(getFeatures, 15000)

        // Cache focus icon
        new Image().src = focusIcon

        // Set up reactions
        const disposer = [
            reaction(() => map.needsRefresh, () => {
                if (map.needsRefresh) {
                    treeFeatures.changed()
                    map.setNeedsRefresh(false)
                }
            }),
            // TODO: use needsRefresh for these 
            reaction(() => settings.showDead, () => treeFeatures.changed()),
            reaction(() => settings.showNotes, () => treeFeatures.changed()),
            reaction(() => map.baseMap, () => treeFeatures.changed()),
            reaction(() => map.selectedFeature, (selectedFeature: any) => {
                treeFeatures.changed()
                if (selectedFeature && olView.getZoom() > 20) {
                    olView.animate({
                        center: selectedFeature.getGeometry().getCoordinates(),
                        duration: 500
                    })
                }
            }),
            reaction(
                () => map.needsUpdate,
                (needsUpdate: boolean) => {
                    if (needsUpdate) {
                        setTimeout(() => getFeatures(), 100)
                        map.setNeedsUpdate(false)
                    }
                }
            ),
            reaction(
                () => map.centerOnSelected,
                (centerOnSelected: boolean) => {
                    if (centerOnSelected && map.selectedFeature) {
                        const featureCoords = map.selectedFeature.getGeometry().getCoordinates()
                        olView.animate({
                            center: featureCoords,
                            zoom: Math.max(21, olView.getZoom()),
                            duration: 200
                        })
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

                        // Toggle selected feature on first load (cache feature)
                        if (map.firstLoad) {
                            map.setSelectedFeature(treeFeatures.getSource().getFeatures()[0])
                            setTimeout(() => map.setSelectedFeature(null), 100)
                        }

                    } else {
                        console.warn('No features found')
                    }
                }
            )
        ]

        // Prevent map loading issues by forcing resize
        const waitForMap = setInterval(() => olMap.updateSize(), 100)
        olMap.once('postcompose', () => {
            clearInterval(waitForMap)
        })

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
