import React, { useEffect, useRef } from 'react'
import * as L from "leaflet";

function RenderedMap(props) {
    const mapRef = useRef(null);

    // UseEffect to execute code after map div is inserted
    useEffect(() => {
        var parse_georaster = require("georaster");
        var GeoRasterLayer = require("georaster-layer-for-leaflet");

        // initalize leaflet map
        if (!mapRef.current) {
            mapRef.current = L.map('map').setView([0, 0], 5);

            // add OpenStreetMap basemap
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapRef.current);
        }

        var url_to_geotiff_file = props.tiff;
        console.log("reading geotiff at " + url_to_geotiff_file)

        fetch(url_to_geotiff_file)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => {
                parse_georaster(arrayBuffer).then(georaster => {
                    console.log("georaster:", georaster);

                    /*
                        GeoRasterLayer is an extension of GridLayer,
                        which means can use GridLayer options like opacity.
              
                        Just make sure to include the georaster option!
              
                        Optionally set the pixelValuesToColorFn function option to customize
                        how values for a pixel are translated to a color.
              
                        http://leafletjs.com/reference-1.2.0.html#gridlayer
                    */
                    var layer = new GeoRasterLayer({
                        georaster: georaster,
                        opacity: 0.6,
                        resolution: 320 // optional parameter for adjusting display resolution
                    });
                    layer.addTo(mapRef.current);

                    mapRef.current.fitBounds(layer.getBounds());
                });
            });
    })


    return (
        <>
            <h3>{props.title}</h3>
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.0.3/dist/leaflet.css" />
            <div id="map" className="map"></div>
        </>
    )
}

export default RenderedMap