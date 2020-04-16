import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Widget, { widgetPropTypes } from 'components/Widget/Widget';
import HorizontalBar from './HorizontalBar';

const propTypes = {
  params: PropTypes.shape({
    data: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string,
        label: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
      })
    ),
  }).isRequired,
  widget: widgetPropTypes.isRequired,
};

class HorizontalBarWidget extends Component {
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
    const element = document.getElementById(`horizontal-bar-${id}`);

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

  renderChart() {
    const { widget: { id } } = this.props;
    const horizontalBarStyles = {
      height: '100%',
      position: 'relative',
    };

    return <div id={`horizontal-bar-${id}`} style={horizontalBarStyles} />;
  }

  render() {
    const { params: { data }, widget } = this.props;

    return (
      <Widget widget={widget}>
        {data == null ? null : this.renderChart()}
      </Widget>
    );
  }
}

HorizontalBarWidget.propTypes = propTypes;
export default HorizontalBarWidget;
