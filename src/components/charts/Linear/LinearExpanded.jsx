import hash from 'object-hash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import Expanded from 'components/Expanded/Expanded';
import { widgetPropTypes } from 'components/Widget/Widget';
import { multiArraySum } from 'services/AppUtils';
import Linear from './Linear';
import './LinearExpanded.css';

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

class LinearExpanded extends Component {
  static cumulateValues(array) {
    const values = array.reduce(
      (previous, current) => {
        previous.push(previous[previous.length - 1] + current);
        return previous;
      },
      [0]
    );

    values.shift();
    return values;
  }

  static cumulateAllValues(array) {
    const values = array.reduce((previous, current) => {
      previous.push(previous[previous.length - 1] + current);
      return previous;
    }, 0);

    values.shift();
    return values;
  }

  constructor(props) {
    super(props);

    this.linear = null;
    this.dataHash = hash(props.params.series);
    this.state = {
      cumulateAll: false,
      selectedKeys:
        props.params.series == null
          ? []
          : props.params.series.map(({ key }) => key),
    };

    this.handleToggleChart = this.handleToggleChart.bind(this);
    this.handleCumulateData = this.handleCumulateData.bind(this);
    this.handleCumulateAllData = this.handleCumulateAllData.bind(this);
    this.refExpandedCallback = this.refExpandedCallback.bind(this);
  }

  componentDidMount() {
    this.createChart();
  }

  componentWillReceiveProps(nextProps) {
    const { params: { series } } = nextProps;
    const dataHash = hash(series);

    if (this.linear != null && series != null) {
      const isCumulateChecked = this.expanded.getCumulateState();
      this.deleteChart();
      this.createChart({
        ...nextProps.params,
        series: isCumulateChecked
          ? series.map(serieItem => ({
              ...serieItem,
              value: LinearExpanded.cumulateValues(serieItem.value),
            }))
          : series,
      });
      this.linear.toggleSome(this.state.selectedKeys, true);
      this.linear.setProps({
        ...nextProps.params,
        series: isCumulateChecked
          ? series.map(serieItem => ({
              ...serieItem,
              value: LinearExpanded.cumulateValues(serieItem.value),
            }))
          : series,
      });
      this.linear.update();

      if (this.dataHash !== dataHash) {
        this.dataHash = dataHash;
        this.setState({ selectedKeys: series.map(({ key }) => key) });
        this.linear.toggleAll(true);
        this.linear.update();
      }
    } else if (this.linear != null && series == null) {
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
    const element = document.getElementById(`linear-expanded-${id}`);

    if (this.linear == null && params.series != null && element != null) {
      this.linear = new Linear(
        element,
        (parameters && parameters) || params,
        jsonParameters
      );
      this.forceUpdate();
    }
  }

  deleteChart() {
    if (this.linear != null) {
      this.linear.destroy();
      this.linear = null;
    }
  }

  handleToggleChart(checked, key) {
    const { params: { series } } = this.props;
    const { selectedKeys } = this.state;

    if (key == null) {
      this.setState({
        selectedKeys: checked ? series.map(item => item.key) : [],
      });
      this.linear.toggleAll(checked);
    } else {
      this.setState({
        selectedKeys: checked
          ? [...selectedKeys, key]
          : selectedKeys.filter(keyItem => keyItem !== key),
      });
      this.linear.toggle(key, checked);
    }

    this.linear.update();
  }

  handleCumulateData(isChecked) {
    const { params: { series } } = this.props;
    this.setState(
      {
        selectedKeys: series.map(({ key }) => key),
      },
      () => {
        this.linear.setProps({
          series: isChecked
            ? series.map(serieItem => ({
                ...serieItem,
                value: LinearExpanded.cumulateValues(serieItem.value),
              }))
            : series,
        });
        this.linear.init();
        this.linear.update();
      }
    );
  }

  handleCumulateAllData(isChecked) {
    const { params: { series }, intl: { formatMessage } } = this.props;

    if (isChecked) {
      const allSeriesCumulatedValues = multiArraySum(
        series.map(serie => serie.value)
      );
      this.linear.setProps({
        series: [
          {
            key: 'all',
            label: formatMessage({ id: 'Expanded.all' }),
            value: allSeriesCumulatedValues,
          },
        ],
      });
      this.linear.init();
      this.linear.update();
      this.setState({
        cumulateAll: isChecked,
        selectedKeys: [],
      });
    } else {
      this.linear.setProps({ series });
      this.linear.init();
      this.linear.update();
      this.setState({
        cumulateAll: isChecked,
        selectedKeys: series.map(({ key }) => key),
      });
    }
  }

  refExpandedCallback(ref) {
    this.expanded = (ref && ref.getWrappedInstance()) || null;
  }

  renderLegend() {
    const { series, googleAnalyticsData } = this.linear.getProps();
    const { selectedKeys, cumulateAll } = this.state;
    const filterSelectedItems = ({ key }) => selectedKeys.includes(key);
    const sortByValue = (a, b) => b.value - a.value;
    const items = [
      ...series
        .filter(cumulateAll ? e => e : filterSelectedItems)
        .sort(sortByValue)
        .slice(0, 5),
      ...googleAnalyticsData,
    ];

    return (
      <div className="c-linear-expanded-legend">
        <ul className="c-linear-widget-legend__list list-unstyled">
          {items.map(item => this.renderLegendItem(item, items.length))}
        </ul>
      </div>
    );
  }

  renderLegendItem({ key, label, color }, numberOfItems) {
    const legendItemStyles = {
      width: `${100 / numberOfItems}%`,
    };
    const legendItemColorStyles = {
      backgroundColor: (color && color) || this.linear.getColor(key),
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
                this.linear == null
                  ? 'transparent'
                  : this.linear.getColor(serieItem.key),
            }))
            .sort((a, b) => b.value - a.value);

    return (
      <Expanded
        checkboxes={checkboxes}
        icon="linear"
        name="linear"
        onCumulate={this.linear == null ? null : this.handleCumulateData}
        onCumulateAll={this.linear == null ? null : this.handleCumulateAllData}
        showCumulateAll={series && series.length > 1}
        onToggleChart={this.handleToggleChart}
        ref={this.refExpandedCallback}
        widget={widget}
      >
        {series == null ? null : (
          <div className="linear_wrapper--expanded">
            <div className="c-linear" id={`linear-expanded-${widget.id}`} />
            {this.linear && this.renderLegend()}
          </div>
        )}
      </Expanded>
    );
  }
}

LinearExpanded.propTypes = propTypes;
export default injectIntl(LinearExpanded, { withRef: true });
