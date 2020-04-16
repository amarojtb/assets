import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Expanded from 'components/Expanded/Expanded';
import { widgetPropTypes } from 'components/Widget/Widget';
import MapChart from './Map';

const propTypes = {
  params: PropTypes.shape({
    data: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
      })
    ),
    options: PropTypes.shape({
      indicator: PropTypes.string.isRequired,
      map: PropTypes.oneOf(['europe', 'world']).isRequired,
    }),
  }).isRequired,
  widget: widgetPropTypes.isRequired,
};

class MapExpanded extends Component {
  constructor(props) {
    super(props);

    this.map = null;
  }

  componentDidMount() {
    const { widget } = this.props;

    if (widget) {
      this.createChart();
    }
  }

  componentWillReceiveProps() {
    this.deleteChart();
  }

  componentDidUpdate() {
    this.createChart();
  }

  componentWillUnmount() {
    this.deleteChart();
  }

  createChart() {
    const { params, widget } = this.props;
    const element = document.getElementById(`map-expanded-${widget.id}`);

    if (!this.map && element) {
      this.map = new MapChart(element, params);
      this.forceUpdate();
    }
  }

  deleteChart() {
    if (this.map) {
      this.map.destroy();
      this.map = null;
    }
  }

  render() {
    const { params, widget } = this.props;

    return (
      <Expanded
        hasSidebar={false}
        icon={params.options.map}
        name="map"
        widget={widget}
      >
        {params.data && (
          <div
            id={`map-expanded-${widget.id}`}
            style={{
              height: '100%',
              position: 'relative',
            }}
          />
        )}
      </Expanded>
    );
  }
}

MapExpanded.propTypes = propTypes;

export default MapExpanded;
