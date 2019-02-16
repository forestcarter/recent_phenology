import React from "react";
//import BootstrapTable from 'react-bootstrap-table-next';

import Map from "./Map";
import MapControl from "./MapControl";


class Mapapp extends React.Component {
  constructor(props) {
    super(props);
    this.handleMapClick = this.handleMapClick.bind(this);

    this.handleOpacityChange = this.handleOpacityChange.bind(this);

    this.state = {
      markerPosition: { lat: 18.69349, lng: 360 - 98.16245 },
      mapSettings: {
        fillOpacity: 0.6,
      }
    };
  }

  async handleMapClick(event) {
    this.setState(prevState => ({
      markerPosition: {
        lat: event.latlng.lat,
        lng: event.latlng.lng
      }
    }));
  }

  handleOpacityChange(value) {
    this.setState(prevState => ({
      mapSettings: {
        fillOpacity: value
      }
    }));
  }

  render() {
    return (
      <div>
        <div className="container ">
          <div className="row justify-content-around align-items-center ">
            <div className="mymapdiv border border-dark">
              <Map 
              handleMapClick={this.handleMapClick}
              mapSettings={this.state.mapSettings} 
              />
            </div>

            <div className="mystatdiv p-1">
              <div className="withcontrol flex-column d-flex justify-content-between align-items-start">
                <MapControl handleOpacityChange={this.handleOpacityChange} />
              </div>
            </div>
          </div>
        </div>

        <div />
      </div>
    );
  }
}

export default Mapapp;
