import React, { Component } from 'react';
import {ellipseCoordsFromPhi, ponceletIterate} from '../math-utils';

class PonceletNGon extends Component {
  getEndPoints() {
    const {a, b, r, n} = this.props;
    var phi = this.props.phi;
    var points = [ellipseCoordsFromPhi(a, b, r, phi)];
    for (var i = 0; i < n; ++i) {
      phi = ponceletIterate(a, b, r, phi);
      points.push(ellipseCoordsFromPhi(a, b, r, phi));
    }
    return points;
  }
  renderLine(p, q, key) {
    const plot = this.props.plot;
    return <line fill="none" stroke="red" key={key}
      x1={plot(p.x)} y1={plot(p.y)}
      x2={plot(q.x)} y2={plot(q.y)} />;
  }
  render() {
    const endPoints = this.getEndPoints();
    const lines = [];
    for (var i = 0; i < endPoints.length-1; ++i) {
      lines.push(this.renderLine(endPoints[i], endPoints[i+1], `poncelet-chord-${i}`));
    }
    return (<g>{lines}</g>);
  }
}

export default PonceletNGon;
