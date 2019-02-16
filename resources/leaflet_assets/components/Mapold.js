import React from "react";
import L from "leaflet";

const style = {
  width: "100%",
  height: "100%"
};

class Map extends React.Component {
    constructor(props) {
        super(props);
        this.getColor = this.getColor.bind(this);
    }
    getColor(x) {        
        return x < this.props.mapSettings.maxValue*(1/6)      ?    '#edf8fb':
            x < this.props.mapSettings.maxValue*(2/6)      ?   '#ccece6':
            x < this.props.mapSettings.maxValue*(3/6)      ?   '#99d8c9':
            x < this.props.mapSettings.maxValue*(4/6)      ?   '#66c2a4':
            x < this.props.mapSettings.maxValue*(5/6)     ?   '#41ae76':
            x < this.props.mapSettings.maxValue         ?   '#238b45':
                                                         '#005824' ;
    };
   
    
  componentDidMount() {
    console.log(Object.values(tileFolders))
    this.props.setDefaultMax(defaultmax[`${this.props.mapSettings.distinctOrTotal}_${this.props.mapSettings.myObsType}`])
    // create map
    this.map = L.map("map", {
      center: [18.69349,360-98.16245],
      zoom: 9,
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
    Object.values(tileFolders).forEach((item) => {
      var lyr1 = L.tileLayer(`tiles4/${item}/{z}/{x}/{y}.png`, { enable:true, tms: true, opacity: 1, attribution: ""});
    this.map.addLayer(lyr1);
    this.overlaymaps[item]=lyr1
    })
    
    L.control.layers(this.baseMaps,this.overlaymaps).addTo(this.map);

    const get_shp =(item,mymap)=>{
        let myStyle={
            weight: item.weight,
            color: item.color,
            opacity: item.opacity,
            fillColor: item.fillColor,
            fillOpacity: item.fillOpacity
        } 
        
        const onEachFeature =(feature, layer)=> {
            const handleFeatureClick=(event)=> {
                this.props.handleFeatureClick(event);
            }
            layer.on('click',handleFeatureClick)
        }
        let c2 = L.geoJson(item.geom, {
            style: myStyle,
            onEachFeature: onEachFeature
        })
        if (item.tableName=='linea_mtp'||item.tableName=='udp_puebla_4326'){
            c2.addTo(mymap)
        }
        return c2;
    }

    const processArray=(array, mymap, mybaseMaps,getColor,getOutline)=>{
      var dynamicLayer='notset'
      const overlayMaps=this.overlayMaps || {};
      array.forEach(function(item){
        let myLayer = get_shp(item,mymap,getColor,getOutline);
        if (item.tableName =='udp_puebla_4326'){
            dynamicLayer=myLayer
            mymap.fitBounds(myLayer.getBounds())
        }
        overlayMaps[item.displayName]=myLayer;
      });
      //L.control.layers(mybaseMaps, overlayMaps).addTo(mymap);
      return dynamicLayer
    }
    this.dynamicLayer=processArray(something, this.map, this.baseMaps, this.getColor,this.getOutline)
    this.map.on("click", this.props.handleMapClick);
    this.map.scrollWheelZoom.disable()
    ///////////LEGENDNEW////////////

    var legend = L.control({position: 'bottomleft'});
    this.makeDiv=(map)=> {
        grades=[];
        labels = [];
        var div = L.DomUtil.create('div', 'info legend'),grades,labels = [];
        L.DomUtil.addClass(div, "colorLegend border border-secondary p-2")
        
        div.innerHTML +='<i class="m-1" style="outline: 5px solid purple; background:white">&nbsp&nbsp&nbsp&nbsp</i> ' +'Sus datos <br><br>'
        div.innerHTML +='<i class="m-1" style="outline: 5px solid red; background:white">&nbsp&nbsp&nbsp&nbsp</i> ' +'Datos de otros monitores<br><br>'
        div.innerHTML +='<i class="m-1" style="outline: 5px solid yellow; background:white">&nbsp&nbsp&nbsp&nbsp</i> ' +'Selección<br>'
        return div;
    };
    legend.onAdd=this.makeDiv;
    legend.addTo(this.map);
    this.legend=legend;

        ///////////LEGENDOLD////////////

    var legend = L.control({position: 'bottomright'});

    this.makeDiv=(map)=> {
    grades=[];
    for (var i = 0; i <= 6; i++) {
        grades.push(this.props.mapSettings.maxValue*(i/6)),
        labels = [];
        }
    const getColor=this.getColor;
        var div = L.DomUtil.create('div', 'info legend'),grades,labels = [];
        L.DomUtil.addClass(div, "colorLegend border border-secondary")
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] ) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
                Math.floor(grades[i]) + (grades[i + 1] ? '&ndash;' + Math.floor(grades[i + 1]) + '<br>' : '+');
        }
        return div;
    };
    legend.onAdd=this.makeDiv;
    legend.addTo(this.map);
    this.legend=legend;
    /////////////////////////////////////////////////////
        
  }

    componentDidUpdate({ mapSettings }) {

        if (this.props.mapSettings !== mapSettings) {
            this.map.removeControl(this.legend); 
            var legend = L.control({position: 'bottomright'});
            legend.onAdd = this.makeDiv
            legend.addTo(this.map);
            this.legend=legend;
            const getColor=this.getColor;
            const getOutline=this.props.getOutline;
            const targetProperty = `${this.props.mapSettings.distinctOrTotal}_${this.props.mapSettings.myObsType}`;

        const myStyle= (feature, maxValue)=> {
            return {
            "fillColor": getColor(feature.properties[targetProperty]),
            "opacity": 1,
            "weight": getOutline(feature.properties,'weight'),
            "color":  getOutline(feature.properties,'color'),
            "fillOpacity": this.props.mapSettings.fillOpacity
            }
          } 
          this.dynamicLayer.setStyle(myStyle)
        }
    }
  render() {
    
    return <div id="map" style={style} />;
  }
}
export default Map;
