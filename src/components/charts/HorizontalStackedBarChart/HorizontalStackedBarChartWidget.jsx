import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Widget, { widgetPropTypes } from 'components/Widget/Widget';
import HorizontalStackedBarChart from './HorizontalStackedBarChart';
import './HorizontalStackedBarChartWidget.css';

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
    yAxis: PropTypes.shape({
      title: PropTypes.shape({
        indicator: PropTypes.string.isRequired,
      }),
    }).isRequired,
  }).isRequired,
  widget: widgetPropTypes.isRequired,
};

class HorizontalStackedBarChartWidget extends Component {
  constructor(props) {
    super(props);

    this.horizontalStackedBarChart = null;
  }

  componentDidMount() {
    this.createChart();
  }

  componentWillReceiveProps(nextProps) {
    const { params } = nextProps;

    if (this.horizontalStackedBarChart != null && params.series != null) {
      this.horizontalStackedBarChart.setProps(params);
      this.horizontalStackedBarChart.toggleAll(true);
      this.horizontalStackedBarChart.update(params);
    } else if (
      this.horizontalStackedBarChart != null &&
      params.series == null
    ) {
      this.deleteChart();
    }
    this.deleteChart();
  }

  componentDidUpdate() {
    this.createChart();
  }

  componentWillUnmount() {
    this.deleteChart();
  }

  createChart() {
    const { params, widget: { id, jsonParameters } } = this.props;
    const element = document.getElementById(`horizontalStackedBarChart-${id}`);

    if (this.horizontalStackedBarChart == null && element != null) {
      this.horizontalStackedBarChart = new HorizontalStackedBarChart(
        element,
        params,
        jsonParameters
      );
      this.forceUpdate();
    }
  }

  deleteChart() {
    if (this.horizontalStackedBarChart != null) {
      this.horizontalStackedBarChart.destroy();
      this.horizontalStackedBarChart = null;
    }
  }

  renderChart() {
    const { widget: { id } } = this.props;

    return (
      <div className="c-horizontalStackedBarChart-widget_wrapper">
        <div
          className="c-horizontalStackedBarChart"
          id={`horizontalStackedBarChart-${id}`}
        />
        {this.horizontalStackedBarChart == null ? null : this.renderLegend()}
      </div>
    );
  }

  renderLegend() {
    const { params: { series } } = this.props;

    const items =
      (series &&
        series
          .map(serieItem => ({
            ...serieItem,
            total: serieItem.value.reduce(
              (previous, current) => previous + current
            ),
          }))
          .sort((a, b) => b.total - a.total)
          .slice(0, 5)) ||
      null;

    return (
      <div className="c-linear-widget-legend">
        <ul className="c-linear-widget-legend__list list-unstyled">
          {(items &&
            items.map(item => this.renderLegendItem(item, items.length))) ||
            null}
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
            backgroundColor:
              (color && color) || this.horizontalStackedBarChart.getColor(key),
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

HorizontalStackedBarChartWidget.propTypes = propTypes;
export default HorizontalStackedBarChartWidget;
