import React, { PureComponent } from 'react';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

export default class Graph extends PureComponent {
  render() {
    return (
      <BarChart
        width={480}
        height={380}
        data={this.props.valuesResult}
        
      >
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="NDVI" fill="#82ca9d" />
      </BarChart>
    );
  }
}