import * as React from 'react';

import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceOSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';

interface Props { }

export class Canvas extends React.Component {

    private map: OlMap
    private mapDivId: string

    constructor(props: Props) {

        super(props);

        this.mapDivId = `map-${Math.random()}`;

        this.map = new OlMap({
            layers: [
                new OlLayerTile({
                    // name: 'OSM',
                    source: new OlSourceOSM()
                })
            ],
            view: new OlView({
                center: fromLonLat([37.40570, 8.81566]),
                zoom: 4
            })
        });
    }

    componentDidMount() {
        this.map.setTarget(this.mapDivId);
    }

    render() {
        return (
            <div>
                <div
                    id={this.mapDivId}
                    style={{
                        height: '400px'
                    }}
                />
            </div>
        );
    }
}
