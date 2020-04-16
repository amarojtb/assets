import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Widget, { widgetPropTypes } from 'components/Widget/Widget';
import Linear from './Linear';
import './LinearWidget.css';

const propTypes = {
  params: PropTypes.shape({
    options: PropTypes.shape({
      duration: PropTypes.number.isRequired,
    }),
    series: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        total: PropTypes.number.isRequired,
        value: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
      })
    ),
    xAxis: PropTypes.shape({
      categories: PropTypes.arrayOf(PropTypes.string.isRequired),
    }).isRequired,
    yAxis: PropTypes.shape({
      title: PropTypes.shape({
        indicator: PropTypes.string.isRequired,
      }),
    }).isRequired,
  }).isRequired,
  widget: widgetPropTypes.isRequired,
};

class LinearWidget extends Component {
  constructor(props) {
    super(props);

    this.linear = null;
  }

  componentDidMount() {
    this.createChart();
  }

  componentWillReceiveProps(nextProps) {
    const { params } = nextProps;

    if (this.linear != null && params.series != null) {
      this.linear.setProps(params);
      this.linear.toggleAll(true);
      this.linear.update();
    } else if (this.linear != null && params.series == null) {
      this.deleteChart();
    }
  }

  componentDidUpdate() {
    this.createChart();
  }

  componentWillUnmount() {
    this.deleteChart();
  }

  createChart() {
    const { params, widget: { id, jsonParameters } } = this.props;
    const element = document.getElementById(`linear-${id}`);

    if (this.linear == null && element != null) {
      this.linear = new Linear(element, params, jsonParameters);
      this.forceUpdate();
    }
  }

  deleteChart() {
    if (this.linear != null) {
      this.linear.destroy();
      this.linear = null;
    }
  }

  renderChart() {
    const { widget: { id } } = this.props;

    return (
      <div className="c-linear-widget_wrapper">
        <div className="c-linear" id={`linear-${id}`} />
        {this.linear == null ? null : this.renderLegend()}
      </div>
    );
  }

  renderLegend() {
    const { params: { series } } = this.props;
    const { googleAnalyticsData } = this.linear.getProps();
    const items = [
      ...series
        .map(serieItem => ({
          ...serieItem,
          total: serieItem.value.reduce(
            (previous, current) => previous + current
          ),
        }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 5),
      ...googleAnalyticsData,
    ];

    return (
      <div className="c-linear-widget-legend">
        <ul className="c-linear-widget-legend__list list-unstyled">
          {items.map(item => this.renderLegendItem(item, items.length))}
        </ul>
      </div>
    );
  }

  renderLegendItem({ key, label, color }, numberOfItems) {
    return (
      <li
        className="c-linear-widget-legend__item text-truncate"
        key={key}
        style={{ width: `${100 / numberOfItems}%` }}
      >
        <span
          className="c-linear-widget-legend__item-color"
          style={{
            backgroundColor: (color && color) || this.linear.getColor(key),
          }}
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

LinearWidget.propTypes = propTypes;
export default LinearWidget;
