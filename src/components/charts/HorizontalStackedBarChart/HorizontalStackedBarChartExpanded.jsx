import hash from 'object-hash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import Expanded from 'components/Expanded/Expanded';
import { widgetPropTypes } from 'components/Widget/Widget';
import HorizontalStackedBarChart from './HorizontalStackedBarChart';
import './HorizontalStackedBarChartExpanded.css';

const propTypes = {
  intl: intlShape.isRequired,
  params: PropTypes.shape({
    options: PropTypes.shape({
      duration: PropTypes.number.isRequired,
    }),
    series: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
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

class HorizontalStackedBarChartExpanded extends Component {
  constructor(props) {
    super(props);

    this.horizontalStackedBar = null;
    this.dataHash = hash(props.params.series);
    this.state = {
      selectedKeys:
        props.params.series == null
          ? []
          : props.params.series.map(({ key }) => key),
    };

    this.handleToggleChart = this.handleToggleChart.bind(this);
    this.refExpandedCallback = this.refExpandedCallback.bind(this);
  }

  componentDidMount() {
    this.createChart();
  }

  componentWillReceiveProps(nextProps) {
    const { params: { series } } = nextProps;
    const dataHash = hash(series);

    if (this.horizontalStackedBar != null && series != null) {
      if (this.dataHash !== dataHash) {
        this.dataHash = dataHash;
        this.setState({ selectedKeys: series.map(({ key }) => key) });
        this.deleteChart();
      }
    } else if (this.horizontalStackedBar != null && series == null) {
      this.deleteChart();
    }
  }

  componentDidUpdate() {
    this.createChart();
  }

  componentWillUnmount() {
    this.deleteChart();
  }

  createChart(parameters = null) {
    const { params, widget: { id, jsonParameters } } = this.props;
    const element = document.getElementById(
      `horizontal-stacked-expanded-${id}`
    );

    if (
      this.horizontalStackedBar == null &&
      params.series != null &&
      element != null
    ) {
      this.horizontalStackedBar = new HorizontalStackedBarChart(
        element,
        (parameters && parameters) || params,
        jsonParameters
      );
      this.forceUpdate();
    }
  }

  deleteChart() {
    if (this.horizontalStackedBar != null) {
      this.horizontalStackedBar.destroy();
      this.horizontalStackedBar = null;
    }
  }

  handleToggleChart(checked, key) {
    const { params: { series } } = this.props;
    const { selectedKeys } = this.state;

    if (key == null) {
      this.setState({
        selectedKeys: checked ? series.map(item => item.key) : [],
      });
      this.horizontalStackedBar.toggleAll(checked);
    } else {
      this.setState({
        selectedKeys: checked
          ? [...selectedKeys, key]
          : selectedKeys.filter(keyItem => keyItem !== key),
      });
      this.horizontalStackedBar.toggle(key, checked);
    }
  }

  refExpandedCallback(ref) {
    this.expanded = (ref && ref.getWrappedInstance()) || null;
  }

  renderLegend() {
    const { series } = this.horizontalStackedBar.getProps();
    const { selectedKeys } = this.state;
    const filterSelectedItems = ({ key }) => selectedKeys.includes(key);
    const sortByValue = (a, b) => b.value - a.value;
    const items = series
      .filter(filterSelectedItems)
      .sort(sortByValue)
      .slice(0, 5);

    return (
      <div className="c-linear-expanded-legend">
        <ul className="c-linear-widget-legend__list list-unstyled">
          {(items &&
            items.map(item => this.renderLegendItem(item, items.length))) ||
            null}
        </ul>
      </div>
    );
  }

  renderLegendItem({ key, label, color }, numberOfItems) {
    const legendItemStyles = {
      width: `${100 / numberOfItems}%`,
    };
    const legendItemColorStyles = {
      backgroundColor:
        (color && color) || this.horizontalStackedBar.getColor(key),
    };

    return (
      <li
        className="c-linear-expanded-legend__item text-truncate"
        key={key}
        style={legendItemStyles}
      >
        <span
          className="c-linear-expanded-legend__item-color"
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
                this.horizontalStackedBar == null
                  ? 'transparent'
                  : this.horizontalStackedBar.getColor(serieItem.key),
            }))
            .sort((a, b) => b.value - a.value);

    return (
      <Expanded
        checkboxes={checkboxes}
        icon="linear"
        name="linear"
        showCumulateAll={false}
        onToggleChart={this.handleToggleChart}
        ref={this.refExpandedCallback}
        widget={widget}
      >
        {series == null ? null : (
          <div className="linear_wrapper--expanded">
            <div
              className="c-horizontal-stacked-bar"
              id={`horizontal-stacked-expanded-${widget.id}`}
            />
            {this.horizontalStackedBar && this.renderLegend()}
          </div>
        )}
      </Expanded>
    );
  }
}

HorizontalStackedBarChartExpanded.propTypes = propTypes;
export default injectIntl(HorizontalStackedBarChartExpanded, { withRef: true });
