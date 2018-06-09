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
    const fullName = `${name} (${Math.round(n*theta)}/${n})`;
    const rnd = (x, d) => Number(x).toFixed(d);
    const parameterValues =
        `a=${rnd(a, 4)}, b=${rnd(b, 4)}, α=${rnd(alpha, 4)}, β=${rnd(beta, 4)}, ` +
        `m=${rnd(m, 4)}, j=${rnd(j, 4)}, u=${rnd(u, 4)}, ` +
        `K(m)=${rnd(ellipticK, 4)}, arccn(u, m)=${rnd(arccn, 4)}, θ=${rnd(theta, 6)}`;
    const onClick = () => this.props.selectParams(n, a, b, r);

    return (
      <div className="poncelet-preset-selector" key={key} onClick={onClick} title={parameterValues} >
        {fullName}
      </div>
    );
  }
  render() {
    const presets = presetData.map((data, i) =>
      this.renderPreset(`param-preset-${i}`, data));
    return (
      <div className="poncelet-presets-container">
        {presets}
      </div>
    );
  }
}

export default PonceletPresets;
