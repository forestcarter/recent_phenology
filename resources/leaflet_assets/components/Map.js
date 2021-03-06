import React from "react";
import L from "leaflet";

const style = {
  height: "100%"
};

class Map extends React.Component {
    constructor(props) {
		super(props);
		this.onMapClick = this.onMapClick.bind(this);

		this.state = {
			currentMarker:null
		}
	}
	
     onMapClick(e){
		this.props.handleMapClick(e)
		if (this.state.currentMarker){
			this.state.currentMarker.remove()
		}
		let currentMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(this.map);
		this.setState({currentMarker: currentMarker});
	}

  componentDidMount() {
    // create map
    this.map = L.map("map", {
      center: [32.1874446, -110.9185017],
      zoom: 6,
      layers: []
	});
	this.map.on('click', this.onMapClick);

    const streets = L.tileLayer("https://a.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  
    const imagery = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '&copy; <a href="http://www.esri.com/">Esri</a>i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 18,
    });

    this.baseMaps = {
      "Imagery":imagery,
      "Streets": streets
    };
    this.overlaymaps={}
    this.allLayers=[]
	tiles_directories.sort().reverse();
    tiles_directories.forEach((element,index) => {
      if ((element.length)==15){
		const firstDate = new Date(element.slice(0, 4), 0, element.slice(4,7))
		const secondDate = new Date(element.slice(8, 12), 0, element.slice(12))
		const elementLabel = (firstDate.getMonth()+1)+"/"+firstDate.getDate()+" - "+(secondDate.getMonth()+1)+"/"+secondDate.getDate()
	
        var lyr1 = L.tileLayer(`tiles4/${element}/{z}/{x}/{y}.png`, { enable:true, tms: true, opacity: 0.6, attribution: ""});
        this.overlaymaps[elementLabel] = lyr1
        this.allLayers.push(lyr1)
        if (this.allLayers.length==1){
          lyr1.addTo(this.map);
        }
      }
    });
    
    L.control.layers(this.baseMaps,this.overlaymaps).addTo(this.map);
    this.map.scrollWheelZoom.disable()
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
