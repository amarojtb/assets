import hash from 'object-hash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Expanded from 'components/Expanded';
import { widgetPropTypes } from 'components/Widget';
import VerticalBar from './VerticalBar';
import './VerticalBarExpanded.css';

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

class VerticalBarExpanded extends Component {
  constructor(props) {
    super(props);

    this.dataHash = hash(props.params.series);
    this.verticalBar = null;

    this.state = {
      selectedKeys:
        props.params.series == null
          ? []
          : props.params.series.map(({ key }) => key),
    };

    this.handleToggleChart = this.handleToggleChart.bind(this);
  }

  componentDidMount() {
    this.createChart();
  }

  componentWillReceiveProps(nextProps) {
    const { params: { series } } = nextProps;
    const dataHash = hash(series);

    if (this.verticalBar != null && series != null) {
      if (this.dataHash !== dataHash) {
        this.dataHash = dataHash;
        this.setState({ selectedKeys: series.map(({ key }) => key) });
        this.deleteChart();
      }
    } else if (this.verticalBar != null && series == null) {
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
    const element = document.getElementById(`vertical-bar-expanded-${id}`);

    if (this.verticalBar == null && params.series != null && element != null) {
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

  handleToggleChart(checked, key) {
    const { params: { series } } = this.props;
    const { selectedKeys } = this.state;

    if (key == null) {
      this.setState({
        selectedKeys: checked ? series.map(item => item.key) : [],
      });
      this.verticalBar.toggleAll(checked);
    } else {
      this.setState({
        selectedKeys: checked
          ? [...selectedKeys, key]
          : selectedKeys.filter(keyItem => keyItem !== key),
      });
      this.verticalBar.toggle(key, checked);
    }
  }

  renderLegend() {
    const { params: { series } } = this.props;
    const { selectedKeys } = this.state;
    const filterSelectedItems = ({ key }) => selectedKeys.includes(key);
    const sortByValue = (a, b) =>
      b.value.reduce((current, next) => current + next, 0) -
      a.value.reduce((current, next) => current + next, 0);
    const items = series
      .filter(filterSelectedItems)
      .sort(sortByValue)
      .slice(0, 5);

    return (
      <div className="c-vertical-bar-expanded-legend p-horizontal--medium">
        <ul className="c-vertical-bar-expanded-legend__list list-unstyled">
          {items
            .filter(filterSelectedItems)
            .map(item => this.renderLegendItem(item, items.length))}
        </ul>
      </div>
    );
  }

  renderLegendItem({ key, label }, numberOfItems) {
    const legendItemStyles = {
      width: `${100 / numberOfItems}%`,
    };
    const legendItemColorStyles = {
      backgroundColor: this.verticalBar.getColor(key),
    };

    return (
      <li
        className="c-vertical-bar-widget-legend__item text-truncate"
        key={key}
        style={legendItemStyles}
      >
        <span
          className="c-vertical-bar-widget-legend__item-color"
          style={legendItemColorStyles}
        />
        <span className="align-middle">{label}</span>
      </li>
    );
  }

  render() {
    const { params: { series }, widget } = this.props;
    const { selectedKeys } = this.state;
    const checkboxes =
      series == null
        ? null
        : series
            .map(serieItem => ({
              ...serieItem,
              active: selectedKeys.includes(serieItem.key),
              backgroundColor:
                this.verticalBar == null
                  ? 'transparent'
                  : this.verticalBar.getColor(serieItem.key),
              total: serieItem.value.reduce(
                (previous, current) => previous + current
              ),
            }))
            .sort(
              (a, b) =>
                b.value.reduce((current, next) => current + next, 0) -
                a.value.reduce((current, next) => current + next, 0)
            );

    return (
      <Expanded
        checkboxes={checkboxes}
        icon="vertical-bar"
        name="vertical-bar"
        onToggleChart={this.handleToggleChart}
        widget={widget}
      >
        <div className="vertical-bar_wrapper--expanded">
          {series == null ? null : (
            <div
              className="c-vertical-bar"
              id={`vertical-bar-expanded-${widget.id}`}
            />
          )}
          {this.verticalBar == null ? null : this.renderLegend()}
        </div>
      </Expanded>
    );
  }
}

VerticalBarExpanded.propTypes = propTypes;
export default VerticalBarExpanded;
