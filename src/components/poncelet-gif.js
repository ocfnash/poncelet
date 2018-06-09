import React, { Component } from 'react';
import {svgPathFromPts, svgEllipsePath, svgCirclePath} from '../svg-utils.js';
import {applyAffineTrans, getPonceletPoints} from '../math-utils';
import gifshot from 'gifshot';

const GifStateEnum = Object.freeze({
  blank: 0,
  working: 1,
  ready: 2
});

const N_FRAMES = 100;
const FRAME_DELAY_SECONDS = 0.05;
const BORDER_SIZE = 10;

class PonceletGif extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gifState: GifStateEnum.blank,
      gifContent: ''
    };
    this.generateGif = this.generateGif.bind(this);
    this.canvasRef = React.createRef();
  }
  generateSingleFrame(canvas, ellipsesPath2D, phi) {
    const {a, b, r, n, CENTER} = this.props;
    const ctx = canvas.getContext('2d', { alpha: false });
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'black';
    ctx.stroke(ellipsesPath2D);
    ctx.strokeStyle = 'red';
    ctx.stroke(new Path2D(svgPathFromPts(applyAffineTrans(getPonceletPoints(a, b, r, n, phi), CENTER, this.getScale()))));
    return canvas.toDataURL('image/png');
  }
  getScale() {
    return (this.props.SIZE - 2*BORDER_SIZE) / (2*Math.max(this.props.a, this.props.b));
  }
  generateFrames() {
    const {a, b, r, CENTER} = this.props;
    const scale = this.getScale();
    const phiStep = 2 * Math.PI / N_FRAMES;
    const ellipsesPath2D = new Path2D(svgCirclePath(CENTER, CENTER, scale) + ' ' + svgEllipsePath(CENTER, CENTER, scale * a / r, scale * b / r));
    const frames = [];
    for (var phi = 0; phi < 2 * Math.PI; phi += phiStep) {
      frames.push(this.generateSingleFrame(this.canvasRef.current, ellipsesPath2D, phi));
    }
    return frames;
  }
  generateGif() {
    this.setState({ gifState: GifStateEnum.working });
    const SIZE = this.props.SIZE;
    gifshot.createGIF({
      gifWidth: SIZE,
      gifHeight: SIZE,
      interval: FRAME_DELAY_SECONDS,
      images: this.generateFrames(),
    }, result => {
      if (!result.error) {
        this.setState({
          gifState: GifStateEnum.ready,
          gifContent: result.image
        });
      }
    });
  }
  renderGif() {
    const imgSize = this.props.SIZE / 2;
    var imgSrc = 'assets/images/gif-blank.gif';
    if (this.state.gifState === GifStateEnum.working) {
      imgSrc = 'assets/images/gif-working.gif';
    } else if (this.state.gifState === GifStateEnum.ready) {
      imgSrc = this.state.gifContent;
    }
    return (<img id="animated-poncelet-gif" width={imgSize} height={imgSize} src={imgSrc} alt="" />);
  }
  render() {
    const SIZE = this.props.SIZE;
    return (<div className="poncelet-gif-container">
        <canvas className="hidden-poncelet-gif-canvas" ref={this.canvasRef} width={SIZE} height={SIZE} ></canvas>
        <button onClick={this.generateGif} disabled={this.state.gifState === GifStateEnum.working}>Giz a GIF</button>
        {this.renderGif()}
      </div>
    );
  }
}

export default PonceletGif;
