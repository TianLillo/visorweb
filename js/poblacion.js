function getBounds() {
    const bounds = map.getBounds();
    var bbox = {
        minX: bounds.getWest(), //map.getBounds()._sw.ln
        minY: bounds.getSouth(), //map.getBounds()._sw.lat
        maxX: bounds.getEast(), //map.getBounds()._ne.lng
        maxY: bounds.getNorth(), //map.getBounds()._ne.lat
    };

    return bbox;
}

var datosH3Geojson;  // variable global

async function getFeaturesFGB(urlDatos, minZoom) {

    if (!map.getSource("mallaH3")) {

        map.addSource("mallaH3", {
            type: "geojson",
            data: null,
        });
        map.addLayer({
            id: "hexagonos",
            type: "fill",
            source: "mallaH3",
            minZoom: minZoom,
            paint: {
                "fill-color": "#0000ff",
                "fill-outline-color": "#ffffff",
                "fill-opacity": 0.1,  //trasparente
            },
        });


    }

     datosH3Geojson = { type: "FeatureCollection", features: [] };
    if (minZoom <= map.getZoom()) {

        var bbox = getBounds();

        var hexagonosH3GeoJson = flatgeobuf.deserialize(urlDatos, bbox);

        for await (let feature of hexagonosH3GeoJson) {

            datosH3Geojson.features.push(feature);
        }
        map.getSource("mallaH3").setData(datosH3Geojson);
    }else{
        map.getSource("mallaH3").setData(datosH3Geojson);
    }

    return datosH3Geojson;
}

async function creaBuffer(featurePunto, distancia, unidades) {

    if (!map.getSource("buffer")) {

        map.addSource("buffer", {
            type: "geojson",
            data: null,
        });
        map.addLayer({
            id: "buffer",
            type: "fill",
            source: "buffer",
            paint: {
                "fill-color": "#3bb2d0",
                "fill-outline-color": "#ffffff",
                "fill-opacity": 0.4, //trasparente
            },
        });

    }

    var bufferFeature = turf.buffer(featurePunto, distancia, {
        units: unidades
    });
    var bufferGeojson = turf.featureCollection([bufferFeature]);
    map.getSource("buffer").setData(bufferGeojson);

    return bufferFeature;

}

function borraBuffer(){

    if (map.getSource("buffer")) {
        map.getSource("buffer").setData( {
            type: "FeatureCollection",
            features: []
        });
    }   

}
