import React, { Component } from 'react';
import PonceletNGon from './poncelet-n-gon.js';
import ParamSlider from './param-slider.js';
import CayleyCurves from './cayley-curves.js';
import PonceletPresets from './poncelet-presets.js';
import {cayleyCubicRoots} from '../math-utils';
import './../css/App.css';

const SCALE = 45;
const SIZE = 500;
const CENTER = SIZE/2;

const PHI_RESOLUTION = 1000;
const ELLIPSE_PARAM_RESOLUTION = 1000;

const plot = p => CENTER + SCALE*p;
const phiFromIndex = i => 2 * Math.PI * i / PHI_RESOLUTION;
const minEllipseParam = 0.5;
const maxEllipseParam = 5.5; // Should have maxEllipseParam * 2 * SCALE < SIZE
const ellipseParamFromIndex = i => minEllipseParam + (maxEllipseParam - minEllipseParam) * i / ELLIPSE_PARAM_RESOLUTION;
const indexFromEllipseParam = p => ELLIPSE_PARAM_RESOLUTION * (p - minEllipseParam) / (maxEllipseParam - minEllipseParam);
const minEllipseIndex = indexFromEllipseParam(Math.ceil(minEllipseParam));
const maxEllipseIndex = indexFromEllipseParam(Math.floor(maxEllipseParam));
const guardEllipseIndex = i => i <= minEllipseIndex ? minEllipseIndex+1 : i;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      n: 7,
      iPhi: 50,
      iA: 300,
      iB: 680,
      r: 1
    };
    this.handleUpdatePhi = this.handleUpdatePhi.bind(this);
    this.handleUpdateA = this.handleUpdateA.bind(this);
    this.handleUpdateB = this.handleUpdateB.bind(this);
    this.handleUpdateN = this.handleUpdateN.bind(this);
    this.handlePresetSelected = this.handlePresetSelected.bind(this);
    this.handleCayleyCurvesClick = this.handleCayleyCurvesClick.bind(this);
  }
  handleUpdatePhi(iPhi) {
    this.setState({iPhi: iPhi});
  }
  handleUpdateA(iA) {
    this.setState({iA: guardEllipseIndex(iA)});
  }
  handleUpdateB(iB) {
    this.setState({iB: guardEllipseIndex(iB)});
  }
  handleUpdateN(delta) {
    this.setState({n: Math.max(1, this.state.n + delta)});
  }
  renderNControls() {
    return (
      <div className="iterations-count-container">
        <div className="iterations-count-control-button" onClick={() => this.handleUpdateN(-1)} >
          -
        </div>
        <div className="iterations-count-value">
          {this.state.n} edge{this.state.n === 1 ? '' : 's'}
        </div>
        <div className="iterations-count-control-button" onClick={() => this.handleUpdateN(1)} >
          +
        </div>
      </div>
    );
  }
  renderSliderControls() {
    const phiSliderMarks = {
      0: '0',
      [PHI_RESOLUTION]: '2π'
    };
    const ellipseParamSliderMarks = {
      [minEllipseIndex]: ellipseParamFromIndex(minEllipseIndex),
      [maxEllipseIndex]: ellipseParamFromIndex(maxEllipseIndex)
    };
    return (
      <div className="param-sliders-container">
        <ParamSlider onSliderUpdate={this.handleUpdatePhi} index={this.state.iPhi} min={0} max={PHI_RESOLUTION} marks={phiSliderMarks} />
        <ParamSlider onSliderUpdate={this.handleUpdateA} index={this.state.iA} min={0} max={ELLIPSE_PARAM_RESOLUTION} marks={ellipseParamSliderMarks} />
        <ParamSlider onSliderUpdate={this.handleUpdateB} index={this.state.iB} min={0} max={ELLIPSE_PARAM_RESOLUTION} marks={ellipseParamSliderMarks} />
      </div>
    );
  }
  handlePresetSelected(n, a, b, r) {
    this.setState({
        n: n,
        iA: indexFromEllipseParam(a),
        iB: indexFromEllipseParam(b),
        r: r
      });
  }
  handleCayleyCurvesClick(a, b) {
    console.log(`
      Ignoring request to select point a=${a}, b=${b} from Cayley Curves chart.
      This feature works but the region in the plane corresponding to real
      solutions is small and narrow. This raises UI issues that I'm declaring
      out of scope. Further more the problem is exacerbated by the bounds on a, b
      that I impose.`);
    // this.setState({
    //     iA: indexFromEllipseParam(a),
    //     iB: indexFromEllipseParam(b)
    //   });
  }
  render() {
    const phi = phiFromIndex(this.state.iPhi);
    const a = ellipseParamFromIndex(this.state.iA);
    const b = ellipseParamFromIndex(this.state.iB);
    const {r, n} = this.state;
    return (
      <div className="app">
        <div className="poncelet-n-gon-with-controls">
          <svg className="poncelet-container" width={SIZE} height={SIZE} >
            <ellipse cx={CENTER} cy={CENTER} rx={a/r*SCALE} ry={b/r*SCALE} fill="none" stroke="black" />
            <circle  cx={CENTER} cy={CENTER} r={SCALE} fill="none" stroke="black" />
            <PonceletNGon a={a} b={b} r={r} phi={phi} n={n} plot={plot} />
          </svg>
          {this.renderSliderControls()}
          {this.renderNControls()}
        </div>
        <CayleyCurves roots={cayleyCubicRoots(a, b, r)} onPointSelected={this.handleCayleyCurvesClick} />
        <PonceletPresets selectParams={this.handlePresetSelected} />
      </div>
    );
  }
}

export default App;
