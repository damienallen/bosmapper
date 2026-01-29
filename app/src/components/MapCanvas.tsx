import { IReactionDisposer, reaction } from 'mobx'
import hash from 'object-hash'
import { MapBrowserEvent } from 'ol'
import GeoJSON from 'ol/format/GeoJSON'
import { Vector as VectorLayer } from 'ol/layer'
import OlLayerGroup from 'ol/layer/Group'
import OlLayerTile from 'ol/layer/Tile'
import OlMap from 'ol/Map'
import { Vector as VectorSource } from 'ol/source'
import XYZ from 'ol/source/XYZ'
import OlView from 'ol/View'
import React, { useEffect, useRef } from 'react'
import { createUseStyles } from 'react-jss'
import focusIcon from '../assets/focus.svg'
import vectorFeatures from '../assets/vector_base.json'
import { useStores } from '../stores'
import { styleFunction } from '../utilities/FeatureHelper'
import { vectorStyleFunction } from '../utilities/VectorHelper'

const useStyles = createUseStyles({
    mapCanvas: {
        height: '100%',
        zIndex: 100,
        background: 'none',

        '& .ol-zoom': {
            display: 'none',
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
                cursor: 'pointer',
            },
        },

        '& .ol-rotate': {
            display: 'none', // TODO: show/hide dynamically
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
                    display: 'inline-block',
                },
            },

            '& button': {
                display: 'none !important',
            },
        },
    },
})

const baseUrl = 'https://bosmapper.fsn1.your-objectstorage.com'
const droneUrl = `${baseUrl}/drone/v4/{z}/{x}/{y}.png`
const cartigoUrl = `${baseUrl}/cartigo/light/{z}/{x}/{y}.png`

const getLayers = (isDrone: boolean, features: VectorLayer, vectorFeatures: VectorLayer) => {
    return new OlLayerGroup({
        layers: isDrone
            ? [
                  new OlLayerTile({
                      source: new XYZ({
                          url: droneUrl,
                      }),
                  }),
                  vectorFeatures,
                  features,
              ]
            : [
                  new OlLayerTile({
                      source: new XYZ({
                          url: cartigoUrl,
                      }),
                  }),
                  vectorFeatures,
                  features,
              ],
    })
}

export const MapCanvas: React.FC = () => {
    const mapEl: any = useRef<HTMLDivElement>()
    const { map, settings, ui } = useStores()
    const classes = useStyles()

    // Load GeoJSON features
    const treeLayer = new VectorLayer({
        source: new VectorSource(),
        style: (feature: any, resolution: number) =>
            styleFunction(map, settings, feature, resolution),
        updateWhileAnimating: true,
        updateWhileInteracting: true,
    })

    const vectorLayer = new VectorLayer({
        source: new VectorSource({
            features: new GeoJSON().readFeatures(vectorFeatures),
        }),
        style: (feature: any, resolution: number) =>
            vectorStyleFunction(map.isDrone, feature, resolution),
        className: 'ol-layer vector-base',
        updateWhileAnimating: true,
        updateWhileInteracting: true,
    })

    // Set up map (EPSG:3857)
    const zoom = window.innerWidth > 980 ? 21.5 : 19.5
    const olView = new OlView({
        center: [493358, 6783574],
        maxZoom: 23,
        minZoom: 18,
        zoom: zoom,
        rotation: -0.948,
        extent: [493050, 6783250, 493850, 6784085],
    })

    const olMap = new OlMap({
        layers: getLayers(map.isDrone, treeLayer, vectorLayer),
        view: olView,
    })

    // Drag handling
    olMap.on('moveend', () => {
        const mapCenter = olMap.getView().getCenter()
        if (mapCenter) map.setCenter(mapCenter)
    })

    // Click handling
    olMap.on('click', (event: MapBrowserEvent) => {
        // Hide details if open
        ui.setShowTreeDetails(false)
        map.setSelectedFeature(undefined)

        olMap.forEachFeatureAtPixel(event.pixel, (feature: any, layer: any) => {
            if (!layer.className_.includes('vector-base')) {
                map.setSelectedFeature(feature)
                ui.setShowTreeDetails(true)
            }
        })
    })

    // Feature fetching from server
    const getFeatures = () => {
        fetch(`${settings.host}/trees/`)
            .then(async (response) => {
                if (!response.ok) throw new Error(await response.text())
                const data = await response.json()
                // Check against hash of existing features
                const featuresHash = hash(data)

                if (featuresHash !== map.featuresHash) {
                    map.setFeaturesHash(featuresHash)
                    map.setFeaturesGeoJson(data)
                    console.log(
                        `Loaded ${data.features.length} features at ${new Date().toISOString()}`
                    )

                    // Update selected feature if necesary
                    if (map.selectedFeature) {
                        const oid = map.selectedId
                        const newFeatureEntry = treeLayer
                            .getSource()
                            .getFeatures()
                            .find((feature: any) => feature.get('oid') === oid)
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
                console.error(error)
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
            reaction(
                () => map.needsRefresh,
                () => {
                    if (map.needsRefresh) {
                        treeLayer.changed()
                        map.setNeedsRefresh(false)
                    }
                }
            ),
            // TODO: use needsRefresh for these
            reaction(
                () => settings.showDead,
                () => treeLayer.changed()
            ),
            reaction(
                () => settings.showNotes,
                () => treeLayer.changed()
            ),
            reaction(
                () => map.baseMap,
                () => {
                    treeLayer.changed()
                    vectorLayer.changed()
                }
            ),
            reaction(
                () => map.selectedFeature,
                (selectedFeature: any) => {
                    treeLayer.changed()
                    if (selectedFeature && olView.getZoom()! > 20) {
                        olView.animate({
                            center: selectedFeature.getGeometry().getCoordinates(),
                            duration: 500,
                        })
                    }
                }
            ),
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
                    const featureCoords = (
                        map.selectedFeature?.getGeometry() as any
                    )?.getCoordinates()
                    if (centerOnSelected && featureCoords) {
                        olView.animate({
                            center: featureCoords,
                            zoom: Math.max(21, olView.getZoom() as number),
                            duration: 200,
                        })
                        map.setCenterOnSelected(false)
                    }
                }
            ),
            reaction(
                () => map.baseMap,
                () => olMap.setLayerGroup(getLayers(map.isDrone, treeLayer, vectorLayer))
            ),
            reaction(
                () => map.firstLoad,
                () => map.filterFeatures()
            ),
            reaction(
                () => map.filteredFeatures,
                (filteredFeatures: any) => {
                    if (map.filteredFeatures) {
                        treeLayer.setSource(
                            new VectorSource({
                                features: new GeoJSON().readFeatures(filteredFeatures),
                            })
                        )
                    } else {
                        console.warn('No features found')
                    }
                }
            ),
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
            disposer.forEach((dispose: IReactionDisposer) => {
                dispose()
            })
        }
    })

    return <div className={classes.mapCanvas} ref={mapEl} />
}
