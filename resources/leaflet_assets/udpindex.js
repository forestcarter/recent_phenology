import React from 'react';
import ReactDOM from 'react-dom';
import UDPMapapp from './components/udpMapapp'
import "./leaflet.css";
import "./images/marker-shadow.png";
import "./images/marker-icon-2x.png";

ReactDOM.render(<UDPMapapp/>, document.getElementById('app'));