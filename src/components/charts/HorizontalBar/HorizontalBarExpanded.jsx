import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Expanded from 'components/Expanded/Expanded';
import { widgetPropTypes } from 'components/Widget/Widget';
import HorizontalBar from './HorizontalBar';

const propTypes = {
  params: PropTypes.shape({
    data: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
      })
    ),
  }).isRequired,
  widget: widgetPropTypes.isRequired,
};

class HorizontalBarExpanded extends Component {
  constructor(props) {
    super(props);

    this.horizontalBar = null;
  }

  componentDidMount() {
    this.createChart();
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
    const { params, widget: { id }, widget } = this.props;
    const element = document.getElementById(`horizontal-bar-expanded-${id}`);

    if (this.horizontalBar == null && element != null) {
      this.horizontalBar = new HorizontalBar(element, params, widget);
      this.forceUpdate();
    }
  }

  deleteChart() {
    if (this.horizontalBar != null) {
      this.horizontalBar.destroy();
      this.horizontalBar = null;
    }
  }

  render() {
    const { params: { data }, widget } = this.props;
    const horizontalBarExpandedStyles = {
      height: '100%',
      position: 'relative',
    };

    return (
      <Expanded
        hasSidebar={false}
        icon="horizontal-bar"
        name="horizontal-bar"
        widget={widget}
      >
        {data == null ? null : (
          <div
            id={`horizontal-bar-expanded-${widget.id}`}
            style={horizontalBarExpandedStyles}
          />
        )}
      </Expanded>
    );
  }
}

HorizontalBarExpanded.propTypes = propTypes;
export default HorizontalBarExpanded;
