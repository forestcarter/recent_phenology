import React from "react";
import Map from "./Map";
import Legend from "./Legend";
import Graph from "./Graph";
import MapControl from "./MapControl";

class Mapapp extends React.Component {
  constructor(props) {
    super(props);
    this.handleMapClick = this.handleMapClick.bind(this);
    this.handleOpacityChange = this.handleOpacityChange.bind(this);
    this.state = {
      loading:true,
      loadingText:"Click map to show graph",
      valuesResult:[],
      clickLocation: { lat: 18.69349, lng: 360 - 98.16245 },
      mapSettings: {
        fillOpacity: 0.6,
      }
    };
  }

  async handleMapClick(event) {
    this.setState({
      clickLocation: {
        lat: event.latlng.lat,
        lng: event.latlng.lng
      }
    });
    
	this.setState({loadingText: "Loading..."});
	this.setState({loading: true});

  

    async function getValues(lat,lng) {
      let myapi = "https://recentphenology.com/api/getvalues";
      if (window.location.host == "localhost:3000")
        myapi = "http://localhost:3000/api/getvalues";
      const rawResponse = await fetch(myapi, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;",
          mode: "cors"
        },
        body: JSON.stringify({
          lat: lat,
          lng: lng
          
        })
      });
      let dataResult = await rawResponse.json();
      return dataResult;
    }
   
      getValues(event.latlng.lat,event.latlng.lng).then(valuesResult => {
        
		this.setState({valuesResult: valuesResult});

		this.setState({loading: false});

        
      });

    }

  handleOpacityChange(value) {
    this.setState({
      mapSettings: {
        fillOpacity: value
      }
    });
  }

  render() {
    
    return (
      <div className='keepit100'>
        <div className='keepit100' id="pagecontainer">
            <div id="mapdiv">
              <Map 
              handleMapClick={this.handleMapClick}
              mapSettings={this.state.mapSettings} 
              />
            </div>
            
            <div id='graph'> 
                {
                  this.state.loading?
                  <div id='loading1'>
                    <div id='loading2'>
                      {this.state.loadingText}
                    </div>
                  </div>
                                  
                :
                <Graph valuesResult={this.state.valuesResult} />
                }
            </div>

            <div id="textareadiv">
              <p className='infotitles'>Data Source</p>
              <p className='textDisplay'>EMODIS data are obtained as 7 day composites. This viewer subtracts one composite from the subsequent week. These calculations result in positive values representing an increase in NDVI, negative values representing a decrease in NDVI, and zero representing no change. In the current symbology, red represents a decrease in NDVI, white represents small or no change, green represents an increase in NDVI, and blue represents a dramatic increase in NDVI. 
              </p>
            </div>

            <div id="legenddiv">
              <p className='infotitles'>Legend</p>
              <Legend 
              />
              
            </div>

            <div id="mapcontroldiv">
              <p className='infotitles'>Opacity</p>
              <MapControl handleOpacityChange={this.handleOpacityChange} />
            </div>
        </div>

        <div />
      </div>
    );
  }
}

export default Mapapp;
