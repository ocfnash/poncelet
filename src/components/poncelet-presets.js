import React, { Component } from 'react';

const presetData = require('../preset-data.json')['data'];

class PonceletPresets extends Component {
  renderPreset(key, data) {
    const {name, n, a, b, ellipticK, arccn} = data;
    const r = 1;
    const alpha = a*a/(r*r);
    const beta = b*b/(r*r);
    const m = (alpha - beta) / (alpha - 1);
    const j = (m*m - m + 1)**3 / (m*m-m)**2;
    const u = (alpha + beta - alpha*beta) / (alpha - beta + alpha*beta);
    const theta = arccn / (4*ellipticK);

    const rnd = (x, d) => Number(x).toFixed(d);
    const onClick = () => this.props.selectParams(n, a, b, r);

    return (
      <tr className="poncelet-preset-row" key={key} >
        <td className="poncelet-preset-cell-name" onClick={onClick}>{name} ({Math.round(n*theta)}/{n})</td>
        <td className="poncelet-preset-cell">{rnd(a, 4)}</td>
        <td className="poncelet-preset-cell">{rnd(b, 4)}</td>
        <td className="poncelet-preset-cell">{rnd(alpha, 4)}</td>
        <td className="poncelet-preset-cell">{rnd(beta, 4)}</td>
        <td className="poncelet-preset-cell">{rnd(m, 4)}</td>
        <td className="poncelet-preset-cell">{rnd(j, 4)}</td>
        <td className="poncelet-preset-cell">{rnd(u, 4)}</td>
        <td className="poncelet-preset-cell">{rnd(ellipticK, 4)}</td>
        <td className="poncelet-preset-cell">{rnd(arccn, 4)}</td>
        <td className="poncelet-preset-cell">{rnd(theta, 6)}</td>
      </tr>
    );
  }
  render() {
    const presets = presetData.map((data, i) =>
      this.renderPreset(`param-preset-${i}`, data));

    return (
      <table className="poncelet-presets-table">
        <thead>
          <tr className="poncelet-preset-header">
            <td className="poncelet-preset-cell"></td>
            <td className="poncelet-preset-cell">a</td>
            <td className="poncelet-preset-cell">b</td>
            <td className="poncelet-preset-cell">α</td>
            <td className="poncelet-preset-cell">β</td>
            <td className="poncelet-preset-cell">m</td>
            <td className="poncelet-preset-cell">j</td>
            <td className="poncelet-preset-cell">u</td>
            <td className="poncelet-preset-cell">K(m)</td>
            <td className="poncelet-preset-cell">arccn(u, m)</td>
            <td className="poncelet-preset-cell">θ</td>
          </tr>
        </thead>
        <tbody>
          {presets}
        </tbody>
      </table>
    );
  }
}

export default PonceletPresets;
