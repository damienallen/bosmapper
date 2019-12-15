import React, { useEffect, useRef } from 'react'
import { createUseStyles } from 'react-jss'

import OlMap from 'ol/Map'
import OlView from 'ol/View'
import OlLayerTile from 'ol/layer/Tile'
import OlSourceOSM from 'ol/source/OSM'
import { fromLonLat } from 'ol/proj'


const useStyles = createUseStyles({
    map: {
        height: '100%',

        '& .ol-attribution': {
            position: 'absolute',
            bottom: 0,
            right: 0,
            background: '#fff',
            borderRadius: '4px 0 0',
            fontSize: '0.8em',
            opacity: 0.7,

            '& ul': {
                padding: '3px 5px',
                margin: 0,
                listStyleType: 'none',
                '& li': {
                    display: 'inline-block'
                }
            },

            '& button': {
                display: 'none'
            }
        }
    }
})

export const Canvas: React.FC = () => {

    console.log('OL canvas init...')

    const mapEl: any = useRef<HTMLDivElement>()
    const classes = useStyles()

    const map = new OlMap({
        layers: [
            new OlLayerTile({
                // name: 'OSM',
                source: new OlSourceOSM()
            })
        ],
        view: new OlView({
            center: fromLonLat([51.908761, 4.432852]),
            zoom: 4
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
