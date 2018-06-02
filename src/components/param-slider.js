import React, { Component } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

class ParamSlider extends Component {
  render() {
    return (
      <div className="param-slider-container">
        <Slider
          min={this.props.min}
          max={this.props.max}
          value={this.props.index}
          marks={this.props.marks}
          onChange={this.props.onSliderUpdate} />
      </div>
    );
  }
}

export default ParamSlider;
