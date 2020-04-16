import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Gauge.css';

const propTypes = {
  percentage: PropTypes.number,
};
const defaultProps = {
  percentage: 0,
};

const ProgressBar = props => (
  <div className="c-gauge-widget">
    <Filler percentage={props.percentage} />
  </div>
);

const Filler = props => (
  <div
    className="filler"
    style={{
      left: `${props.percentage - (props.percentage > 91 ? 8 : 0)}%`,
    }}
  >
    {props.percentage}
  </div>
);

class Gauge extends Component {
  constructor(props) {
    super(props);

    this.state = {
      percentage: 0,
    };
  }

  componentWillMount() {
    this.setState({
      percentage: this.props.percentage,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      percentage: nextProps.percentage,
    });
  }

  render() {
    const { percentage } = this.state;

    return (
      <div>
        <ProgressBar percentage={percentage} />
      </div>
    );
  }
}

Gauge.defaultProps = defaultProps;
Gauge.propTypes = propTypes;

Filler.propTypes = propTypes;
Filler.defaultProps = defaultProps;

ProgressBar.defaultProps = defaultProps;
ProgressBar.propTypes = propTypes;
export default Gauge;
