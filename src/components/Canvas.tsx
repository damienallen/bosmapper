import React, { useEffect, useRef } from 'react'
import { createUseStyles } from 'react-jss'

import OlMap from 'ol/Map'
import OlView from 'ol/View'
import OlLayerTile from 'ol/layer/Tile'
import OlSourceOSM from 'ol/source/OSM'
import GeoJSON from 'ol/format/GeoJSON'
import { Vector as VectorSource } from 'ol/source'
import { Vector as VectorLayer } from 'ol/layer'
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style'
import { fromLonLat } from 'ol/proj'

const geoJson = {
    'type': 'FeatureCollection',
    'crs': {
        'type': 'name',
        'properties': {
            'name': 'EPSG:4326'
        }
    },
    'features': [
        // {
        //     'type': 'Feature',
        //     'geometry': {
        //         'type': 'Point',
        //         'coordinates': [4.432852, 51.908761]
        //     },
        //     'properties': {
        //         'id': 'value0'
        //     }
        // },
        {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [51.908761, 4.432852]
            },
            'properties': {
                'id': 2
            }
        }
    ]
}

const image = new CircleStyle({
    radius: 5,
    fill: undefined,
    stroke: new Stroke({ color: 'red', width: 1 })
})

interface StyleDict {
    [key: string]: Style
}

const styles: StyleDict = {
    'Point': new Style({
        image: image
    }),
    'LineString': new Style({
        stroke: new Stroke({
            color: 'green',
            width: 1
        })
    }),
    'MultiLineString': new Style({
        stroke: new Stroke({
            color: 'green',
            width: 1
        })
    }),
    'MultiPoint': new Style({
        image: image
    }),
    'MultiPolygon': new Style({
        stroke: new Stroke({
            color: 'yellow',
            width: 1
        }),
        fill: new Fill({
            color: 'rgba(255, 255, 0, 0.1)'
        })
    }),
    'Polygon': new Style({
        stroke: new Stroke({
            color: 'blue',
            lineDash: [4],
            width: 3
        }),
        fill: new Fill({
            color: 'rgba(0, 0, 255, 0.1)'
        })
    }),
    'GeometryCollection': new Style({
        stroke: new Stroke({
            color: 'magenta',
            width: 2
        }),
        fill: new Fill({
            color: 'magenta'
        }),
        image: new CircleStyle({
            radius: 10,
            fill: undefined,
            stroke: new Stroke({
                color: 'magenta'
            })
        })
    }),
    'Circle': new Style({
        stroke: new Stroke({
            color: 'red',
            width: 2
        }),
        fill: new Fill({
            color: 'rgba(255,0,0,0.2)'
        })
    })
}

const styleFunction = (feature: any) => {
    let featureStyle: any = styles[feature.getGeometry().getType()]
    return featureStyle
}

const useStyles = createUseStyles({
    map: {
        height: '100%',
        zIndex: 100,

        '& .ol-zoom': {
            top: '0.5em',
            left: '0.5em',

            '@media (max-width: 576px)': {
                display: 'none'
            }
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
                background: 'rgba(0,60,136,0.5)',
                cursor: 'pointer'
            }
        },

        '& .ol-rotate': {
            display: 'none' // TODO: show/hide dynamically
        },

        '& .ol-attribution': {
            position: 'absolute',
            bottom: 0,
            right: 0,
            background: 'rgba(255,255,255,0.8)',
            borderRadius: '4px 0 0',
            fontSize: '0.6em',

            '& ul': {
                padding: '2px 4px',
                margin: 0,
                listStyleType: 'none',
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

export const Canvas: React.FC = () => {

    console.log('OL canvas init...')

    const mapEl: any = useRef<HTMLDivElement>()
    const classes = useStyles()

    // Load GeoJSON features
    const vectorSource = new VectorSource({
        features: (new GeoJSON()).readFeatures(geoJson)
    })

    const vectorLayer = new VectorLayer({
        source: vectorSource,
        style: styleFunction
    })

    const map = new OlMap({
        layers: [
            new OlLayerTile({
                source: new OlSourceOSM()
            }),
            vectorLayer
        ],
        view: new OlView({
            center: fromLonLat([4.432852, 51.908761]),
            zoom: 17
        })
    })

    useEffect(() => {
        map.setTarget(mapEl.current)

        setTimeout(() => {
            map.updateSize()
        }, 500)

        return () => {
            console.log('Unloading map')
            map.setTarget(undefined)
        }
    })

    return (
        <div className={classes.map} ref={mapEl} />
    )
}
