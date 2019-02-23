import React from "react";
import L from "leaflet";

const style = {
  height: "90vh"
};

class Map extends React.Component {
    constructor(props) {
        super(props);
    }
    
   
    
  componentDidMount() {
    // create map
    this.map = L.map("map", {
      center: [32.1874446, -110.9185017],
      zoom: 6,
      layers: []
    });

    const streets = L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  
    const imagery = L.tileLayer(
    'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '&copy; <a href="http://www.esri.com/">Esri</a>i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 18,
    });

    this.baseMaps = {
      "Imagery":imagery,
      "Streets": streets
    };
    this.overlaymaps={}
    this.allLayers=[]

    tiles_directories.forEach((element,index) => {
      if ((element.length)==15){
        var lyr1 = L.tileLayer(`tiles4/${element}/{z}/{x}/{y}.png`, { enable:true, tms: true, opacity: 0.6, attribution: ""});
        this.overlaymaps[element]= lyr1
        this.allLayers.push(lyr1)
        if (this.allLayers.length==1){
          lyr1.addTo(this.map);
        }
      }
    });
    
    // this.map.addLayer(lyr1);
    // this.overlaymaps = {"RMD_NDVI": lyr1}
    // L.control.layers(this.baseMaps,this.overlaymaps).addTo(this.map);
    L.control.layers(this.baseMaps,this.overlaymaps).addTo(this.map);

    this.map.on("click", this.props.handleMapClick);
    this.map.scrollWheelZoom.disable()
    ///////////LEGENDNEW////////////

  }

  componentDidUpdate({ mapSettings }) {
    if (this.props.mapSettings !== mapSettings) {
      this.allLayers.forEach(layer => {
        layer.setOpacity(this.props.mapSettings.fillOpacity)
      });
    }
}
  render() {
    return <div id="map" style={style} />;
  }
}
export default Map;
