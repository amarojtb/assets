import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Widget, { widgetPropTypes } from 'components/Widget/Widget';
import VerticalBar from './VerticalBar';
import './VerticalBarWidget.css';

const propTypes = {
  params: PropTypes.shape({
    options: PropTypes.shape({
      indicator: PropTypes.string.isRequired,
    }),
    series: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        value: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
      })
    ),
    xAxis: PropTypes.arrayOf(PropTypes.string.isRequired),
  }).isRequired,
  widget: widgetPropTypes.isRequired,
};

class VerticalBarWidget extends Component {
  constructor(props) {
    super(props);

    this.verticalBar = null;
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
    const props = this.props;
    const { params, widget: { id, jsonParameters } } = this.props;
    const element = document.getElementById(`vertical-bar-${id}`);

    if (this.verticalBar == null && element != null) {
      this.verticalBar = new VerticalBar(element, params, jsonParameters);
      this.forceUpdate();
    }
  }

  deleteChart() {
    if (this.verticalBar != null) {
      this.verticalBar.destroy();
      this.verticalBar = null;
    }
  }

  renderChart() {
    const { widget: { id } } = this.props;

    return (
      <div className="c-vertical-bar-widget_wrapper">
        <div className="c-vertical-bar" id={`vertical-bar-${id}`} />
        {this.verticalBar == null ? null : this.renderLegend()}
      </div>
    );
  }

  renderLegend() {
    const { params: { series } } = this.props;

    return (
      <div className="c-vertical-bar-widget-legend">
        <ul className="c-vertical-bar-widget-legend__list list-unstyled">
          {series.map(item => this.renderLegendItem(item, series.length))}
        </ul>
      </div>
    );
  }

  renderLegendItem({ key, label }, numberOfItems) {
    return (
      <li
        className="c-vertical-bar-widget-legend__item text-truncate"
        key={key}
        style={{ width: `${100 / numberOfItems}%` }}
      >
        <span
          className="c-vertical-bar-widget-legend__item-color"
          style={{ backgroundColor: this.verticalBar.getColor(key) }}
        />
        <span className="align-middle">{label}</span>
      </li>
    );
  }

  render() {
    const { params: { series }, widget } = this.props;
    
    return (
      <Widget widget={widget}>
        {series == null ? null : this.renderChart()}
      </Widget>
    );
  }
}

VerticalBarWidget.propTypes = propTypes;
export default VerticalBarWidget;
