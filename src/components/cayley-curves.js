import React, { Component } from 'react';
import {cayleyCoordsFromRoots, rootsFromCayleyCoords} from '../math-utils';

const LAYER_FILENAMES = {
  'axes':           'assets/images/axes.png',
  'triangles':      'assets/images/triangles.png',
  'quadrilaterals': 'assets/images/quadrilaterals.png',
  'pentagons':      'assets/images/pentagons.png',
  'hexagons':       'assets/images/hexagons.png',
  'septagons':      'assets/images/septagons.png',
};

const IMAGE_STYLE = {
  width: 500,
  height: 500
};

if (IMAGE_STYLE.width !== 500) {
  throw new Error(`Rather lazily, we do not support width value ${IMAGE_STYLE.width}`);
}

if (IMAGE_STYLE.height !== 500) {
  throw new Error(`Rather lazily, we do not support height value ${IMAGE_STYLE.height}`);
}

// Kludge alert: hard-coded values below (some exception safety above).
const AFFINE_SVG_TRANSFORM = {
  deltaX: 54.5,
  scaleX: 872,
  deltaY: 384,
  scaleY: 4690
};

const toSvgCoords = (x, y) => ({
  svgX: AFFINE_SVG_TRANSFORM.deltaX + x * AFFINE_SVG_TRANSFORM.scaleX,
  svgY: AFFINE_SVG_TRANSFORM.deltaY - y * AFFINE_SVG_TRANSFORM.scaleY
});

const fromSvgCoords = (svgX, svgY) => ({
  x: (svgX - AFFINE_SVG_TRANSFORM.deltaX) / AFFINE_SVG_TRANSFORM.scaleX,
  y: (AFFINE_SVG_TRANSFORM.deltaY - svgY) / AFFINE_SVG_TRANSFORM.scaleY
});

class CayleyCurves extends Component {
  constructor(props) {
    super(props);
    this.state = {
      layers: Object.keys(LAYER_FILENAMES).reduce(
        function(d, k) {
          d[k] = true;
          return d;
        }, {})
    };
    this.handleLayerToggle = this.handleLayerToggle.bind(this);
    this.handleSvgClick = this.handleSvgClick.bind(this);
  }
  handleLayerToggle(k) {
    const layers = this.state.layers;
    layers[k] = !layers[k];
    this.setState(layers: layers);
  }
  render() {
    return (
      <div className="cayley-curves-container">
        <div className="cayley-curve-plot-area" style={IMAGE_STYLE} >
          {this.renderLayerImages()}
          {this.renderPonceletPoint()}
        </div>
        <div className="cayley-curve-checkboxes">
          {this.renderLayerToggles()}
          <div className="cayley-curve-ellipsis">...</div>
        </div>
      </div>
    );
  }
  handleSvgClick(ev) {
    const {left, top} = ev.target.parentNode.getBoundingClientRect();
    const {x, y} = fromSvgCoords(ev.clientX - left, ev.clientY - top);
    const {realRootComps, maxImagComp} = rootsFromCayleyCoords(x, y);
    if (maxImagComp < 1e-6) {
      const a = Math.sqrt(realRootComps[1] / realRootComps[0]);
      const b = Math.sqrt(realRootComps[2] / realRootComps[0]);
      this.props.onPointSelected(a, b);
    }
    else {
      console.log(`Ignoring Cayley Curves click corresponding to complex point (maxImagComp=${maxImagComp}).`);
    }
  }
  renderPonceletPoint() {
    const {x, y} = cayleyCoordsFromRoots(this.props.roots);
    const {svgX, svgY} = toSvgCoords(x, y);
    return (
      <svg className="poncelet-point-svg-container" style={IMAGE_STYLE} onClick={this.handleSvgClick} >
        <circle cx={svgX} cy={svgY} r="3" className="poncelet-point-svg" />
      </svg>
    );
  }
  renderLayerImage(k) {
    return <img src={LAYER_FILENAMES[k]} className="cayley-curve-layer-image" style={IMAGE_STYLE} alt="" key={`cayley-curve-${k}`} />;
  }
  renderLayerImages() {
    return Object.keys(this.state.layers).map(k =>
      this.state.layers[k] ? this.renderLayerImage(k) : null);
  }
  renderLayerToggles() {
    return Object.keys(this.state.layers).filter(k => k !== 'axes').map(k => (
        <div key={`${k}-layer`} className="caley-curve-checkbox-container">
          <input type="checkbox" className="caley-curve-checkbox" onChange={() => this.handleLayerToggle(k)} checked={this.state.layers[k]} />{k}
        </div>
      )
    );
  }
}

export default CayleyCurves;
