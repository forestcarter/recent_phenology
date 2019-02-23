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
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="NDVI" fill="#82ca9d" />
      </BarChart>
    );
  }
}