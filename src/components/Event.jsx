import { Tooltip, Overlay } from "react-bootstrap";
import React from "react";
import ReactDOM from "react-dom";

export default class Event extends React.Component {
  constructor(props) {
    super();

    this.ref = React.createRef();
    this.state = {
      showTooltip: false
    };
  }

  openTooltip = () => {
    this.setState({
      showTooltip: true
    });
  }

  closeTooltip = () => {
    this.setState({
      showTooltip: false
    });
  }

  getTarget = () => {
    return ReactDOM.findDOMNode(this.ref.current);
  }

  render() {
    return (
      <div ref={this.ref}>
        <span
          onMouseOver={this.openTooltip}
          onMouseOut={this.closeTooltip}>
          {this.props.title}
        </span>
        <Overlay
          rootClose
          target={this.getTarget}
          show={this.state.showTooltip}
          placement="top"
          onHide={this.closeTooltip}>
          <Tooltip id="test">
            {this.props.event.notes !== "" && <div>{this.props.event.notes}</div>}
          </Tooltip>
        </Overlay>
      </div>
    );
  }
}
