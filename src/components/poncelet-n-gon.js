import React, { Component } from 'react';
import {getPonceletPoints} from '../math-utils';

class PonceletNGon extends Component {
  renderLine(p, q, key) {
    const plot = this.props.plot;
    return <line fill="none" stroke="red" key={key}
      x1={plot(p.x)} y1={plot(p.y)}
      x2={plot(q.x)} y2={plot(q.y)} />;
  }
  render() {
    const {a, b, r, n, phi} = this.props;
    const endPoints = getPonceletPoints(a, b, r, n, phi);
    const lines = [];
    for (var i = 0; i < endPoints.length-1; ++i) {
      lines.push(this.renderLine(endPoints[i], endPoints[i+1], `poncelet-chord-${i}`));
    }
    return (<g>{lines}</g>);
  }
}

export default PonceletNGon;
